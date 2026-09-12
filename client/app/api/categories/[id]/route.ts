import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { deleteCustomCategory, updateCustomCategory } from "@/lib/db";

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

    const categoryId = params.id;
    if (categoryId.startsWith("cat_") && !categoryId.includes("_custom_")) {
      // Default system categories cannot be modified
    }

    const body = await req.json().catch(() => ({}));
    const updated = await updateCustomCategory(authUser.uid, categoryId, {
      name: body.name,
      icon: body.icon,
      color: body.color,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Category not found or default system category cannot be updated." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: updated,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/categories/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update category." },
      { status: 500 }
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

    const categoryId = params.id;
    const success = await deleteCustomCategory(authUser.uid, categoryId);

    if (!success) {
      return NextResponse.json(
        { error: "Category not found or cannot be deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/categories/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category." },
      { status: 500 }
    );
  }
}
