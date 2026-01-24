import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prismaClient';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Resend } from 'resend'; //

dotenv.config();

const app = express();

// --- 1. IMPROVED CORS (Fixes frontend connection issues) ---
app.use(cors({
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload limit for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key_123";

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
    console.warn("⚠️  WARNING: FRONTEND_URL is not defined in .env! Defaulting to http://localhost:5173");
}
const finalFrontendUrl = FRONTEND_URL || "http://localhost:5173";

// --- RESEND EMAIL CONFIGURATION ---
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to: string, subject: string, html: string) {
    try {
        const { data, error } = await resend.emails.send({
            // 1. Send FROM the verified subdomain
            from: process.env.FROM_EMAIL || 'onboarding@info.artpark.online',

            // 2. Send TO the user
            to: [to],

            // 3. Replies go to YOUR real email (not the subdomain)
            reply_to: process.env.REPLY_TO_EMAIL || 'dev@artpark.com',

            subject: subject,
            html: html,
        });

        if (error) {
            console.error(`❌ Resend Error to ${to}:`, error);
            return;
        }

        console.log(`✅ Email sent to ${to}`, data);
    } catch (error) {
        console.error(`❌ System Error sending to ${to}:`, error);
    }
}

async function createAuthToken(userId: string, type: 'account_activation' | 'password_reset') {
    const tokenString = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.authToken.create({
        data: {
            token: tokenString,
            user_id: userId,
            type: type,
            expires_at: expiresAt,
        }
    });
    return tokenString;
}

// ==========================================
// AUTH ROUTES
// ==========================================

// 1. Invite User
app.post('/api/auth/invite-user', async (req, res) => {
    const { email, role, startupId } = req.body;
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: "User already exists" });

        const user = await prisma.user.create({
            data: {
                email,
                roles: [role || 'founder'],
                status: 'invited',
                password_hash: null,
            }
        });

        // Generate Token
        const tokenString = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await prisma.authToken.create({
            data: {
                token: tokenString,
                user_id: user.id,
                type: 'account_activation',
                expires_at: expiresAt,
                metadata: startupId ? { startupId } : undefined
            }
        });

        const link = `${finalFrontendUrl}/set-password?token=${tokenString}&type=activation`;
        console.log(`📨 INVITE LINK FOR ${email}: ${link}`);

        const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to ARTPark!</h2>
        <p>You have been invited as a <strong>${role}</strong>.</p>
        <p>Click the button below to activate your account:</p>
        <a href="${link}" style="display: inline-block; background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Activate Account</a>
      </div>
    `;
        await sendEmail(email, "Welcome to ARTPark", emailHtml);
        res.json({ message: "Invitation sent!" });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Failed to invite user" });
    }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "User not found" });
        if (!user.password_hash) return res.status(403).json({ error: "Account not activated." });

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign(
            { userId: user.id, roles: user.roles, email: user.email },
            SECRET_KEY,
            { expiresIn: '12h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: email.split('@')[0],
                roles: user.roles,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Internal error" });
    }
});

// 3. Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.json({ message: "If that email exists, a reset link has been sent." });

        const token = await createAuthToken(user.id, 'password_reset');
        const resetLink = `${finalFrontendUrl}/set-password?token=${token}&type=reset`;

        console.log(`🔑 RESET LINK: ${resetLink}`);

        const emailHtml = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Click below to reset your password:</p>
                <a href="${resetLink}" style="color: #2563EB;">Reset Password</a>
            </div>
        `;

        await sendEmail(email, "Password Reset Request", emailHtml);
        res.json({ message: "If that email exists, a reset link has been sent." });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Set Password
app.post('/api/auth/set-password', async (req, res) => {
    const { token, password } = req.body;
    if (!password) return res.status(400).json({ error: "Password is required" });

    try {
        const authToken = await prisma.authToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!authToken) return res.status(400).json({ error: "Invalid link." });
        if (authToken.is_used) return res.status(400).json({ error: "Link already used." });

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Activate User
        await prisma.user.update({
            where: { id: authToken.user_id! },
            data: { password_hash: hashedPassword, status: 'active' }
        });

        // 2. Mark Token Used
        await prisma.authToken.update({
            where: { id: authToken.id },
            data: { is_used: true }
        });

        // 3. AUTO-JOIN STARTUP
        const meta = authToken.metadata as any;
        if (meta?.startupId) {
            await prisma.userProfile.create({
                data: {
                    userId: authToken.user_id!,
                    fullName: "",
                    startupId: meta.startupId
                }
            });
            console.log(`🔗 Auto-linked user ${authToken.user_id} to startup ${meta.startupId}`);
        } else {
            const existingProfile = await prisma.userProfile.findUnique({ where: { userId: authToken.user_id! } });
            if (!existingProfile) {
                await prisma.userProfile.create({ data: { userId: authToken.user_id! } });
            }
        }

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        console.error("Set Password Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================================
// UNIFIED PROFILE ROUTES
// ==========================================

// 5. GET Profile
app.get('/api/user/profile', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "User ID required" });

    try {
        const userProfile = await prisma.userProfile.findUnique({
            where: { userId },
            include: { startup: true }
        });

        if (!userProfile) {
            return res.json({ profile: null, startup: null });
        }

        const { startup, ...profile } = userProfile;
        res.json({ profile, startup: startup || null });

    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// 6. SAVE Profile
app.post('/api/user/profile', async (req, res) => {
    console.log("👉 SAVE PROFILE REQUEST:", JSON.stringify(req.body, null, 2));

    const { userId, role, profile, startup } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID missing in payload" });
    }

    try {
        let startupId = null;

        // A. Handle Startup Logic (Founders Only)
        if (role === 'founder' && startup) {
            const existingProfile = await prisma.userProfile.findUnique({
                where: { userId },
                select: { startupId: true }
            });

            const safeFoundedYear = parseInt(startup.foundedYear) || new Date().getFullYear();
            const safeTeamSize = parseInt(startup.teamSize) || 1;

            const startupData = {
                name: startup.name || "My Startup",
                description: startup.description || "",
                website: startup.website || "",
                industry: startup.industry || "",
                location: startup.location || "",
                pitchDeckUrl: startup.pitchDeckUrl || "",
                foundedYear: safeFoundedYear,
                teamSize: safeTeamSize,
                isProfileComplete: !!(startup.name && startup.description && startup.industry)
            };

            if (existingProfile?.startupId) {
                await prisma.startup.update({
                    where: { id: existingProfile.startupId },
                    data: startupData
                });
                startupId = existingProfile.startupId;
            } else {
                const newStartup = await prisma.startup.create({
                    data: startupData
                });
                startupId = newStartup.id;
            }
        }

        // B. Handle User Profile Logic
        const profileData = {
            fullName: profile.fullName || "",
            phone: profile.phone || "",
            designation: profile.designation || "",
            organization: profile.organization || null,
            avatarUrl: profile.avatarUrl || null,
            linkedin: profile.linkedin || "",
            location: profile.location || "",
            bio: profile.bio || "",
        };

        const updatedProfile = await prisma.userProfile.upsert({
            where: { userId },
            update: {
                ...profileData,
                startupId: startupId || undefined
            },
            create: {
                userId,
                ...profileData,
                startupId: startupId || null
            }
        });

        res.json({ message: "Profile saved!", profile: updatedProfile });

    } catch (err: any) {
        console.error("❌ Save Profile Error Details:", err);
        res.status(500).json({ error: "Failed to save profile", details: err.message });
    }
});

// ==========================================
// PROJECT ROUTES
// ==========================================

// 7. Create Project
app.post('/api/projects', async (req, res) => {
    const { userId, name, description, domain } = req.body;
    if (!userId || !name) return res.status(400).json({ error: "Missing fields" });

    try {
        const userProfile = await prisma.userProfile.findUnique({
            where: { userId },
            select: { startupId: true }
        });

        if (!userProfile?.startupId) return res.status(403).json({ error: "No Startup Found" });

        const project = await prisma.project.create({
            data: {
                name,
                description,
                domain,
                startupId: userProfile.startupId,
                createdBy: userId,
                currentAIRL: 0
            }
        });
        res.json({ message: "Project created", project });
    } catch (err) {
        res.status(500).json({ error: "Failed to create project" });
    }
});

// 8. Get Projects
app.get('/api/projects', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "User ID required" });

    try {
        const userProfile = await prisma.userProfile.findUnique({
            where: { userId },
            select: { startupId: true }
        });

        if (!userProfile?.startupId) return res.json([]);

        const projects = await prisma.project.findMany({
            where: { startupId: userProfile.startupId },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// 9. Get Single Project
app.get('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) return res.status(404).json({ error: "Not found" });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: "Internal error" });
    }
});

// 10. Update Project
app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, domain } = req.body;
    try {
        const project = await prisma.project.update({
            where: { id },
            data: { name, description, domain }
        });
        res.json({ message: "Project updated", project });
    } catch (err) {
        res.status(500).json({ error: "Failed to update project" });
    }
});

