import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

dotenv.config();

const app = express();
app.use(cors());

// Increase payload limit for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key_123";

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
    console.warn("⚠️  WARNING: FRONTEND_URL is not defined in .env! Defaulting to http://localhost:5173");
}
const finalFrontendUrl = FRONTEND_URL || "http://localhost:5173";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
    family: 4,
} as SMTPTransport.Options);

async function sendEmail(to: string, subject: string, html: string) {
    try {
        await transporter.sendMail({
            from: `"ARTPark Portal" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
        });
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error(`❌ Email failed to ${to}:`, error);
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

// 1. Invite User (Updated to accept startupId)
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

        // Generate Token with Metadata (startupId)
        const tokenString = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await prisma.authToken.create({
            data: {
                token: tokenString,
                user_id: user.id,
                type: 'account_activation',
                expires_at: expiresAt,
                // Store startupId in metadata so we can auto-join them later
                metadata: startupId ? { startupId } : undefined
            }
        });

        const link = `${finalFrontendUrl}/set-password?token=${tokenString}&type=activation`;
        console.log(`📨 INVITE LINK FOR ${email}: ${link}`);

        const emailHtml = `
      <h2>Welcome to ARTPark!</h2>
      <p>You have been invited as a <strong>${role}</strong>.</p>
      <a href="${link}">Activate Account</a>
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

        await sendEmail(email, "Password Reset Request", `<a href="${resetLink}">Reset Password</a>`);
        res.json({ message: "If that email exists, a reset link has been sent." });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Set Password (Updated to handle auto-join)
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

        // 3. AUTO-JOIN STARTUP (If invite had metadata)
        const meta = authToken.metadata as any;
        if (meta?.startupId) {
            await prisma.userProfile.create({
                data: {
                    userId: authToken.user_id!,
                    fullName: "", // They will fill this later in settings
                    startupId: meta.startupId // <--- LINK IMMEDIATELY
                }
            });
            console.log(`🔗 Auto-linked user ${authToken.user_id} to startup ${meta.startupId}`);
        } else {
            // Check if profile exists, if not create empty one
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
// UNIFIED PROFILE ROUTES (UPDATED)
// ==========================================

// 5. GET Profile
app.get('/api/user/profile', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "User ID required" });

    try {
        // Fetch profile AND linked startup
        const userProfile = await prisma.userProfile.findUnique({
            where: { userId },
            include: { startup: true }
        });

        if (!userProfile) {
            return res.json({ profile: null, startup: null });
        }

        // Separate objects for frontend
        const { startup, ...profile } = userProfile;
        res.json({ profile, startup: startup || null });

    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// 6. SAVE Profile (Fixed for new Schema)
app.post('/api/user/profile', async (req, res) => {
    // Log request for debugging
    console.log("👉 SAVE PROFILE REQUEST:", JSON.stringify(req.body, null, 2));

    const { userId, role, profile, startup } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID missing in payload" });
    }

    try {
        let startupId = null;

        // A. Handle Startup Logic (Founders Only)
        if (role === 'founder' && startup) {
            console.log("🚀 Processing Founder Startup Logic...");

            // Check if user already has a startup
            const existingProfile = await prisma.userProfile.findUnique({
                where: { userId },
                select: { startupId: true }
            });

            // Ensure numeric fields are parsed safely
            const safeFoundedYear = parseInt(startup.foundedYear) || new Date().getFullYear();
            const safeTeamSize = parseInt(startup.teamSize) || 1;

            const startupData = {
                name: startup.name || "My Startup",
                description: startup.description || "",
                website: startup.website || "",
                industry: startup.industry || "",
                location: startup.location || "",

                // --- CHANGED FIELDS ---
                // Removed 'stage'
                pitchDeckUrl: startup.pitchDeckUrl || "", // Added

                foundedYear: safeFoundedYear,
                teamSize: safeTeamSize,
                isProfileComplete: !!(startup.name && startup.description && startup.industry)
            };

            if (existingProfile?.startupId) {
                console.log(`🔄 Updating Existing Startup: ${existingProfile.startupId}`);
                await prisma.startup.update({
                    where: { id: existingProfile.startupId },
                    data: startupData
                });
                startupId = existingProfile.startupId;
            } else {
                console.log("✨ Creating New Startup Entity...");
                const newStartup = await prisma.startup.create({
                    data: startupData
                });
                startupId = newStartup.id;
            }
        }

        // B. Handle User Profile Logic (Upsert)
        console.log("👤 Processing User Profile Logic...");

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
                // --- KEY FIX: Use startupId directly ---
                startupId: startupId || undefined
            },
            create: {
                userId,
                ...profileData,
                // --- KEY FIX: Use startupId directly ---
                startupId: startupId || null
            }
        });

        console.log("✅ Profile Saved Successfully!");
        res.json({ message: "Profile saved!", profile: updatedProfile });

    } catch (err: any) {
        console.error("❌ Save Profile Error Details:", err);
        res.status(500).json({ error: "Failed to save profile", details: err.message });
    }
});

// ==========================================
// PROJECT ROUTES
// ==========================================

// ==========================================
// PROJECT MANAGEMENT ROUTES
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
                currentAIRL: 1
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

// 10. UPDATE Project (The logic you are missing)
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
        console.error("Update error:", err);
        res.status(500).json({ error: "Failed to update project" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});