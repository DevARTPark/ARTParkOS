import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());

// Increase payload limit for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key_123";

// --- SMTP CONFIGURATION ---
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Explicit host
    port: 465,              // Explicit port for Secure SSL
    secure: true,           // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

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

// --- HELPER: Generate Token ---
async function createAuthToken(userId: string, type: 'account_activation' | 'password_reset') {
    const tokenString = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

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
    const { email, role } = req.body;
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: "User already exists" });

        const user = await prisma.user.create({
            data: {
                email,
                role: role || 'founder',
                status: 'invited',
                password_hash: null,
            }
        });

        const token = await createAuthToken(user.id, 'account_activation');
        const link = `http://localhost:5173/set-password?token=${token}&type=activation`;

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

        const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, SECRET_KEY, { expiresIn: '12h' });
        res.json({ token, user: { id: user.id, name: email.split('@')[0], role: user.role, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Internal error" });
    }
});

// 3. Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.json({ message: "If that email exists, a reset link has been sent." });
        }

        const token = await createAuthToken(user.id, 'password_reset');
        const resetLink = `http://localhost:5173/set-password?token=${token}&type=reset`;

        console.log("---------------------------------------------------");
        console.log(`🔑 PASSWORD RESET LINK FOR ${email}:`);
        console.log(resetLink);
        console.log("---------------------------------------------------");

        const emailHtml = `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password. Valid for 24 hours.</p>
      <a href="${resetLink}">Reset Password</a>
    `;
        await sendEmail(email, "Password Reset Request", emailHtml);

        res.json({ message: "If that email exists, a reset link has been sent." });

    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Set Password
app.post('/api/auth/set-password', async (req, res) => {
    const { token, password } = req.body;

    // --- DEBUG LOG ---
    console.log("👉 SET PASSWORD REQUEST:", { token, passwordRecieved: !!password });

    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    try {
        const authToken = await prisma.authToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!authToken) return res.status(400).json({ error: "Invalid link." });
        if (authToken.is_used) return res.status(400).json({ error: "Link already used." });

        // Hash password (This is where it crashed before if password was undefined)
        const hashedPassword = await bcrypt.hash(password, 10);

        // ... rest of the logic (update user, etc.)
        await prisma.user.update({
            where: { id: authToken.user_id },
            data: {
                password_hash: hashedPassword,
                status: 'active',
            }
        });

        await prisma.authToken.update({
            where: { id: authToken.id },
            data: { is_used: true }
        });

        res.json({ message: "Password updated successfully!" });

    } catch (err) {
        console.error("Set Password Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================================
// PROFILE ROUTES
// ==========================================

// 5. Get Profile
app.get('/api/founder/profile', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: "User ID required" });

    try {
        const profile = await prisma.founderProfile.findUnique({ where: { userId } });
        res.json(profile || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// 6. Save Profile
app.post('/api/founder/profile', async (req, res) => {
    const { userId, data } = req.body;
    try {
        const profile = await prisma.founderProfile.upsert({
            where: { userId },
            update: {
                founderName: data.founderName,
                phone: data.phone,
                designation: data.designation,
                avatarUrl: data.avatarUrl,
                startupName: data.startupName,
                tagline: data.tagline,
                description: data.description,
                website: data.website,
                industry: data.industry,
                location: data.location,
                teamSize: parseInt(data.teamSize) || 0,
                foundedYear: parseInt(data.foundedYear) || new Date().getFullYear(),
            },
            create: {
                userId,
                founderName: data.founderName,
                phone: data.phone,
                designation: data.designation,
                avatarUrl: data.avatarUrl,
                startupName: data.startupName || "My Startup",
                tagline: data.tagline,
                description: data.description,
                website: data.website,
                industry: data.industry,
                location: data.location,
                teamSize: parseInt(data.teamSize) || 0,
                foundedYear: parseInt(data.foundedYear) || new Date().getFullYear(),
            }
        });
        res.json({ message: "Profile saved!", profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save profile" });
    }
});

// --- START SERVER ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});