// 11. Delete Project (Cascading Delete)
app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const submissions = await prisma.assessmentSubmission.findMany({
            where: { projectId: id },
            select: { id: true }
        });
        const submissionIds = submissions.map(s => s.id);

        await prisma.$transaction([
            prisma.assessmentAnswer.deleteMany({
                where: { submissionId: { in: submissionIds } }
            }),
            prisma.assessmentSubmission.deleteMany({
                where: { projectId: id }
            }),
            prisma.project.delete({
                where: { id }
            })
        ]);

        res.json({ message: "Project and related data deleted successfully" });
    } catch (err: any) {
        console.error("Delete Project Error:", err);
        res.status(500).json({ error: "Failed to delete project", details: err.message });
    }
});

// ==========================================
// ASSESSMENT CONFIGURATION ROUTES
// ==========================================

// 1. Get All Categories
app.get('/api/assessment/categories', async (req, res) => {
    try {
        const categories = await prisma.assessmentCategory.findMany({
            orderBy: { order: 'asc' }
        });
        console.log("📂 Fetched Categories:", categories.length);
        res.json(categories);
    } catch (err: any) {
        console.error("❌ Get Categories Error:", err.message);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// 2. Add Category
app.post('/api/assessment/categories', async (req, res) => {
    const { name } = req.body;
    console.log("➕ Add Category Request:", name);

    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Category name is required" });
    }

    try {
        const existing = await prisma.assessmentCategory.findUnique({
            where: { name: name.trim() }
        });

        if (existing) {
            console.warn("⚠️ Category already exists:", name);
            return res.status(409).json({ error: "Category already exists" });
        }

        const category = await prisma.assessmentCategory.create({
            data: { name: name.trim() }
        });

        console.log("✅ Category Created:", category);
        res.json(category);
    } catch (err: any) {
        console.error("❌ Add Category Error:", err.message);
        res.status(500).json({ error: "Failed to add category" });
    }
});

// 3. Rename Category
app.put('/api/assessment/categories', async (req, res) => {
    const { oldName, newName } = req.body;
    console.log(`✏️ Renaming Category: ${oldName} -> ${newName}`);

    try {
        await prisma.$transaction([
            prisma.assessmentCategory.update({
                where: { name: oldName },
                data: { name: newName }
            }),
            prisma.assessmentQuestion.updateMany({
                where: { category: oldName },
                data: { category: newName }
            })
        ]);

        console.log("✅ Rename Successful");
        res.json({ message: "Category updated" });
    } catch (err: any) {
        console.error("❌ Rename Error:", err.message);
        res.status(500).json({ error: "Failed to update category" });
    }
});

// 4. Delete Category
app.delete('/api/assessment/categories/:name', async (req, res) => {
    const { name } = req.params;
    console.log(`🗑️ Deleting Category: ${name}`);

    try {
        await prisma.$transaction([
            prisma.assessmentQuestion.updateMany({
                where: { category: name },
                data: { category: "Uncategorized", legacyCategory: name }
            }),
            prisma.assessmentCategory.delete({
                where: { name }
            })
        ]);

        console.log("✅ Delete Successful");
        res.json({ message: "Category deleted" });
    } catch (err: any) {
        console.error("❌ Delete Error:", err.message);
        res.status(500).json({ error: "Failed to delete category" });
    }
});

// --- QUESTIONS ---

// 5. Get All Questions
app.get('/api/assessment/questions', async (req, res) => {
    try {
        const questions = await prisma.assessmentQuestion.findMany({
            orderBy: { airlLevel: 'asc' }
        });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch questions" });
    }
});

// 6. Create or Update Question
app.post('/api/assessment/questions', async (req, res) => {
    const { id, text, category, airlLevel, isCritical, scope, expectations, commentPrompt } = req.body;
    console.log(`📝 Upsert Question: [${id ? 'UPDATE' : 'NEW'}] ${text?.substring(0, 20)}...`);

    try {
        const isRealId = id && id.length > 20;

        if (isRealId) {
            const updated = await prisma.assessmentQuestion.update({
                where: { id },
                data: {
                    text, category, airlLevel, isCritical, scope,
                    expectations, commentPrompt
                }
            });
            res.json(updated);
        } else {
            const newQuestion = await prisma.assessmentQuestion.create({
                data: {
                    text, category, airlLevel, isCritical, scope,
                    expectations, commentPrompt
                }
            });
            res.json(newQuestion);
        }
    } catch (err: any) {
        console.error("❌ Save Question Error:", err.message);
        res.status(500).json({ error: "Failed to save question" });
    }
});

// 7. Delete Question
app.delete('/api/assessment/questions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.assessmentQuestion.delete({ where: { id } });
        res.json({ message: "Question deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete question" });
    }
});

