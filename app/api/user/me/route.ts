import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getUserProfile, initializeUserProfile } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized. Valid authentication token required." },
        { status: 401 }
      );
    }

    let profile = await getUserProfile(authUser.uid);
    if (!profile) {
      profile = await initializeUserProfile(authUser.uid, authUser.email || null);
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("Error in /api/user/me:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve user profile." },
      { status: 500 }
    );
  }
}
