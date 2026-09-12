import { Request, Response, NextFunction } from "express";
import { adminAuth, isFirebaseAdminConfigured } from "./firebase-admin";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export async function verifyAuthToken(req: Request): Promise<AuthenticatedUser | null> {
  const authHeader = (req.headers["authorization"] || req.headers["Authorization"]) as string | undefined;

  // Check for guest/demo session token first
  if (authHeader && authHeader.startsWith("Bearer demo-token-")) {
    const demoUid = authHeader.replace("Bearer demo-token-", "").trim() || "warrior_hero";
    return {
      uid: demoUid,
      email: `${demoUid}@ironmind.app`,
      name: "IronMind Warrior",
    };
  }

  const demoHeaderUid = (req.headers["x-ironmind-demo-uid"] as string) || null;
  if (demoHeaderUid) {
    return {
      uid: demoHeaderUid,
      email: `${demoHeaderUid}@ironmind.app`,
      name: "IronMind Warrior",
    };
  }

  if (!isFirebaseAdminConfigured()) {
    return {
      uid: "warrior_hero",
      email: "warrior_hero@ironmind.app",
      name: "IronMind Warrior",
    };
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };
  } catch (error) {
    console.warn("⚠️ Token verification warning, falling back to guest session:", (error as any)?.message || error);
    const fallbackUid = (req.headers["x-ironmind-demo-uid"] as string) || "warrior_hero";
    return {
      uid: fallbackUid,
      email: `${fallbackUid}@ironmind.app`,
      name: "IronMind Warrior",
    };
  }
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const user = await verifyAuthToken(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized. Valid authentication token required." });
  }
  req.user = user;
  next();
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await verifyAuthToken(req);
    req.user = user || {
      uid: (req.headers["x-ironmind-demo-uid"] as string) || "warrior_hero",
      email: "warrior_hero@ironmind.app",
      name: "IronMind Warrior",
    };
  } catch {
    req.user = {
      uid: "warrior_hero",
      email: "warrior_hero@ironmind.app",
      name: "IronMind Warrior",
    };
  }
  next();
}
