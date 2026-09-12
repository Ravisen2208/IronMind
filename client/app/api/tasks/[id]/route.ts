import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { deleteTask, updateTask } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized. Valid authentication token required." },
        { status: 401 }
      );
    }

    const taskId = params.id;
    if (!taskId) {
      return NextResponse.json(
        { error: "Quest ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const updated = await updateTask(authUser.uid, taskId, {
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority,
      dueDate: body.dueDate,
      gym: body.gym,
      study: body.study,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Quest not found or could not be updated." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: updated,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/tasks/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update quest." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized. Valid authentication token required." },
        { status: 401 }
      );
    }

    const taskId = params.id;
    if (!taskId) {
      return NextResponse.json(
        { error: "Quest ID is required." },
        { status: 400 }
      );
    }

    const success = await deleteTask(authUser.uid, taskId);
    if (!success) {
      return NextResponse.json(
        { error: "Quest not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quest deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/tasks/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete quest." },
      { status: 500 }
    );
  }
}
