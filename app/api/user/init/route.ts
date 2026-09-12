import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { initializeUserProfile } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized. Valid authentication token required." },
        { status: 401 }
      );
    }

    const profile = await initializeUserProfile(authUser.uid, authUser.email || null);

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("Error in /api/user/init:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize user." },
      { status: 500 }
    );
  }
}
