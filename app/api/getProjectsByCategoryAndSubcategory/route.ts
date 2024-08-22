import { getProjectsByCategoryAndSubcategory } from "../../../src/lib/db/dbprojects";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get projects by category and subcategory");
    const { category, subcategory } = await request.json();
    console.log("Category: ", category);
    console.log("Subcategory: ", subcategory);

    const projects = await getProjectsByCategoryAndSubcategory(
      category,
      subcategory
    );

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error: any) {
    console.error(
      "Error fetching projects by category and subcategory:",
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error.message },
      { status: 500 }
    );
  }
};
