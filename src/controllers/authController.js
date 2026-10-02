const authService = require("../services/authService");
const { findUserById, updateUser } = require("../services/userService");

async function register(req, res) {
    try {
        const { name, email, username, password, confirmPassword } = req.body || {};

        if (!name || !email || !username || !password) {
            return res.status(400).json({ error: "Name, username, email, and password are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const user = await authService.register({ name, email, username, password });

        res.status(201).json({ message: "Registered successfully", user });

    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message || "Registration failed" });
    }
}

async function login(req, res) {
    try {
        const { identifier, password } = req.body || {};

        if (!identifier || !password) {
            return res.status(400).json({ error: "Username/email and password are required" });
        }

        const result = await authService.login({ identifier, password });

        res.json(result);

    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message || "Login failed" });
    }
}

function logout(req, res) {
    // JWT is stateless: the client deletes its token. Nothing to invalidate server-side yet.
    res.json({ message: "Logged out" });
}

async function me(req, res) {
    try {
        const user = await findUserById(req.userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ userId: user.userId, name: user.name, username: user.username, email: user.email, bio: user.bio || "" });

    } catch (error) {
        res.status(500).json({ error: "Failed to load user" });
    }
}

async function updateProfile(req, res) {
    try {
        const { name, bio } = req.body || {};

        const updated = await updateUser(req.userId, {
            ...(name !== undefined && { name }),
            ...(bio !== undefined && { bio })
        });

        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ userId: updated.userId, name: updated.name, email: updated.email, bio: updated.bio || "" });

    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
}

module.exports = { register, login, logout, me, updateProfile };
