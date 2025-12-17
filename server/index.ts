import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Built-in Node module for random tokens

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key_123";

// --- HELPER: Generate & Save Token ---
async function createAuthToken(userId: string, type: 'account_activation' | 'password_reset') {
    // 1. Generate a random hex string
    const tokenString = crypto.randomBytes(32).toString('hex');

    // 2. Set expiry (e.g., 24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // 3. Save to DB
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

// --- 1. INVITE USER (For Admin to create accounts) ---
app.post('/api/auth/invite-user', async (req, res) => {
    const { email, role } = req.body;

    try {
        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: "User already exists" });

        // Create user with NO password (invited status)
        const user = await prisma.user.create({
            data: {
                email,
                role: role || 'founder',
                status: 'invited',
                password_hash: null, // No password yet
            }
        });

        // Generate Activation Link
        const token = await createAuthToken(user.id, 'account_activation');
        const link = `http://localhost:5173/set-password?token=${token}&type=activation`;

        console.log("==================================================");
        console.log(`📧 SIMULATED EMAIL TO: ${email}`);
        console.log(`🔗 ACTIVATION LINK: ${link}`);
        console.log("==================================================");

        res.json({ message: "User invited. Check server console for the link!", link });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Failed to invite user" });
    }
});

// --- 2. FORGOT PASSWORD ---
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Generate Reset Link
        const token = await createAuthToken(user.id, 'password_reset');
        const link = `http://localhost:5173/set-password?token=${token}&type=reset`;

        console.log("==================================================");
        console.log(`📧 SIMULATED EMAIL TO: ${email}`);
        console.log(`🔗 RESET LINK: ${link}`);
        console.log("==================================================");

        res.json({ message: "Reset link generated. Check server console!", link });
    } catch (err) {
        res.status(500).json({ error: "Error processing request" });
    }
});

// --- 3. VERIFY & SET NEW PASSWORD ---
app.post('/api/auth/set-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // 1. Find the token
        const storedToken = await prisma.authToken.findUnique({
            where: { token },
            include: { user: true }
        });

        // 2. Validate Token
        if (!storedToken) return res.status(400).json({ error: "Invalid token" });
        if (storedToken.is_used) return res.status(400).json({ error: "Token already used" });
        if (new Date() > storedToken.expires_at) return res.status(400).json({ error: "Token expired" });

        // 3. Hash New Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update User & Token
        await prisma.$transaction([
            prisma.user.update({
                where: { id: storedToken.user_id },
                data: {
                    password_hash: hashedPassword,
                    status: 'active' // Ensure account is active
                }
            }),
            prisma.authToken.update({
                where: { id: storedToken.id },
                data: { is_used: true }
            })
        ]);

        res.json({ message: "Password updated successfully! You can now login." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to set password" });
    }
});

// --- 4. LOGIN (Existing) ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "User not found" });

        // Allow login only if active
        if (!user.password_hash) return res.status(403).json({ error: "Account not activated. Please use the activation link sent to your email." });

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