import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prismaClient';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();

// --- AI & VECTOR CONFIGURATION ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

const serviceKey = process.env.SUPABASE_SERVICE_KEY || "";
// Debugging keys (Safe to keep or remove in prod)
// console.log("SUPABASE_URL:", process.env.SUPABASE_URL);

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// Helper: Generate Embedding
async function generateEmbedding(text: string) {
    try {
        const cleanText = text.replace(/\n/g, ' ').trim();
        if (!cleanText) return null;

        const result = await embeddingModel.embedContent(cleanText);
        return result.embedding.values; // Returns array of 768 numbers
    } catch (e) {
        console.error("❌ Gemini Embedding Error:", e);
        return null;
    }
}

// --- 1. IMPROVED CORS ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key_123";
const finalFrontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// --- RESEND EMAIL CONFIGURATION ---
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to: string, subject: string, html: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@info.artpark.online',
            to: [to],
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

        await prisma.user.update({
            where: { id: authToken.user_id! },
            data: { password_hash: hashedPassword, status: 'active' }
        });

        await prisma.authToken.update({
            where: { id: authToken.id },
            data: { is_used: true }
        });

        // Auto-join startup
        const meta = authToken.metadata as any;
        if (meta?.startupId) {
            await prisma.userProfile.create({
                data: {
                    userId: authToken.user_id!,
                    fullName: "",
                    startupId: meta.startupId
                }
            });
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

        if (!userProfile) return res.json({ profile: null, startup: null });

        const { startup, ...profile } = userProfile;
        res.json({ profile, startup: startup || null });
    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// 6. SAVE Profile
app.post('/api/user/profile', async (req, res) => {
    const { userId, role, profile, startup } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID missing" });

    try {
        let startupId = null;

        if (role === 'founder' && startup) {
            const existingProfile = await prisma.userProfile.findUnique({
                where: { userId },
                select: { startupId: true }
            });

            const startupData = {
                name: startup.name || "My Startup",
                description: startup.description || "",
                website: startup.website || "",
                industry: startup.industry || "",
                location: startup.location || "",
                pitchDeckUrl: startup.pitchDeckUrl || "",
                foundedYear: parseInt(startup.foundedYear) || new Date().getFullYear(),
                teamSize: parseInt(startup.teamSize) || 1,
                isProfileComplete: !!(startup.name && startup.description && startup.industry)
            };

            if (existingProfile?.startupId) {
                await prisma.startup.update({
                    where: { id: existingProfile.startupId },
                    data: startupData
                });
                startupId = existingProfile.startupId;
            } else {
                const newStartup = await prisma.startup.create({ data: startupData });
                startupId = newStartup.id;
            }
        }

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
            update: { ...profileData, startupId: startupId || undefined },
            create: { userId, ...profileData, startupId: startupId || null }
        });

        res.json({ message: "Profile saved!", profile: updatedProfile });
    } catch (err: any) {
        console.error("Save Profile Error:", err);
        res.status(500).json({ error: "Failed to save profile" });
    }
});

// ==========================================
// PROJECT ROUTES
// ==========================================

