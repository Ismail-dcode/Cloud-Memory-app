const express = require("express");
const dotenv = require("dotenv");
const uploadRoutes = require("./src/routes/uploadRoutes");
const authRoutes = require("./src/routes/authRoutes");
const memoryRoutes = require("./src/routes/memoryRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("frontend/dist"));
app.use(uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);

// SPA fallback: any non-API GET serves the React app
app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
        try {
            const html = require("fs").readFileSync(require("path").join(__dirname, "frontend", "dist", "index.html"));
            return res.type("html").send(html);
        } catch {
            return next();
        }
    }
    next();
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {

    console.log(
        `Server running at http://localhost:${process.env.PORT}`
    );

});
