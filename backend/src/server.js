import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Vehicle Control Designer API"
    });
});

app.use("/api/projects", projectRoutes);
app.use("/api/templates", templateRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});