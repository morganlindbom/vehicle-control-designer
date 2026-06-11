import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";

const app = express();

app.disable("x-powered-by");

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: false
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Vehicle Control Designer API"
    });
});

app.use("/api/projects", projectRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/library", libraryRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});