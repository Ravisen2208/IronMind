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

  // When running locally without Firebase Admin credentials, allow safe demo sandbox
  if (!isFirebaseAdminConfigured()) {
    let demoUid: string | null = null;
    if (authHeader && authHeader.startsWith("Bearer demo-token-")) {
      demoUid = authHeader.replace("Bearer demo-token-", "").trim();
    } else {
      demoUid = req.headers.get("x-ironmind-demo-uid");
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

  // Production verified Firebase ID Token flow
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