app.post('/api/projects', async (req, res) => {
    const { userId, name, description, domain } = req.body;
    if (!userId || !name) return res.status(400).json({ error: "Missing fields" });

    try {
        const userProfile = await prisma.userProfile.findUnique({ where: { userId }, select: { startupId: true } });
        if (!userProfile?.startupId) return res.status(403).json({ error: "No Startup Found" });

        const project = await prisma.project.create({
            data: {
                name, description, domain,
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

app.get('/api/projects', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "User ID required" });

    try {
        const userProfile = await prisma.userProfile.findUnique({ where: { userId }, select: { startupId: true } });
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

app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await prisma.project.findUnique({ where: { id: req.params.id } });
        if (!project) return res.status(404).json({ error: "Not found" });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: "Internal error" });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    const { name, description, domain } = req.body;
    try {
        const project = await prisma.project.update({
            where: { id: req.params.id },
            data: { name, description, domain }
        });
        res.json({ message: "Project updated", project });
    } catch (err) {
        res.status(500).json({ error: "Failed to update project" });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const submissions = await prisma.assessmentSubmission.findMany({ where: { projectId: id }, select: { id: true } });
        const submissionIds = submissions.map(s => s.id);

        await prisma.$transaction([
            prisma.assessmentAnswer.deleteMany({ where: { submissionId: { in: submissionIds } } }),
            prisma.assessmentSubmission.deleteMany({ where: { projectId: id } }),
            prisma.project.delete({ where: { id } })
        ]);
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete project" });
    }
});

// ==========================================
// ASSESSMENT CONFIG ROUTES
// ==========================================

app.get('/api/assessment/categories', async (req, res) => {
    try {
        const categories = await prisma.assessmentCategory.findMany({ orderBy: { order: 'asc' } });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

app.post('/api/assessment/categories', async (req, res) => {
    const { name } = req.body;
    try {
        const existing = await prisma.assessmentCategory.findUnique({ where: { name: name.trim() } });
        if (existing) return res.status(409).json({ error: "Category already exists" });
        const category = await prisma.assessmentCategory.create({ data: { name: name.trim() } });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: "Failed to add category" });
    }
});

app.put('/api/assessment/categories', async (req, res) => {
    const { oldName, newName } = req.body;
    try {
        await prisma.$transaction([
            prisma.assessmentCategory.update({ where: { name: oldName }, data: { name: newName } }),
            prisma.assessmentQuestion.updateMany({ where: { category: oldName }, data: { category: newName } })
        ]);
        res.json({ message: "Category updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update category" });
    }
});

app.delete('/api/assessment/categories/:name', async (req, res) => {
    const { name } = req.params;
    try {
        await prisma.$transaction([
            prisma.assessmentQuestion.updateMany({ where: { category: name }, data: { category: "Uncategorized", legacyCategory: name } }),
            prisma.assessmentCategory.delete({ where: { name } })
        ]);
        res.json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete category" });
    }
});

app.get('/api/assessment/questions', async (req, res) => {
    try {
        const questions = await prisma.assessmentQuestion.findMany({ orderBy: { airlLevel: 'asc' } });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch questions" });
    }
});

app.post('/api/assessment/questions', async (req, res) => {
    const { id, text, category, airlLevel, isCritical, scope, expectations, commentPrompt } = req.body;
    try {
        if (id && id.length > 20) {
            const updated = await prisma.assessmentQuestion.update({
                where: { id },
                data: { text, category, airlLevel, isCritical, scope, expectations, commentPrompt }
            });
            res.json(updated);
        } else {
            const newQ = await prisma.assessmentQuestion.create({
                data: { text, category, airlLevel, isCritical, scope, expectations, commentPrompt }
            });
            res.json(newQ);
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to save question" });
    }
});

app.delete('/api/assessment/questions/:id', async (req, res) => {
    try {
        await prisma.assessmentQuestion.delete({ where: { id: req.params.id } });
        res.json({ message: "Question deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete question" });
    }
});

// ==========================================
// ASSESSMENT SUBMISSION ROUTES
// ==========================================

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
                data: { projectId, targetLevel: parseInt(targetLevel), status: 'SUBMITTED', submittedAt: new Date() }
            });
        } else {
            await prisma.assessmentSubmission.update({
                where: { id: submission.id },
                data: { status: 'SUBMITTED', submittedAt: new Date() }
            });
        }

        const answerKeys = Object.keys(answers || {});
        await Promise.all(answerKeys.map(async (questionId) => {
            const response = answers[questionId];
            if (!response) return;

            const existingAnswer = await prisma.assessmentAnswer.findFirst({
                where: { submissionId: submission!.id, questionId: questionId }
            });

            const answerData = {
                response: response as any,
                notes: founderNotes?.[questionId] || null,
                evidenceUrl: evidenceLinks?.[questionId] || null,
                evidenceFile: evidenceFiles?.[questionId] || null
            };

            if (existingAnswer) {
                await prisma.assessmentAnswer.update({ where: { id: existingAnswer.id }, data: answerData });
            } else {
                await prisma.assessmentAnswer.create({
                    data: { submissionId: submission!.id, questionId, ...answerData }
                });
            }
        }));

        res.json({ message: "Submitted successfully", submissionId: submission.id });
    } catch (err: any) {
        res.status(500).json({ error: "Failed to submit", details: err.message });
    }
});

app.get('/api/assessment/submission', async (req, res) => {
    const { projectId, targetLevel } = req.query;
    try {
        const submission = await prisma.assessmentSubmission.findFirst({
            where: {
                projectId: String(projectId),
                targetLevel: parseInt(String(targetLevel)),
                status: { notIn: ['REJECTED'] }
            },
            include: { answers: true }
        });
        res.json(submission || null);
    } catch (err) {
        res.status(500).json({ error: "Error checking status" });
    }
});

