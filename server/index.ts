import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prismaClient';
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});