// ==========================================
// ASSESSMENT SUBMISSION & REVIEW ROUTES
// ==========================================

// 1. Submit Assessment
app.post('/api/assessment/submit', async (req, res) => {
    const { projectId, targetLevel, answers, founderNotes, evidenceLinks, evidenceFiles } = req.body;

    try {
        let submission = await prisma.assessmentSubmission.findFirst({
            where: {
                projectId,
                targetLevel: parseInt(targetLevel),
                status: { notIn: ['COMPLETED', 'REJECTED'] }
            }
        });

        if (!submission) {
            submission = await prisma.assessmentSubmission.create({
                data: {
                    projectId,
                    targetLevel: parseInt(targetLevel),
                    status: 'SUBMITTED',
                    submittedAt: new Date()
                }
            });
        } else {
            await prisma.assessmentSubmission.update({
                where: { id: submission.id },
                data: { status: 'SUBMITTED', submittedAt: new Date() }
            });
        }

        const answerPromises = Object.keys(answers).map(async (questionId) => {
            const response = answers[questionId];
            return prisma.assessmentAnswer.upsert({
                where: {
                    id: "temp-ignored"
                },
                create: {
                    submissionId: submission!.id,
                    questionId,
                    response: response as any,
                    notes: founderNotes[questionId],
                    evidenceUrl: evidenceLinks[questionId],
                    evidenceFile: evidenceFiles[questionId]
                },
                update: {
                    response: response as any,
                    notes: founderNotes[questionId],
                    evidenceUrl: evidenceLinks[questionId],
                    evidenceFile: evidenceFiles[questionId]
                }
            }).catch(async () => {
                await prisma.assessmentAnswer.deleteMany({
                    where: { submissionId: submission!.id, questionId }
                });
                return prisma.assessmentAnswer.create({
                    data: {
                        submissionId: submission!.id,
                        questionId,
                        response: response as any,
                        notes: founderNotes[questionId],
                        evidenceUrl: evidenceLinks[questionId],
                        evidenceFile: evidenceFiles[questionId]
                    }
                });
            });
        });

        await Promise.all(answerPromises);
        res.json({ message: "Assessment submitted successfully", submissionId: submission.id });

    } catch (err: any) {
        console.error("Submit Error:", err);
        res.status(500).json({ error: "Failed to submit assessment" });
    }
});

// 2. Get Task Pool
app.get('/api/reviewer/pool', async (req, res) => {
    try {
        const submissions = await prisma.assessmentSubmission.findMany({
            where: {
                status: 'SUBMITTED',
                reviewerId: null
            },
            include: {
                project: {
                    include: {
                        startup: true
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });

        const tasks = submissions.map(sub => ({
            id: sub.id,
            title: `AIRL Assessment - Level ${sub.targetLevel}`,
            startup: sub.project.startup.name,
            project: sub.project.name,
            type: 'AIRL Assessment',
            priority: 'Medium',
            due: '3 Days',
            status: 'Pending',
            assigneeId: null,
            submittedDate: sub.submittedAt
        }));

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch task pool" });
    }
});

// 3. Get My Tasks
app.get('/api/reviewer/my-tasks', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "User ID required" });

    try {
        const submissions = await prisma.assessmentSubmission.findMany({
            where: {
                reviewerId: userId,
                status: { in: ['IN_REVIEW', 'SUBMITTED'] }
            },
            include: {
                project: { include: { startup: true } }
            }
        });

        const tasks = submissions.map(sub => ({
            id: sub.id,
            title: `AIRL Assessment - Level ${sub.targetLevel}`,
            startup: sub.project.startup.name,
            type: 'AIRL Assessment',
            priority: 'Medium',
            due: '2 Days',
            status: 'In Progress',
            assigneeId: 'me',
            submittedDate: sub.submittedAt
        }));

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch my tasks" });
    }
});

