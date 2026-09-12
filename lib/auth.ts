import { adminAuth, isFirebaseAdminConfigured } from "./firebase-admin";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
}

/**
 * Extracts and strictly verifies the Firebase ID token from the Authorization header.
 * Rejects requests with missing or invalid credentials.
 */
export async function verifyAuth(req: Request): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If running in development without Firebase Admin credentials, allow safe local demo simulation
    if (!isFirebaseAdminConfigured() && process.env.NODE_ENV !== "production") {
      const demoUid = req.headers.get("x-ironmind-demo-uid");
      if (demoUid) {
        return {
          uid: demoUid,
          email: "demo@ironmind.app",
          name: "IronMind Warrior",
        };
      }
    }
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
    // If running in local development mode with demo token
    if (!isFirebaseAdminConfigured() && process.env.NODE_ENV !== "production") {
      if (token.startsWith("demo-token-")) {
        const uid = token.replace("demo-token-", "");
        return {
          uid: uid || "demo-warrior-uid",
          email: "demo@ironmind.app",
          name: "IronMind Warrior",
        };
      }
    }

    console.error("Token verification failed:", error);
    return null;
  }
}
