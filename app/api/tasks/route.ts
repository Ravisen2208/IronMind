import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { createNewTask, getUserTasks } from "@/lib/db";
import { validateTaskInput } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized. Valid authentication token required." },
        { status: 401 }
      );
    }

    const tasks = await getUserTasks(authUser.uid);
    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    console.error("Error in GET /api/tasks:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks." },
      { status: 500 }
    );
  }
}

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
    const validation = validateTaskInput(body);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: validation.error || "Invalid quest data." },
        { status: 400 }
      );
    }

    const task = await createNewTask(
      authUser.uid,
      validation.data.title,
      validation.data.category
    );

    return NextResponse.json(
      {
        success: true,
        task,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/tasks:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create quest." },
      { status: 500 }
    );
  }
}
