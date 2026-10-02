const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail, findUserByUsername } = require("./userService");

async function register({ name, email, username, password }) {

    const existingEmail = await findUserByEmail(email);

    if (existingEmail) {
        const err = new Error("Email already registered");
        err.statusCode = 409;
        throw err;
    }

    const existingUsername = await findUserByUsername(username);

    if (existingUsername) {
        const err = new Error("Username already taken");
        err.statusCode = 409;
        throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        userId: crypto.randomUUID(),
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString()
    };

    await createUser(user);

    return { userId: user.userId, name: user.name, username: user.username, email: user.email };
}

async function login({ identifier, password }) {

    // Accept either username or email
    const user = identifier.includes("@")
        ? await findUserByEmail(identifier)
        : await findUserByUsername(identifier);

    if (!user) {
        const err = new Error("Invalid username or password");
        err.statusCode = 401;
        throw err;
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    const token = jwt.sign(
        { userId: user.userId },
        process.env.AUTH_SECRET,
        { expiresIn: "7d" }
    );

    return {
        token,
        user: { userId: user.userId, name: user.name, username: user.username, email: user.email, bio: user.bio || "" }
    };
}

module.exports = { register, login };
