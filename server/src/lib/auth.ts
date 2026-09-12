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

  if (!isFirebaseAdminConfigured()) {
    let demoUid: string | null = null;
    if (authHeader && authHeader.startsWith("Bearer demo-token-")) {
      demoUid = authHeader.replace("Bearer demo-token-", "").trim();
    } else {
      demoUid = (req.headers["x-ironmind-demo-uid"] as string) || null;
    }

    if (demoUid) {
      return {
        uid: demoUid,
        email: `${demoUid}@ironmind.app`,
        name: "IronMind Warrior",
      };
    }
    return null;
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
    console.error("Token verification failed:", error);
    return null;
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