// 4. Assign Task
app.post('/api/reviewer/assign', async (req, res) => {
    const { submissionId, reviewerId } = req.body;
    try {
        await prisma.assessmentSubmission.update({
            where: { id: submissionId },
            data: {
                reviewerId,
                status: 'IN_REVIEW'
            }
        });
        res.json({ message: "Task assigned" });
    } catch (err) {
        res.status(500).json({ error: "Failed to assign task" });
    }
});

// 5. Release Task
app.post('/api/reviewer/release', async (req, res) => {
    const { submissionId } = req.body;
    try {
        await prisma.assessmentSubmission.update({
            where: { id: submissionId },
            data: {
                reviewerId: null,
                status: 'SUBMITTED'
            }
        });
        res.json({ message: "Task released" });
    } catch (err) {
        res.status(500).json({ error: "Failed to release task" });
    }
});

// 6. Get Submission Status
app.get('/api/assessment/submission', async (req, res) => {
    const { projectId, targetLevel } = req.query;
    if (!projectId || !targetLevel) return res.status(400).json({ error: "Missing params" });

    try {
        const submission = await prisma.assessmentSubmission.findFirst({
            where: {
                projectId: String(projectId),
                targetLevel: parseInt(String(targetLevel)),
                status: { not: 'REJECTED' }
            }
        });
        res.json(submission || null);
    } catch (err) {
        res.status(500).json({ error: "Error fetching submission" });
    }
});

// 7. Recall Submission
app.post('/api/assessment/recall', async (req, res) => {
    const { submissionId } = req.body;
    try {
        const submission = await prisma.assessmentSubmission.findUnique({ where: { id: submissionId } });

        if (submission?.status !== 'SUBMITTED') {
            return res.status(403).json({ error: "Cannot recall. Reviewer has already started." });
        }

        await prisma.assessmentSubmission.update({
            where: { id: submissionId },
            data: { status: 'DRAFT' }
        });
        res.json({ message: "Recalled to draft" });
    } catch (err) {
        res.status(500).json({ error: "Failed to recall" });
    }
});

// 8. Get Submission Details for Reviewer
app.get('/api/reviewer/submission/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const submission = await prisma.assessmentSubmission.findUnique({
            where: { id },
            include: {
                project: {
                    include: { startup: true }
                },
                answers: true
            }
        });

        if (!submission) return res.status(404).json({ error: "Submission not found" });
        res.json(submission);
    } catch (err) {
        console.error("Get Submission Error:", err);
        res.status(500).json({ error: "Failed to fetch submission" });
    }
});

// 9. Submit Review
app.post('/api/reviewer/submission/:id/review', async (req, res) => {
    const { id } = req.params;
    const { evaluations, status } = req.body;

    try {
        const updatePromises = Object.keys(evaluations).map(questionId => {
            const ev = evaluations[questionId];
            return prisma.assessmentAnswer.updateMany({
                where: {
                    submissionId: id,
                    questionId: questionId
                },
                data: {
                    rating: ev.rating,
                    comments: ev.comment
                }
            });
        });

        await prisma.$transaction(updatePromises);

        await prisma.assessmentSubmission.update({
            where: { id },
            data: {
                status: status || 'COMPLETED',
                reviewedAt: new Date()
            }
        });

        if (status === 'COMPLETED') {
            const sub = await prisma.assessmentSubmission.findUnique({ where: { id } });
            if (sub) {
                await prisma.project.update({
                    where: { id: sub.projectId },
                    data: { currentAIRL: sub.targetLevel }
                });
            }
        }

        res.json({ message: "Review submitted successfully" });
    } catch (err) {
        console.error("Submit Review Error:", err);
        res.status(500).json({ error: "Failed to save review" });
    }
});

// ==========================================
// ONBOARDING (APPLICANT) ROUTES
// ==========================================

