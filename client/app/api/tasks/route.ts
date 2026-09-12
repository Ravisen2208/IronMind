import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { createNewTask, getUserTasks } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized. Valid authentication token required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const category = searchParams.get("category") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const completedParam = searchParams.get("completed");
    const search = searchParams.get("search") || undefined;

    let completed: boolean | undefined = undefined;
    if (completedParam === "true") completed = true;
    if (completedParam === "false") completed = false;

    const tasks = await getUserTasks(authUser.uid, {
      type,
      category,
      priority,
      completed,
      search,
    });

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
    if (!body || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "Quest title cannot be empty." },
        { status: 400 }
      );
    }

    const task = await createNewTask(authUser.uid, {
      title: body.title,
      description: body.description,
      type: body.type,
      category: body.category,
      priority: body.priority,
      dueDate: body.dueDate,
      gym: body.gym,
      study: body.study,
      preferredAttribute: body.preferredAttribute,
    });

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
