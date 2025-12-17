import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer'; // <--- Import Nodemailer

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key_123";

// --- SMTP CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Helper to send email
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

// --- HELPER: Generate & Save Token ---
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

// --- 1. INVITE USER (Updated with Email) ---
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

        // Generate Link
        const token = await createAuthToken(user.id, 'account_activation');
        const link = `http://localhost:5173/set-password?token=${token}&type=activation`;

        // Send Real Email
        const emailHtml = `
      <h2>Welcome to ARTPark!</h2>
      <p>You have been invited to join the ARTPark OS platform as a <strong>${role}</strong>.</p>
      <p>Please click the link below to activate your account and set your password:</p>
      <a href="${link}" style="padding: 10px 20px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 5px;">Activate Account</a>
      <p><small>Link expires in 24 hours.</small></p>
    `;

        await sendEmail(email, "Welcome to ARTPark - Activate Account", emailHtml);

        res.json({ message: "Invitation email sent successfully!" });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Failed to invite user" });
    }
});

// --- 2. FORGOT PASSWORD (Updated with Email) ---
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const token = await createAuthToken(user.id, 'password_reset');
        const link = `http://localhost:5173/set-password?token=${token}&type=reset`;

        const emailHtml = `
      <h2>Reset Password</h2>
      <p>We received a request to reset your password.</p>
      <a href="${link}" style="padding: 10px 20px; background-color: #DC2626; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p><small>If you didn't request this, ignore this email.</small></p>
    `;

        await sendEmail(email, "Reset Your Password", emailHtml);

        res.json({ message: "Reset link sent to your email." });
    } catch (err) {
        res.status(500).json({ error: "Error processing request" });
    }
});

// --- 3. VERIFY & SET PASSWORD (Unchanged) ---
app.post('/api/auth/set-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const storedToken = await prisma.authToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!storedToken) return res.status(400).json({ error: "Invalid token" });
        if (storedToken.is_used) return res.status(400).json({ error: "Token already used" });
        if (new Date() > storedToken.expires_at) return res.status(400).json({ error: "Token expired" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: storedToken.user_id },
                data: { password_hash: hashedPassword, status: 'active' }
            }),
            prisma.authToken.update({ where: { id: storedToken.id }, data: { is_used: true } })
        ]);

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to set password" });
    }
});

// --- 4. LOGIN (Unchanged) ---
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
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});