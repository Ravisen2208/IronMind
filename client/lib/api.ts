/**
 * Client API Request Layer with Firebase ID Token injection
 */
import { auth } from "./firebase";

async function getAuthToken(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    // Check if running in guest/demo mode
    if (typeof window !== "undefined") {
      let demoUid = localStorage.getItem("ironmind_demo_uid");
      if (!demoUid) {
        demoUid = "warrior_hero";
        try {
          localStorage.setItem("ironmind_demo_uid", demoUid);
        } catch {}
      }
      return `demo-token-${demoUid}`;
    }
    return "demo-token-warrior_hero";
  }
  return currentUser.getIdToken();
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (typeof window !== "undefined") {
      const demoUid = localStorage.getItem("ironmind_demo_uid");
      if (demoUid) {
        headers["x-ironmind-demo-uid"] = demoUid;
      }
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    let data: any = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      const text = await response.text().catch(() => "");
      data = {
        error: text && text.length < 200 ? text : `Server temporarily unavailable (HTTP ${response.status})`,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || data?.message || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Network connection error. Please try again.",
    };
  }
}