// 1. MODIFY EXISTING REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
    const { email, password, fullName, track } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ error: "User already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction: Create User + Profile + Empty Application
        // CHANGE: Set status to 'invited' instead of 'active'
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                    roles: ['applicant'],
                    status: 'invited', // <--- CHANGED from 'active'
                }
            });

            await tx.userProfile.create({
                data: { userId: newUser.id, fullName: fullName }
            });

            await tx.onboardingApplication.create({
                data: { userId: newUser.id, data: { venture: { track: track || 'startup' } }, status: 'DRAFT' }
            });

            return newUser;
        });

        // --- NEW: Generate Token & Send Email ---
        const tokenString = await createAuthToken(user.id, 'account_activation');

        // This link points to your frontend route (we will create this next)
        const verifyLink = `${finalFrontendUrl}/verify-email?token=${tokenString}`;

        const emailHtml = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Verify your email</h2>
                <p>Hi ${fullName},</p>
                <p>Thanks for starting your application with ARTPark. Please verify your email to continue.</p>
                <a href="${verifyLink}" style="display: inline-block; background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
            </div>
        `;

        await sendEmail(email, "Verify your ARTPark Account", emailHtml);

        // CHANGE: Do NOT return the JWT token here.
        res.json({ message: "Verification email sent" });

    } catch (err: any) {
        console.error("Register Error:", err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// 2. ADD NEW VERIFY ROUTE
app.post('/api/auth/verify-email', async (req, res) => {
    const { token } = req.body;

    try {
        // Find the token
        const authToken = await prisma.authToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!authToken) return res.status(400).json({ error: "Invalid token" });
        if (authToken.is_used) return res.status(400).json({ error: "Link already used" });

        // Check expiration
        if (new Date() > authToken.expires_at) {
            return res.status(400).json({ error: "Link expired" });
        }

        // Activate User
        const user = await prisma.user.update({
            where: { id: authToken.user_id! },
            data: { status: 'active' }
        });

        // Mark token as used
        await prisma.authToken.update({
            where: { id: authToken.id },
            data: { is_used: true }
        });

        // NOW generate and return the login token (JWT)
        const jwtToken = jwt.sign(
            { userId: user.id, roles: user.roles, email: user.email },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({
            token: jwtToken,
            user: { id: user.id, email: user.email, roles: user.roles }
        });

    } catch (err) {
        console.error("Verification Error:", err);
        res.status(500).json({ error: "Verification failed" });
    }
});

// 2. Save/Update Application (Holding Tank)
app.post('/api/onboarding/save', async (req, res) => {
    const { userId, data, submit } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const status = submit ? 'SUBMITTED' : 'DRAFT';
        const submittedAt = submit ? new Date() : null;

        // A. Save the Application Data
        const application = await prisma.onboardingApplication.upsert({
            where: { userId },
            update: {
                data: data,
                status: status,
                submittedAt: submittedAt ? submittedAt : undefined
            },
            create: {
                userId,
                data: data,
                status: status,
                submittedAt: submittedAt
            }
        });

        // B. CO-FOUNDER INVITE LOGIC (Magic Links)
        if (submit && data.coFounders && Array.isArray(data.coFounders)) {
            console.log("🚀 Processing Co-founder Invites...");

            for (const coFounder of data.coFounders) {
                const cfEmail = coFounder.email;
                const cfName = coFounder.name;

                if (!cfEmail) continue;

                // 1. Check if user already exists
                let cfUser = await prisma.user.findUnique({ where: { email: cfEmail } });

                // 2. If not, create a "Shadow User" (Invited state)
                if (!cfUser) {
                    cfUser = await prisma.user.create({
                        data: {
                            email: cfEmail,
                            roles: ['applicant'],
                            status: 'invited',
                            password_hash: null // No password needed yet
                        }
                    });

                    // Create placeholder profile
                    await prisma.userProfile.create({
                        data: { userId: cfUser.id, fullName: cfName }
                    });
                }

                // 3. Generate Magic Token (Reuse account_activation type)
                const tokenString = await createAuthToken(cfUser.id, 'account_activation');

                // 4. Create Magic Link
                // This points to the AssessmentInvite page we built earlier
                const magicLink = `${finalFrontendUrl}/assessment-start?token=${tokenString}`;

                const emailHtml = `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <h2 style="color: #111827;">Action Required: Team Assessment</h2>
                        <p>Hello ${cfName},</p>
                        <p><strong>${data.founder?.fullName}</strong> has added you to their team for <strong>${data.venture?.organizationName || 'their startup'}</strong>.</p>
                        <p>We need your input to complete the application. Please click the button below to take the <strong>Innovation Index Assessment</strong>.</p>
                        
                        <div style="margin: 24px 0;">
                            <a href="${magicLink}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                Start Assessment Now
                            </a>
                        </div>
                        
                        <p style="color: #6B7280; font-size: 14px;">No login or password required.</p>
                    </div>
                `;

                await sendEmail(cfEmail, "Action Required: Complete your Assessment", emailHtml);
                console.log(`✅ Magic Link sent to: ${cfEmail}`);
            }
        }

        res.json({ message: submit ? "Application Submitted & Team Invited!" : "Progress Saved", application });

    } catch (err: any) {
        console.error("Save Application Error:", err);
        res.status(500).json({ error: "Failed to save application" });
    }
});

// 3. Get Application (For Resuming)
// ==========================================
// SAVE/UPDATE APPLICATION (Fix Status Update)
// ==========================================
// ==========================================
// GET SINGLE APPLICATION (Reviewer Detail)
// ==========================================
app.get('/api/onboarding/application', async (req, res) => {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const application = await prisma.onboardingApplication.findUnique({
            where: { userId },
            include: {
                user: { include: { profile: true } }
            }
        });

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Merge DB Metadata with JSON Data
        const responseData = {
            // @ts-ignore
            ...(application.data || {}),
            // Ensure core fields are present even if JSON is stale
            founder: {
                // @ts-ignore
                ...(application.data?.founder || {}),
                email: application.user.email,
                fullName: application.user.profile?.fullName || "Founder"
            },
            status: application.status,
            submittedAt: application.submittedAt
        };

        res.json(responseData);

    } catch (error) {
        console.error("Fetch Single Application Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// server/index.ts

// ==========================================
// INNOVATION ASSESSMENT ROUTES
// ==========================================

app.post('/api/innovation/submit', async (req, res) => {
    console.log("🚀 Received Assessment Submission:", req.body);

    const { userId, answers, dimensionScores, totalScore, bucket } = req.body;

    // 1. Validate Payload
    if (!userId || totalScore === undefined || !bucket) {
        console.error("❌ Missing Data:", { userId, totalScore, bucket });
        return res.status(400).json({ error: "Missing required assessment data" });
    }

    try {
        // 2. Verify User Exists (Critical for Shadow Users)
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            console.error("❌ User not found for ID:", userId);
            return res.status(404).json({ error: "User not found. Invite might be invalid." });
        }

        // 3. Save to Database
        // We use 'create' so a user can retake it if needed (or you can change to 'upsert')
        const assessment = await prisma.innovationAssessment.create({
            data: {
                userId,
                answers: answers || {},
                dimensionScores: dimensionScores || {},
                totalScore,
                bucket,
            },
        });

        console.log("✅ Assessment Saved Successfully:", assessment.id);

        // 4. Update User Status (Optional but helpful)
        // If they were 'invited', we know they are now active/engaged
        if (user.status === 'invited') {
            await prisma.user.update({
                where: { id: userId },
                data: { status: 'active' }
            });
        }

        res.json({ success: true, assessmentId: assessment.id });

    } catch (error: any) {
        console.error("❌ Assessment Save Error:", error);
        res.status(500).json({ error: "Failed to save assessment to database." });
    }
});

// ==========================================
// EXPERT REVIEW & ONBOARDING FLOW ROUTES
// ==========================================

// 1. GET TEAM ASSESSMENTS
// Fetches assessment scores for the Founder AND all Co-founders to build the Team Matrix
// ==========================================
// GET TEAM ASSESSMENTS (ROBUST VERSION)
// ==========================================
app.get('/api/innovation/team-assessments', async (req, res) => {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: "Founder ID required" });
    }

    console.log(`🔍 [Assessment Lookup] Founder ID: ${userId}`);

    try {
        // 1. Fetch Founder Details
        const founder = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!founder) {
            console.log("❌ Founder not found in User table.");
            return res.json([]);
        }

        // 2. Fetch Application (to get Co-founder emails)
        const app = await prisma.onboardingApplication.findUnique({
            where: { userId },
            select: { data: true }
        });

        // 3. Build List of Emails (Founder + Co-founders)
        // @ts-ignore
        const coFounders = app?.data?.coFounders || [];
        const teamEmails = [
            founder.email,
            ...coFounders.map((c: any) => c.email)
        ].filter(Boolean).map(e => e.toLowerCase());

        console.log("📧 Searching for emails:", teamEmails);

        // 4. STRATEGY A: Search by Email Relation (Preferred)
        let assessments = await prisma.innovationAssessment.findMany({
            where: {
                user: {
                    email: { in: teamEmails, mode: 'insensitive' }
                }
            },
            include: {
                user: {
                    select: {
                        email: true,
                        profile: { select: { fullName: true } }
                    }
                }
            }
        });

        // 5. STRATEGY B: Fallback to Direct User ID (If Email search failed)
        // This handles cases where the relation might be tricky or email mismatch exists
        if (assessments.length === 0) {
            console.log("⚠️ Email search yielded 0 results. Trying direct UserId match...");
            const directAssessment = await prisma.innovationAssessment.findMany({
                where: { userId: userId },
                include: {
                    user: {
                        select: {
                            email: true, // <--- ✅ FIX 1: ADDED THIS
                            profile: { select: { fullName: true } }
                        }
                    }
                }
            });
            assessments = directAssessment;
        }

        console.log(`✅ Found ${assessments.length} assessment records.`);
        res.json(assessments);

    } catch (error) {
        console.error("❌ Team Assessment Error:", error);
        res.status(500).json({ error: "Failed to fetch team data" });
    }
});

// 2. ASSIGN EXPERT (Reviewer Action)
// Generates a magic link and emails the expert
app.post('/api/reviewer/assign-expert', async (req, res) => {
    const { applicantUserId, expertName, expertEmail } = req.body;
    try {
        const token = crypto.randomBytes(32).toString('hex');

        await prisma.expertReview.create({
            data: { applicantUserId, expertName, expertEmail, token }
        });

        // Generate Link
        // NOTE: Ensure this matches your frontend URL!
        const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/expert/review?token=${token}`;

        console.log(`🚀 Expert Invite Link: ${link}`); // Check server console for this link!

        // Send Email (Mock or Real)
        await sendEmail(expertEmail, "Review Request", `Click here: ${link}`);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Assignment failed" });
    }
});

