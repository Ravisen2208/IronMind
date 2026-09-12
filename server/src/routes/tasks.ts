import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../lib/auth";
import {
  getUserTasks,
  createNewTask,
  updateTask,
  deleteTask,
  completeTask,
} from "../lib/db";

const router = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const type = (req.query.type as string) || undefined;
    const category = (req.query.category as string) || undefined;
    const priority = (req.query.priority as string) || undefined;
    const completedParam = req.query.completed as string | undefined;
    const search = (req.query.search as string) || undefined;

    let completed: boolean | undefined = undefined;
    if (completedParam === "true") completed = true;
    if (completedParam === "false") completed = false;

    const tasks = await getUserTasks(user.uid, {
      type,
      category,
      priority,
      completed,
      search,
    });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    console.error("Error in GET /api/tasks:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch tasks." });
  }
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const body = req.body;
    if (!body || typeof body.title !== "string" || !body.title.trim()) {
      return res.status(400).json({ error: "Quest title cannot be empty." });
    }

    const task = await createNewTask(user.uid, {
      title: body.title,
      description: body.description,
      type: body.type,
      category: body.category,
      priority: body.priority,
      dueDate: body.dueDate,
      gym: body.gym,
      study: body.study,
      preferredAttribute: body.preferredAttribute,
    });

    return res.status(201).json({
      success: true,
      task,
    });
  } catch (error: any) {
    console.error("Error in POST /api/tasks:", error);
    return res.status(500).json({ error: error.message || "Failed to create quest." });
  }
});

router.post("/complete", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const body = req.body;
    if (!body || !body.taskId) {
      return res.status(400).json({ error: "taskId is required." });
    }

    const result = await completeTask(user.uid, body.taskId);
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in POST /api/tasks/complete:", error);
    const status = error.message === "Task not found." ? 404 : 400;
    return res.status(status).json({ error: error.message || "Failed to complete quest." });
  }
});

router.patch("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const taskId = String(req.params.id);
    const body = req.body;

    const task = await updateTask(user.uid, taskId, body);
    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/tasks/:id:", error);
    const status = error.message === "Task not found." ? 404 : 400;
    return res.status(status).json({ error: error.message || "Failed to update quest." });
  }
});

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const taskId = String(req.params.id);

    await deleteTask(user.uid, taskId);
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/tasks/:id:", error);
    return res.status(500).json({ error: error.message || "Failed to delete quest." });
  }
});

export default router;
