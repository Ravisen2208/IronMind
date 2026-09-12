import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { createCustomCategory, getUserCategories } from "@/lib/db";

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

    const categories = await getUserCategories(authUser.uid);
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error("Error in GET /api/categories:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories." },
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

    const body = await req.json().catch(() => ({}));
    if (!body || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 }
      );
    }

    const category = await createCustomCategory(
      authUser.uid,
      body.name,
      body.icon || "Tag",
      body.color || "#0071E3"
    );

    return NextResponse.json(
      {
        success: true,
        category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/categories:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category." },
      { status: 500 }
    );
  }
}