// 3. GET EXPERT CONTEXT (Public/Token Access)
// Validates token and returns App Data + Team Assessments
app.get('/api/expert/context', async (req, res) => {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: "Token required" });
    }

    try {
        // A. Find the Review Request
        const review = await prisma.expertReview.findUnique({
            where: { token },
            include: { applicant: true }
        });

        if (!review) {
            console.error(`❌ Expert Token Not Found: ${token}`);
            return res.status(404).json({ error: "Invalid review link" });
        }

        if (review.status === 'COMPLETED') {
            return res.status(403).json({ error: "This review has already been submitted." });
        }

        const userId = review.applicantUserId;

        // B. Fetch Application Data (Handle NULL gracefully)
        const application = await prisma.onboardingApplication.findUnique({
            where: { userId }
        });

        // If application is missing (e.g. manual user creation), use empty object
        // @ts-ignore
        const appData = application?.data || {};

        // C. Fetch Team Assessments (Robust Email Matching)
        // 1. Get Founder Email
        const founderUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        // 2. Get Co-founder emails from the JSON data
        // @ts-ignore
        const coFounders = appData?.coFounders || [];

        // 3. Create list of emails (Safe check)
        const teamEmails = [
            founderUser?.email,
            ...coFounders.map((cf: any) => cf.email)
        ].filter(Boolean).map(e => e.toLowerCase()); // Normalize to lowercase

        // 4. Fetch Data (Case Insensitive)
        const assessments = await prisma.innovationAssessment.findMany({
            where: {
                user: {
                    email: { in: teamEmails, mode: 'insensitive' } // Critical for matching
                }
            },
            include: {
                user: {
                    select: { profile: { select: { fullName: true } } }
                }
            }
        });

        console.log(`✅ Loaded Expert Context for: ${review.expertName}. Found ${assessments.length} assessments.`);

        res.json({
            expertName: review.expertName,
            application: appData, // Returns empty object {} if null, preventing crash
            assessments: assessments
        });

    } catch (error) {
        console.error("❌ Expert Context Error:", error);
        // Return 500 so frontend handles it, but log the specific error
        res.status(500).json({ error: "System error loading application." });
    }
});

