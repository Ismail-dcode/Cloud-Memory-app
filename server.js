const express = require("express");
const dotenv = require("dotenv");
const uploadRoutes = require("./src/routes/uploadRoutes");
const authRoutes = require("./src/routes/authRoutes");
const memoryRoutes = require("./src/routes/memoryRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);

app.listen(process.env.PORT, () => {

    console.log(
        `Server running at http://localhost:${process.env.PORT}`
    );

});
