import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { completeTaskAtomic } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized. Valid authentication token required." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.taskId !== "string" || !body.taskId.trim()) {
      return NextResponse.json(
        { error: "Valid taskId is required." },
        { status: 400 }
      );
    }

    const taskId = body.taskId.trim();

    // Atomic transaction - server authoritative calculation
    const result = await completeTaskAtomic(authUser.uid, taskId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error in POST /api/tasks/complete:", error);

    const message = error.message || "Failed to complete quest.";
    let status = 500;
    if (message.includes("already completed")) {
      status = 409;
    } else if (message.includes("not found")) {
      status = 404;
    }

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
