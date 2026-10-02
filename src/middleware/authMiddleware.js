const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const payload = jwt.verify(token, process.env.AUTH_SECRET);
        req.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;