app.post('/api/assessment/recall', async (req, res) => {
    const { submissionId } = req.body;
    try {
        const submission = await prisma.assessmentSubmission.findUnique({ where: { id: submissionId } });
        if (submission?.status !== 'SUBMITTED') return res.status(403).json({ error: "Cannot recall." });
        await prisma.assessmentSubmission.update({ where: { id: submissionId }, data: { status: 'DRAFT' } });
        res.json({ message: "Recalled to draft" });
    } catch (err) {
        res.status(500).json({ error: "Failed to recall" });
    }
});

// ==========================================
// MONTHLY & QUARTERLY REPORT ROUTES
// ==========================================

// 1. Submit Monthly Report
app.post('/api/reports/monthly', async (req, res) => {
    const { userId, report } = req.body;
    
    if (!userId || !report) return res.status(400).json({ error: "Missing data" });

    try {
        // Get Startup ID
        const profile = await prisma.userProfile.findUnique({ where: { userId } });
        if (!profile?.startupId) return res.status(403).json({ error: "No startup linked" });

        // Upsert based on Month + Startup
        const submittedReport = await prisma.monthlyReport.upsert({
            where: {
                // Ideally add a @@unique([startupId, month]) in schema, 
                // but for now we search or create. Prisma 'upsert' needs a unique constraint.
                // We will use findFirst logic here to be safe if unique constraint isn't migrated yet.
                id: report.reportId.includes("auto") ? "new-uuid" : report.reportId
            },
            update: {
                status: 'Submitted',
                data: report,
                submittedAt: new Date()
            },
            create: {
                startupId: profile.startupId,
                month: report.month,
                status: 'Submitted',
                data: report,
                submittedAt: new Date()
            }
        });

        res.json({ success: true, reportId: submittedReport.id });
    } catch (err: any) {
        console.error("Submit Monthly Report Error:", err);
        res.status(500).json({ error: "Failed to submit report" });
    }
});

// 2. Submit Quarterly Report
app.post('/api/reports/quarterly', async (req, res) => {
    const { userId, report } = req.body;
    
    if (!userId || !report) return res.status(400).json({ error: "Missing data" });

    try {
        const profile = await prisma.userProfile.findUnique({ where: { userId } });
        if (!profile?.startupId) return res.status(403).json({ error: "No startup linked" });

        const submittedReport = await prisma.quarterlyReport.create({
            data: {
                startupId: profile.startupId,
                quarter: report.quarter,
                status: 'Submitted',
                data: report,
                submittedAt: new Date()
            }
        });

        res.json({ success: true, reportId: submittedReport.id });
    } catch (err: any) {
        console.error("Submit Quarterly Report Error:", err);
        res.status(500).json({ error: "Failed to submit report" });
    }
});

// 3. Get Founder History (To Sync State)
app.get('/api/reports/founder/history', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "User ID required" });

    try {
        const profile = await prisma.userProfile.findUnique({ where: { userId } });
        if (!profile?.startupId) return res.json({ monthly: [], quarterly: [] });

        const monthly = await prisma.monthlyReport.findMany({
            where: { startupId: profile.startupId },
            orderBy: { submittedAt: 'desc' }
        });

        const quarterly = await prisma.quarterlyReport.findMany({
            where: { startupId: profile.startupId },
            orderBy: { submittedAt: 'desc' }
        });

        res.json({ monthly, quarterly });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// ==========================================
// REVIEWER POOL & TASKS UPDATES
// ==========================================

// Update the existing /api/reviewer/pool route to include reports
app.get('/api/reviewer/pool', async (req, res) => {
    try {
        // 1. AIRL Assessments
        const submissions = await prisma.assessmentSubmission.findMany({
            where: { status: 'SUBMITTED', reviewerId: null },
            include: { project: { include: { startup: true } } }
        });

        // 2. Monthly Reports
        const monthlyReports = await prisma.monthlyReport.findMany({
            where: { status: 'Submitted', reviewerId: null },
            include: { startup: true }
        });

        // 3. Quarterly Reports
        const quarterlyReports = await prisma.quarterlyReport.findMany({
            where: { status: 'Submitted', reviewerId: null },
            include: { startup: true }
        });

        // Normalize
        const tasks = [
            ...submissions.map(sub => ({
                id: sub.id,
                originId: sub.id,
                title: `AIRL Assessment - Level ${sub.targetLevel}`,
                startup: sub.project.startup.name,
                project: sub.project.name,
                type: 'AIRL Assessment',
                priority: 'Medium',
                due: '3 Days',
                status: 'Pending',
                submittedDate: sub.submittedAt,
                kind: 'ASSESSMENT'
            })),
            ...monthlyReports.map(rep => ({
                id: rep.id,
                originId: rep.id,
                title: `${rep.month} Report`,
                startup: rep.startup.name,
                project: 'N/A',
                type: 'Monthly Report',
                priority: 'High',
                due: '5 Days',
                status: 'Pending',
                submittedDate: rep.submittedAt,
                kind: 'MONTHLY'
            })),
            ...quarterlyReports.map(rep => ({
                id: rep.id,
                originId: rep.id,
                title: `${rep.quarter} Strategy Review`,
                startup: rep.startup.name,
                project: 'N/A',
                type: 'Quarterly Report',
                priority: 'High',
                due: '7 Days',
                status: 'Pending',
                submittedDate: rep.submittedAt,
                kind: 'QUARTERLY'
            }))
        ];

        // Sort by date desc
        tasks.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());

        res.json(tasks);
    } catch (err) {
        console.error("Pool Error:", err);
        res.status(500).json({ error: "Failed to fetch task pool" });
    }
});

