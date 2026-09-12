import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/user";
import tasksRouter from "./routes/tasks";
import categoriesRouter from "./routes/categories";
import questAiRouter from "./routes/questAi";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/quest-ai", questAiRouter);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "IronMind Server API", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 IronMind Express Server API running on http://localhost:${PORT}`);
});
