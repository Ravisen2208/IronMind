import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../lib/auth.js";
import { getUserCategories, createCategory, deleteCategory } from "../lib/db.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const categories = await getUserCategories(user.uid);
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error("Error in GET /api/categories:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch categories." });
  }
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const body = req.body;
    if (!body || typeof body.name !== "string" || !body.name.trim()) {
      return res.status(400).json({ error: "Category name cannot be empty." });
    }

    const category = await createCategory(user.uid, {
      name: body.name,
      icon: body.icon,
      color: body.color,
    });

    return res.status(201).json({
      success: true,
      category,
    });
  } catch (error: any) {
    console.error("Error in POST /api/categories:", error);
    return res.status(500).json({ error: error.message || "Failed to create category." });
  }
});

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const categoryId = req.params.id;

    await deleteCategory(user.uid, categoryId);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/categories/:id:", error);
    return res.status(500).json({ error: error.message || "Failed to delete category." });
  }
});

export default router;