// Update Assign Route
app.post('/api/reviewer/assign', async (req, res) => {
    const { submissionId, reviewerId, kind } = req.body; // kind passed from frontend
    
    try {
        if (kind === 'MONTHLY') {
            await prisma.monthlyReport.update({
                where: { id: submissionId },
                data: { reviewerId, status: 'In Review' }
            });
        } else if (kind === 'QUARTERLY') {
            await prisma.quarterlyReport.update({
                where: { id: submissionId },
                data: { reviewerId, status: 'In Review' }
            });
        } else {
            // Default to Assessment
             await prisma.assessmentSubmission.update({
                where: { id: submissionId },
                data: { reviewerId, status: 'IN_REVIEW' }
            });
        }
        res.json({ message: "Task assigned" });
    } catch (err) {
        res.status(500).json({ error: "Failed to assign task" });
    }
});

// server/index.ts

app.get('/api/finance/summary', async (req, res) => {
    try {
        const records = await prisma.financeRecord.findMany();

        const sanctioned = records
            .filter(r => r.category === 'SANCTIONED')
            .reduce((acc, r) => acc + r.amount, 0);
            
        const received = records
            .filter(r => r.category === 'RECEIVED')
            .reduce((acc, r) => acc + r.amount, 0);
            
        const allocated = records
            .filter(r => r.category === 'ALLOCATED')
            .reduce((acc, r) => acc + r.amount, 0);
        
        // Calculated real-time balance
        const available = received - allocated;

        res.json({ sanctioned, received, allocated, available });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch summary" });
    }
});

