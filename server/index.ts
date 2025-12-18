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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key_123";

// --- SMTP CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
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

// --- AUTH ROUTES (Keep your existing ones) ---

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

// --- NEW PROFILE ROUTES (Add these) ---

// 1. Get Profile
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

// 2. Save Profile
// ... inside your POST /api/founder/profile endpoint

app.post('/api/founder/profile', async (req, res) => {
    const { userId, data } = req.body;
    try {
        const profile = await prisma.founderProfile.upsert({
            where: { userId },
            update: {
                // ... existing fields ...
                founderName: data.founderName,
                phone: data.phone,
                designation: data.designation,
                avatarUrl: data.avatarUrl, // <--- Add this
                startupName: data.startupName,
                // ... rest of fields
            },
            create: {
                userId,
                founderName: data.founderName,
                phone: data.phone,
                designation: data.designation,
                avatarUrl: data.avatarUrl, // <--- Add this
                startupName: data.startupName || "My Startup",
                // ... rest of fields
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