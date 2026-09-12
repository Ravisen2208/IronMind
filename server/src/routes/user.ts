import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../lib/auth.js";
import { getUserProfile, initializeUserProfile } from "../lib/db.js";

const router = Router();

router.post("/init", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const body = req.body || {};
    const email = body.email || user.email || null;

    const profile = await initializeUserProfile(user.uid, email);
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("Error in POST /api/user/init:", error);
    return res.status(500).json({ error: error.message || "Failed to initialize profile." });
  }
});

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    let profile = await getUserProfile(user.uid);
    if (!profile) {
      profile = await initializeUserProfile(user.uid, user.email || null);
    }
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("Error in GET /api/user/me:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch user profile." });
  }
});

export default router;