// Update My Tasks Route
app.get('/api/reviewer/my-tasks', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "User ID required" });

    console.log(`⚖️ Review Decision for ${id}: ${status}`);

    try {
        const updatePromises = Object.keys(evaluations).map(questionId => {
            const ev = evaluations[questionId];

            // Map frontend values to backend schema
            // Frontend might send "status" (ACCEPTED/REJECTED), map to schema's "reviewerStatus"
            // Frontend might send "comment", map to schema's "reviewerComment"

            return prisma.assessmentAnswer.updateMany({
                where: {
                    submissionId: id,
                    questionId: questionId
                },
                data: {
                    // ✅ FIXED: Use correct schema field names
                    reviewerStatus: ev.status as any, // "ACCEPTED" | "REJECTED"
                    reviewerComment: ev.comment || null
                }
            });
        const assessments = await prisma.assessmentSubmission.findMany({
            where: { reviewerId: userId, status: { in: ['IN_REVIEW', 'SUBMITTED'] } },
            include: { project: { include: { startup: true } } }
        });

        const monthly = await prisma.monthlyReport.findMany({
            where: { reviewerId: userId, status: { not: 'Reviewed' } },
            include: { startup: true }
        });

        // ... (rest of the logic for updating submission status and auto-upgrade) ...

        await prisma.assessmentSubmission.update({
            where: { id },
            data: {
                // @ts-ignore
                status: status,
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
                console.log(`🚀 Project Upgraded to AIRL ${sub.targetLevel}`);
            }
        }

        res.json({ message: "Review submitted successfully" });

    } catch (err: any) {
        console.error("Submit Review Error:", err);
        res.status(500).json({ error: "Failed to save review", details: err.message });
        const quarterly = await prisma.quarterlyReport.findMany({
            where: { reviewerId: userId, status: { not: 'Reviewed' } },
            include: { startup: true }
        });

        const tasks = [
            ...assessments.map(sub => ({
                id: sub.id,
                title: `AIRL Assessment`,
                startup: sub.project.startup.name,
                type: 'AIRL Assessment',
                status: 'In Progress',
                due: '2 Days',
                priority: 'Medium',
                kind: 'ASSESSMENT'
            })),
            ...monthly.map(rep => ({
                id: rep.id,
                title: `${rep.month} Report`,
                startup: rep.startup.name,
                type: 'Monthly Report',
                status: 'In Review',
                due: '3 Days',
                priority: 'High',
                kind: 'MONTHLY'
            })),
             ...quarterly.map(rep => ({
                id: rep.id,
                title: `${rep.quarter} Review`,
                startup: rep.startup.name,
                type: 'Quarterly Report',
                status: 'In Review',
                due: '5 Days',
                priority: 'High',
                kind: 'QUARTERLY'
            }))
        ];

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// ==========================================
// ONBOARDING (APPLICANT) ROUTES
// ==========================================

app.post('/api/auth/register', async (req, res) => {
    const { email, password, fullName, track } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ error: "Missing fields" });

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ error: "User exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: { email, password_hash: hashedPassword, roles: ['applicant'], status: 'invited' }
            });
            await tx.userProfile.create({ data: { userId: newUser.id, fullName } });
            await tx.onboardingApplication.create({
                data: { userId: newUser.id, data: { venture: { track: track || 'startup' } }, status: 'DRAFT' }
            });
            return newUser;
        });

        const tokenString = await createAuthToken(user.id, 'account_activation');
        const verifyLink = `${finalFrontendUrl}/verify-email?token=${tokenString}`;
        
        const emailHtml = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Verify Email</h2>
                <p>Hi ${fullName}, please verify your email to continue.</p>
                <a href="${verifyLink}" style="background-color: #2563EB; color: white; padding: 10px 20px;">Verify</a>
            </div>
        `;
        await sendEmail(email, "Verify Account", emailHtml);
        res.json({ message: "Verification email sent" });
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});

app.post('/api/auth/verify-email', async (req, res) => {
    const { token } = req.body;
    try {
        const authToken = await prisma.authToken.findUnique({ where: { token }, include: { user: true } });
        if (!authToken || authToken.is_used || new Date() > authToken.expires_at) return res.status(400).json({ error: "Invalid/Expired link" });

        const user = await prisma.user.update({ where: { id: authToken.user_id! }, data: { status: 'active' } });
        await prisma.authToken.update({ where: { id: authToken.id }, data: { is_used: true } });

        const jwtToken = jwt.sign({ userId: user.id, roles: user.roles, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token: jwtToken, user: { id: user.id, email: user.email, roles: user.roles } });
    } catch (err) {
        res.status(500).json({ error: "Verification failed" });
    }
});

app.post('/api/onboarding/save', async (req, res) => {
    const { userId, data, submit } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const status = submit ? 'SUBMITTED' : 'DRAFT';
        const submittedAt = submit ? new Date() : undefined;

        const application = await prisma.onboardingApplication.upsert({
            where: { userId },
            update: { data, status, submittedAt },
            create: { userId, data, status, submittedAt: submit ? new Date() : null }
        });

        // Vector Indexing
        const venture = data.venture || {};
        const searchText = `${venture.organizationName} ${venture.industry} ${venture.oneLiner} ${venture.solutionDescription}`.trim();
        if (searchText.length > 50) {
            generateEmbedding(searchText).then(async (emb) => {
                if (emb) await supabase.from('ApplicationEmbedding').upsert({ applicationId: userId, content: searchText, embedding: emb }, { onConflict: 'applicationId' });
            });
        }

        // Co-founder Invites
        if (submit && Array.isArray(data.coFounders)) {
            for (const cf of data.coFounders) {
                if (!cf.email) continue;
                let cfUser = await prisma.user.findUnique({ where: { email: cf.email } });
                if (!cfUser) {
                    cfUser = await prisma.user.create({ data: { email: cf.email, roles: ['applicant'], status: 'invited' } });
                    await prisma.userProfile.create({ data: { userId: cfUser.id, fullName: cf.name } });
                }
                const token = await createAuthToken(cfUser.id, 'account_activation');
                const link = `${finalFrontendUrl}/assessment-start?token=${token}`;
                await sendEmail(cf.email, "Complete Assessment", `<a href="${link}">Start Now</a>`);
            }
        }
        res.json({ message: submit ? "Submitted" : "Saved", application });
    } catch (err) {
        res.status(500).json({ error: "Save failed" });
    }
});

app.get('/api/onboarding/application', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "User ID required" });

    try {
        const app = await prisma.onboardingApplication.findUnique({
            where: { userId },
            include: { user: { include: { profile: true } } }
        });
        if (!app) return res.status(404).json({ error: "Not found" });

        const resData = {
            ...(app.data as any || {}),
            founder: { ...((app.data as any)?.founder || {}), email: app.user.email, fullName: app.user.profile?.fullName },
            status: app.status,
            submittedAt: app.submittedAt
        };
        res.json(resData);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ==========================================
// INNOVATION ASSESSMENT ROUTES
// ==========================================

app.post('/api/innovation/submit', async (req, res) => {
    const { userId, answers, dimensionScores, totalScore, bucket } = req.body;
    if (!userId || totalScore === undefined) return res.status(400).json({ error: "Missing data" });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const assessment = await prisma.innovationAssessment.create({
            data: { userId, answers: answers || {}, dimensionScores: dimensionScores || {}, totalScore, bucket }
        });

        if (user.status === 'invited') {
            await prisma.user.update({ where: { id: userId }, data: { status: 'active' } });
        }
        res.json({ success: true, assessmentId: assessment.id });
    } catch (err) {
        res.status(500).json({ error: "Failed to save assessment" });
    }
});

app.get('/api/innovation/team-assessments', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "ID required" });

    try {
        const founder = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
        if (!founder) return res.json([]);

        const app = await prisma.onboardingApplication.findUnique({ where: { userId }, select: { data: true } });
        const cfs = (app?.data as any)?.coFounders || [];
        const emails = [founder.email, ...cfs.map((c: any) => c.email)].filter(Boolean);

        let assessments = await prisma.innovationAssessment.findMany({
            where: { user: { email: { in: emails, mode: 'insensitive' } } },
            include: { user: { select: { email: true, profile: { select: { fullName: true } } } } }
        });

        if (assessments.length === 0) {
            assessments = await prisma.innovationAssessment.findMany({
                where: { userId },
                include: { user: { select: { email: true, profile: { select: { fullName: true } } } } }
            });
        }
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch team data" });
    }
});

// ==========================================
// EXPERT REVIEW ROUTES
// ==========================================

app.post('/api/reviewer/assign-expert', async (req, res) => {
    const { applicantUserId, expertName, expertEmail } = req.body;
    try {
        const token = crypto.randomBytes(32).toString('hex');
        await prisma.expertReview.create({ data: { applicantUserId, expertName, expertEmail, token } });
        const link = `${process.env.FRONTEND_URL}/expert/review?token=${token}`;
        console.log(`Expert Link: ${link}`);
        await sendEmail(expertEmail, "Review Request", `Click here: ${link}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