// 4. SUBMIT EXPERT REVIEW
app.post('/api/expert/submit', async (req, res) => {
    const { token, decision, comments } = req.body;
    try {
        const review = await prisma.expertReview.update({
            where: { token },
            data: { status: 'COMPLETED', decision, comments, respondedAt: new Date() }
        });

        await prisma.onboardingApplication.update({
            where: { userId: review.applicantUserId },
            data: { status: decision === 'APPROVED' ? 'EXPERT_APPROVED' : 'EXPERT_REJECTED' }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Submit failed" });
    }
});

// 5. ADMIN: FINAL ONBOARDING
// Promotes the Applicant to Founder
app.post('/api/admin/onboard', async (req, res) => {
    const { userId, status } = req.body; // status: APPROVED or REJECTED

    try {
        if (status === 'APPROVED') {
            // A. Update Application Status
            await prisma.onboardingApplication.update({
                where: { userId },
                data: { status: 'ONBOARDED' }
            });

            // B. PROMOTE USER ROLE (The Critical Step)
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const currentRoles = user?.roles || [];

            // Add 'founder' if not present, remove 'applicant'
            const newRoles = [...new Set([...currentRoles, 'founder'])].filter(r => r !== 'applicant');

            await prisma.user.update({
                where: { id: userId },
                data: { roles: newRoles as Role[] }
            });

            // Optional: You could create the initial 'Startup' record here if it doesn't exist yet

        } else {
            // Reject
            await prisma.onboardingApplication.update({
                where: { userId },
                data: { status: 'REJECTED' }
            });
        }

        res.json({ success: true });

    } catch (error) {
        console.error("Onboarding Error:", error);
        res.status(500).json({ error: "Failed to process decision" });
    }
});

// ---------------------------------------------------------
// 6. GET REVIEWER APPLICANT LIST (New)
// ---------------------------------------------------------
app.get('/api/reviewer/applicants', async (req, res) => {
    try {
        // 1. Fetch all applications with status 'SUBMITTED'
        const apps = await prisma.onboardingApplication.findMany({
            where: {
                status: {
                    in: ['SUBMITTED', 'EXPERT_REVIEW_PENDING', 'EXPERT_APPROVED', 'EXPERT_REJECTED']
                }
            },
            include: {
                user: {
                    include: { profile: true }
                }
            }
        });

        console.log("✅ Reviewer List Query found:", apps.length, "applications");
        apps.forEach(a => console.log(` - ID: ${a.userId} | Status: ${a.status}`));

        // 2. Process each application to calculate Team Score & Tier
        const results = await Promise.all(apps.map(async (app) => {
            // A. Basic Details
            const founderName = app.user.profile?.fullName || "Unknown Founder";
            // @ts-ignore
            const startupName = app.data?.venture?.organizationName || "Untitled Venture";
            // @ts-ignore
            const track = app.data?.venture?.track || "startup";

            // B. Identify Team Emails (Founder + Co-founders)
            const founderEmail = app.user.email;
            // @ts-ignore
            const coFounders = app.data?.coFounders || [];
            const teamEmails = [founderEmail, ...coFounders.map((c: any) => c.email)].filter(Boolean);

            // C. Fetch Assessments for the whole team
            const assessments = await prisma.innovationAssessment.findMany({
                where: { user: { email: { in: teamEmails as string[] } } }
            });

            // D. Calculate Team Max Score (The "Best Athlete" Logic)
            const DIMENSIONS = ['lap1', 'lap2', 'lap3', 'lap4', 'lap5'];
            const teamDims: Record<string, number> = { lap1: 0, lap2: 0, lap3: 0, lap4: 0, lap5: 0 };

            assessments.forEach(a => {
                const scores = a.dimensionScores as Record<string, number>;
                if (scores) {
                    DIMENSIONS.forEach(dim => {
                        if ((scores[dim] || 0) > teamDims[dim]) {
                            teamDims[dim] = scores[dim];
                        }
                    });
                }
            });

            // E. Determine Tier
            const teamScore = Object.values(teamDims).reduce((sum, v) => sum + v, 0);
            const dimsBelow10 = Object.values(teamDims).filter(v => v < 10).length;

            let teamTier = "RED";
            if (teamScore >= 75 && dimsBelow10 === 0) teamTier = "GREEN";
            else if ((teamScore >= 60 && teamScore <= 74) || (teamScore >= 75 && dimsBelow10 === 1)) teamTier = "YELLOW";
            else teamTier = "RED";

            return {
                id: app.userId, // We use userId to navigate to details
                startupName,
                founderName,
                track,
                submittedAt: app.submittedAt ? app.submittedAt.toISOString().split('T')[0] : "N/A",
                teamScore,
                teamTier
            };
        }));

        res.json(results);

    } catch (error) {
        console.error("Fetch Applicants Error:", error);
        res.status(500).json({ error: "Failed to fetch applicants" });
    }
});

// ==========================================
// ADMIN DASHBOARD & APPROVAL ROUTES
// ==========================================

// 1. ADMIN DASHBOARD STATS & LIST
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        // A. Stats Counts
        const total = await prisma.onboardingApplication.count();
        const pendingExpert = await prisma.onboardingApplication.count({ where: { status: 'EXPERT_REVIEW_PENDING' } });
        // "Action Required": Expert has approved, waiting for Admin
        const actionRequired = await prisma.onboardingApplication.count({ where: { status: 'EXPERT_APPROVED' } });
        const onboarded = await prisma.onboardingApplication.count({ where: { status: 'ONBOARDED' } });

        // B. Pending List (Priority: Expert Approved/Rejected)
        // Fetches applications that the Expert has finished reviewing
        const pendingApps = await prisma.onboardingApplication.findMany({
            where: {
                status: { in: ['EXPERT_APPROVED', 'EXPERT_REJECTED', 'SUBMITTED', 'EXPERT_REVIEW_PENDING'] }
            },
            orderBy: { updatedAt: 'desc' },
            take: 10,
            include: { user: { include: { profile: true } } }
        });

        // Map to cleaner UI format
        const recentActivity = pendingApps.map(app => ({
            id: app.userId,
            founderName: app.user.profile?.fullName || "Unknown",
            // @ts-ignore
            startupName: app.data?.venture?.organizationName || "Untitled Venture",
            status: app.status,
            date: app.updatedAt.toISOString().split('T')[0]
        }));

        res.json({
            stats: { total, pendingExpert, actionRequired, onboarded },
            recentActivity
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        res.status(500).json({ error: "Failed to load dashboard" });
    }
});

// 2. ADMIN DECISION CONTEXT (The "Final View" Data)
app.get('/api/admin/application-context/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log(`\n🔍 [Admin Context] Request for User ID: ${userId}`);

    try {
        // 1. Fetch Application
        const app = await prisma.onboardingApplication.findUnique({
            where: { userId },
            include: { user: { include: { profile: true } } }
        });

        if (!app) {
            console.log("❌ Application not found in DB.");
            return res.status(404).json({ error: "App not found" });
        }

        // --- 🕵️ DIAGNOSTIC: Check ALL reviews for this user (Ignoring Status) ---
        const allReviews = await prisma.expertReview.findMany({
            where: { applicantUserId: userId }
        });

        console.log(`📊 [Diagnostic] Found ${allReviews.length} TOTAL reviews in DB for this user.`);
        allReviews.forEach((r, i) => {
            console.log(`   [Review ${i + 1}] ID: ${r.id} | Status: '${r.status}' | Expert: ${r.expertName}`);
        });

        // 2. Fetch Only COMPLETED Reviews (The Real Query)
        const reviews = await prisma.expertReview.findMany({
            where: {
                applicantUserId: userId,
                status: 'COMPLETED' // ⚠️ This matches EXACTLY 'COMPLETED'
            },
            orderBy: { respondedAt: 'desc' }
        });

        console.log(`✅ [Filter Result] Sending ${reviews.length} 'COMPLETED' reviews to frontend.`);

        // 3. Assessment Logic
        const founderEmail = app.user.email;
        // @ts-ignore
        const coFounders = app.data?.coFounders || [];
        const emails = [founderEmail, ...coFounders.map((c: any) => c.email)]
            .filter(Boolean).map((e: any) => e.toLowerCase());

        const assessments = await prisma.innovationAssessment.findMany({
            where: { user: { email: { in: emails, mode: 'insensitive' } } },
            include: { user: { select: { email: true, profile: { select: { fullName: true } } } } }
        });

        res.json({
            // @ts-ignore
            application: { ...app.data, status: app.status, founder: { ...app.data.founder, fullName: app.user.profile?.fullName } },
            assessments,
            expertReviews: reviews
        });

    } catch (error) {
        console.error("❌ Admin Context Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 3. FINAL ONBOARDING ACTION (Already checked, ensuring robustness)
app.post('/api/admin/onboard', async (req, res) => {
    const { userId, status } = req.body; // 'APPROVED' or 'REJECTED'

    try {
        if (status === 'APPROVED') {
            // 1. Update App Status
            await prisma.onboardingApplication.update({
                where: { userId },
                data: { status: 'ONBOARDED' }
            });

            // 2. Update User Role to Founder
            const user = await prisma.user.findUnique({ where: { id: userId } });
            // Remove 'applicant', add 'founder' (using Set to handle uniqueness)
            const roles = new Set(user?.roles || []);
            roles.delete(Role.applicant);
            roles.add(Role.founder);

            await prisma.user.update({
                where: { id: userId }, // Note: depending on your schema, might be 'id' or 'userId'
                // If your user table PK is 'id', use { id: userId }
                data: { roles: Array.from(roles) as Role[] }
            });
        } else {
            // Reject
            await prisma.onboardingApplication.update({
                where: { userId },
                data: { status: 'REJECTED' }
            });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Action failed" });
    }
});

// ==========================================
// 7. GET ADMIN APPROVED LIST (New)
// ==========================================
// ==========================================
// 7. GET ADMIN APPROVED LIST (FIXED RELATION)
// ==========================================
app.get('/api/admin/approved-list', async (req, res) => {
    try {
        const apps = await prisma.onboardingApplication.findMany({
            where: { status: 'EXPERT_APPROVED' },
            include: {
                user: {
                    include: {
                        profile: true,
                        expertReviews: {
                            where: { status: 'COMPLETED', decision: 'APPROVED' },
                            take: 1,
                            // ✅ FIX: Sort by 'respondedAt' because 'createdAt' does not exist
                            orderBy: { respondedAt: 'desc' }
                        }
                    }
                }
            }
        });

        const results = await Promise.all(apps.map(async (app) => {
            const founderName = app.user.profile?.fullName || "Unknown";
            // @ts-ignore
            const startupName = app.data?.venture?.organizationName || "Untitled Venture";

            // ✅ FIX: Correctly access the nested array
            const expertName = app.user.expertReviews[0]?.expertName || "Unknown Expert";

            // Team Score Logic
            const founderEmail = app.user.email;
            // @ts-ignore
            const coFounders = app.data?.coFounders || [];
            const emails = [founderEmail, ...coFounders.map((c: any) => c.email)].filter(Boolean).map((e: any) => e.toLowerCase());

            const assessments = await prisma.innovationAssessment.findMany({
                where: { user: { email: { in: emails, mode: 'insensitive' } } }
            });

            const DIMENSIONS = ['lap1', 'lap2', 'lap3', 'lap4', 'lap5'];
            const teamDims: Record<string, number> = { lap1: 0, lap2: 0, lap3: 0, lap4: 0, lap5: 0 };

            assessments.forEach(a => {
                const scores = a.dimensionScores as Record<string, number>;
                DIMENSIONS.forEach(dim => { if ((scores[dim] || 0) > teamDims[dim]) teamDims[dim] = scores[dim]; });
            });
            const teamScore = Object.values(teamDims).reduce((a, b) => a + b, 0);

            return {
                id: app.userId,
                startupName,
                founderName,
                score: teamScore,
                endorsedBy: expertName,
                date: app.updatedAt.toISOString().split('T')[0]
            };
        }));

        res.json(results);

    } catch (error) {
        console.error("Admin List Error:", error);
        res.status(500).json({ error: "Failed to fetch list" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});