app.get('/api/expert/context', async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') return res.status(400).json({ error: "Token required" });

    try {
        const review = await prisma.expertReview.findUnique({ where: { token }, include: { applicant: true } });
        if (!review) return res.status(404).json({ error: "Invalid link" });
        if (review.status === 'COMPLETED') return res.status(403).json({ error: "Already submitted" });

        const app = await prisma.onboardingApplication.findUnique({ where: { userId: review.applicantUserId } });
        
        // Get Assessments
        const founder = await prisma.user.findUnique({ where: { id: review.applicantUserId }, select: { email: true } });
        const cfs = (app?.data as any)?.coFounders || [];
        const emails = [founder?.email, ...cfs.map((c: any) => c.email)].filter(Boolean);
        
        const assessments = await prisma.innovationAssessment.findMany({
            where: { user: { email: { in: emails, mode: 'insensitive' } } },
            include: { user: { select: { profile: { select: { fullName: true } } } } }
        });

        res.json({ expertName: review.expertName, application: app?.data || {}, assessments });
    } catch (err) {
        res.status(500).json({ error: "System error" });
    }
});

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
    } catch (err) {
        res.status(500).json({ error: "Submit failed" });
    }
});

// ==========================================
// FINANCE MANAGEMENT ROUTES
// ==========================================

// 1. Get Finance Summary (For Dashboards)
app.get('/api/finance/summary', async (req, res) => {
    try {
        const records = await prisma.financeRecord.findMany();

        // Calculate Totals
        const sanctioned = records.filter(r => r.category === 'SANCTIONED').reduce((acc, r) => acc + r.amount, 0);
        const received = records.filter(r => r.category === 'RECEIVED').reduce((acc, r) => acc + r.amount, 0);
        const allocated = records.filter(r => r.category === 'ALLOCATED').reduce((acc, r) => acc + r.amount, 0);
        
        // Available = Received (Actual Cash) - Allocated (Spent)
        const available = received - allocated;

        res.json({
            sanctioned,
            received,
            allocated,
            available
        });
    } catch (err) {
        console.error("Finance Summary Error:", err);
        res.status(500).json({ error: "Failed to fetch summary" });
    }
});

// 2. Get Records by Category
app.get('/api/finance/records', async (req, res) => {
    const { category } = req.query;
    try {
        const where = category && typeof category === 'string' ? { category } : {};
        const records = await prisma.financeRecord.findMany({
            where,
            orderBy: { date: 'desc' }
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch records" });
    }
});

// 3. Create Record
app.post('/api/finance/record', async (req, res) => {
    const { category, source, amount, date, description, beneficiary } = req.body;
    
    if (!category || !amount || !date) return res.status(400).json({ error: "Missing fields" });

    try {
        const record = await prisma.financeRecord.create({
            data: {
                category,
                source: source || 'General',
                amount: parseFloat(amount),
                date: new Date(date),
                description,
                beneficiary
            }
        });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: "Failed to create record" });
    }
});

// 4. Update Record
app.put('/api/finance/record/:id', async (req, res) => {
    const { id } = req.params;
    const { source, amount, date, description, beneficiary } = req.body;

    try {
        const record = await prisma.financeRecord.update({
            where: { id },
            data: {
                source,
                amount: parseFloat(amount),
                date: new Date(date),
                description,
                beneficiary
            }
        });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: "Failed to update record" });
    }
});

// 5. Delete Record
app.delete('/api/finance/record/:id', async (req, res) => {
    try {
        await prisma.financeRecord.delete({ where: { id: req.params.id } });
        res.json({ message: "Record deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

app.get('/api/reviewer/applicants', async (req, res) => {
    try {
        const apps = await prisma.onboardingApplication.findMany({
            where: { status: { in: ['SUBMITTED', 'EXPERT_REVIEW_PENDING', 'EXPERT_APPROVED', 'EXPERT_REJECTED'] } },
            include: { user: { include: { profile: true } } }
        });

        const results = await Promise.all(apps.map(async (app) => {
            const founderName = app.user.profile?.fullName || "Unknown";
            const startupName = (app.data as any)?.venture?.organizationName || "Venture";
            
            // Team Score Logic (Simplified for brevity)
            // ... [Assume same logic as previous snippets]
            // For now returning basic info as list
            return {
                id: app.userId,
                startupName,
                founderName,
                submittedAt: app.submittedAt ? app.submittedAt.toISOString().split('T')[0] : "N/A",
                teamScore: 0, // Placeholder needs calc
                teamTier: "RED" // Placeholder
            };
        }));
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const total = await prisma.onboardingApplication.count();
        const pendingExpert = await prisma.onboardingApplication.count({ where: { status: 'EXPERT_REVIEW_PENDING' } });
        const actionRequired = await prisma.onboardingApplication.count({ where: { status: 'EXPERT_APPROVED' } });
        const onboarded = await prisma.onboardingApplication.count({ where: { status: 'ONBOARDED' } });

        const pendingApps = await prisma.onboardingApplication.findMany({
            where: { status: { in: ['EXPERT_APPROVED', 'EXPERT_REJECTED', 'SUBMITTED'] } },
            take: 10,
            orderBy: { updatedAt: 'desc' },
            include: { user: { include: { profile: true } } }
        });

        const recentActivity = pendingApps.map(a => ({
            id: a.userId,
            founderName: a.user.profile?.fullName || "Unknown",
            startupName: (a.data as any)?.venture?.organizationName || "Venture",
            status: a.status,
            date: a.updatedAt.toISOString().split('T')[0]
        }));

        res.json({ stats: { total, pendingExpert, actionRequired, onboarded }, recentActivity });
    } catch (err) {
        res.status(500).json({ error: "Dashboard error" });
    }
});

app.get('/api/admin/application-context/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const app = await prisma.onboardingApplication.findUnique({ where: { userId }, include: { user: { include: { profile: true } } } });
        if (!app) return res.status(404).json({ error: "Not found" });

        const reviews = await prisma.expertReview.findMany({
            where: { applicantUserId: userId, status: 'COMPLETED' },
            orderBy: { respondedAt: 'desc' }
        });

        // Fetch assessments
        const cfs = (app.data as any)?.coFounders || [];
        const emails = [app.user.email, ...cfs.map((c: any) => c.email)].filter(Boolean);
        const assessments = await prisma.innovationAssessment.findMany({
            where: { user: { email: { in: emails, mode: 'insensitive' } } },
            include: { user: { select: { email: true, profile: { select: { fullName: true } } } } }
        });

        res.json({
            application: { ...(app.data as any), status: app.status, founder: { ...(app.data as any).founder, fullName: app.user.profile?.fullName } },
            assessments,
            expertReviews: reviews
        });
    } catch (err) {
        res.status(500).json({ error: "Error" });
    }
});

app.post('/api/admin/onboard', async (req, res) => {
    const { userId, status } = req.body;
    try {
        if (status === 'APPROVED') {
            await prisma.onboardingApplication.update({ where: { userId }, data: { status: 'ONBOARDED' } });
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const roles = new Set(user?.roles || []);
            roles.delete('applicant');
            roles.add('founder');
            await prisma.user.update({ where: { id: userId }, data: { roles: Array.from(roles) as Role[] } });
        } else {
            await prisma.onboardingApplication.update({ where: { userId }, data: { status: 'REJECTED' } });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Action failed" });
    }
});

app.get('/api/admin/approved-list', async (req, res) => {
    try {
        const apps = await prisma.onboardingApplication.findMany({
            where: { status: 'EXPERT_APPROVED' },
            include: { user: { include: { profile: true, expertReviews: { where: { status: 'COMPLETED', decision: 'APPROVED' }, take: 1, orderBy: { respondedAt: 'desc' } } } } }
        });

        const results = await Promise.all(apps.map(async (app) => {
            const founderName = app.user.profile?.fullName || "Unknown";
            const startupName = (app.data as any)?.venture?.organizationName || "Venture";
            const expertName = app.user.expertReviews[0]?.expertName || "Unknown";
            
            // Calc score (Simplified)
            // ...
            return { id: app.userId, startupName, founderName, score: 0, endorsedBy: expertName, date: app.updatedAt.toISOString().split('T')[0] };
        }));
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Error" });
    }
});

// ==========================================
// CHAT ROUTE
// ==========================================

app.post('/api/chat', async (req, res) => {
    const { query, history } = req.body;
    if (!query) return res.status(400).json({ error: "Query required" });

    try {
        const queryEmbedding = await generateEmbedding(query);
        let contextDocuments: any[] = [];

        if (queryEmbedding) {
            const { data, error } = await supabase.rpc('match_applications', {
                query_embedding: queryEmbedding,
                match_threshold: 0.4,
                match_count: 5
            });
            if (!error && data) contextDocuments = data;
        }

        const dbContext = contextDocuments.length ? contextDocuments.map((doc: any) => `STARTUP INFO:\n${doc.content}`).join('\n\n') : "";
        const conversationHistory = Array.isArray(history) 
            ? history.slice(-6).map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n') 
            : "";

        const systemPrompt = `
            You are the ARTPark Intelligent Assistant.
            KNOWLEDGE BASE: ${dbContext || "No matches."}
            HISTORY: ${conversationHistory}
            Answer politely. Use knowledge base if relevant.
        `;

        const result = await model.generateContent(systemPrompt + `\n\nUser: ${query}\nAssistant:`);
        res.json({ answer: result.response.text(), sources: contextDocuments });
    } catch (err) {
        res.json({ answer: "I'm having trouble connecting to the brain right now.", sources: [] });
    }
});

// server/index.ts

// ... [Keep all existing imports and setup] ...

// ---------------------------------------------------------
// NEW: FILE UPLOAD ENDPOINT
// ---------------------------------------------------------
app.post('/api/upload', async (req, res) => {
    const { fileName, fileType, fileData } = req.body;

    if (!fileData || !fileName) {
        return res.status(400).json({ error: "Missing file data" });
    }

    try {
        // 1. Convert Base64 back to Buffer
        // Remove the data:image/png;base64, prefix
        const base64Data = fileData.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');

        // 2. Generate Unique Path
        // Clean filename to avoid issues
        const cleanName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
        const path = `evidence/${Date.now()}_${cleanName}`;

        // 3. Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('documents') // Ensure this bucket exists!
            .upload(path, buffer, {
                contentType: fileType,
                upsert: true
            });

        if (error) {
            console.error("Supabase Upload Error:", error);
            throw error;
        }

        // 4. Get Public URL
        const { data: publicData } = supabase.storage
            .from('documents')
            .getPublicUrl(path);

        console.log(`✅ File Uploaded: ${publicData.publicUrl}`);

        // Return the URL to the frontend
        res.json({
            url: publicData.publicUrl,
            name: fileName
        });

    } catch (err: any) {
        console.error("Server Upload Error:", err);
        res.status(500).json({ error: "File upload failed" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});