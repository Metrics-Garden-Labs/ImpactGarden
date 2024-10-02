import { Project, ProjectCount } from "@/src/types";
import { db } from "../../../src/lib/db/dbprojects";
import {
  projects,
  contributions,
  governance_infra_and_tooling,
  governance_r_and_a,
  governance_collab_and_onboarding,
  governance_structures_op,
  onchain_builders,
  op_stack,
  contributionattestations,
} from "../../../src/lib/schema";
import { sql, and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get projects");

    const { category, subcategory, sortOrder } = await request.json();
    console.log("Category:", category);
    console.log("Subcategory:", subcategory);
    console.log("Sort Order:", sortOrder);

    let query;

    // Step 1: Filter by Category and Subcategory (if provided)
    if (category && subcategory) {
      console.log(
        `Filtering by category: ${category} and subcategory: ${subcategory}`
      );
      query = db
        .select({
          id: projects.id,
          userFid: projects.userFid,
          ethAddress: projects.ethAddress,
          ecosystem: projects.ecosystem,
          projectName: projects.projectName,
          oneliner: projects.oneliner,
          category: projects.category,
          websiteUrl: projects.websiteUrl,
          twitterUrl: projects.twitterUrl,
          githubUrl: projects.githubUrl,
          logoUrl: projects.logoUrl,
          projectUid: projects.projectUid,
          primaryprojectuid: projects.primaryprojectuid,
          createdAt: projects.createdAt,
        })
        .from(projects)
        .leftJoin(
          contributions,
          eq(projects.projectName, contributions.projectName)
        )
        .where(
          and(
            eq(contributions.category, category),
            eq(contributions.subcategory, subcategory)
          )
        );
    } else if (category) {
      console.log(`Filtering by category: ${category}`);
      query = db
        .select({
          id: projects.id,
          userFid: projects.userFid,
          ethAddress: projects.ethAddress,
          ecosystem: projects.ecosystem,
          projectName: projects.projectName,
          oneliner: projects.oneliner,
          category: projects.category,
          websiteUrl: projects.websiteUrl,
          twitterUrl: projects.twitterUrl,
          githubUrl: projects.githubUrl,
          logoUrl: projects.logoUrl,
          projectUid: projects.projectUid,
          primaryprojectuid: projects.primaryprojectuid,
          createdAt: projects.createdAt,
        })
        .from(projects)
        .leftJoin(
          contributions,
          eq(projects.projectName, contributions.projectName)
        )
        .where(eq(contributions.category, category));
    } else {
      console.log(
        "No category or subcategory provided. Fetching all projects."
      );
      query = db
        .select({
          id: projects.id,
          userFid: projects.userFid,
          ethAddress: projects.ethAddress,
          ecosystem: projects.ecosystem,
          projectName: projects.projectName,
          oneliner: projects.oneliner,
          category: projects.category,
          websiteUrl: projects.websiteUrl,
          twitterUrl: projects.twitterUrl,
          githubUrl: projects.githubUrl,
          logoUrl: projects.logoUrl,
          projectUid: projects.projectUid,
          primaryprojectuid: projects.primaryprojectuid,
          createdAt: projects.createdAt,
        })
        .from(projects);
    }

    // Step 2: Apply Sorting (if requested)
    if (sortOrder === "Most Attested") {
      console.log("Sorting by Most Attested");
      query = query
        .leftJoin(
          contributionattestations,
          sql`${projects.projectName} = ${contributionattestations.projectName}`
        )
        .leftJoin(
          governance_infra_and_tooling,
          sql`${projects.projectName} = ${governance_infra_and_tooling.projectName}`
        )
        .leftJoin(
          governance_r_and_a,
          sql`${projects.projectName} = ${governance_r_and_a.projectName}`
        )
        .leftJoin(
          governance_collab_and_onboarding,
          sql`${projects.projectName} = ${governance_collab_and_onboarding.projectName}`
        )
        .leftJoin(
          governance_structures_op,
          sql`${projects.projectName} = ${governance_structures_op.projectName}`
        )
        .leftJoin(
          onchain_builders,
          sql`${projects.projectName} = ${onchain_builders.projectName}`
        )
        .leftJoin(
          op_stack,
          sql`${projects.projectName} = ${op_stack.projectName}`
        )
        .groupBy(
          projects.id,
          projects.userFid,
          projects.ethAddress,
          projects.ecosystem,
          projects.projectName,
          projects.oneliner,
          projects.category,
          projects.websiteUrl,
          projects.twitterUrl,
          projects.githubUrl,
          projects.logoUrl,
          projects.projectUid,
          projects.createdAt
        ).orderBy(sql`COALESCE(
              COUNT(${contributionattestations.id}) +
              COUNT(${governance_infra_and_tooling.id}) +
              COUNT(${governance_r_and_a.id}) +
              COUNT(${governance_collab_and_onboarding.id}) +
              COUNT(${governance_structures_op.id}) +
              COUNT(${onchain_builders.id}) +
              COUNT(${op_stack.id}),
              0
            ) DESC`);

      console.log("most attested", query);
    } else if (sortOrder === "Recently Added") {
      console.log("Sorting by Recently Added");
      query = query.orderBy(sql`${projects.createdAt} DESC`);
    } else if (sortOrder === "A-Z" || sortOrder === "Z-A") {
      console.log(`Sorting by ${sortOrder}`);
      query = query.orderBy(
        sortOrder === "Z-A"
          ? sql`${projects.projectName} DESC`
          : sql`${projects.projectName} ASC`
      );
    } else {
      console.log("No sorting applied. Returning unsorted results.");
    }

    console.log("Executing query:", query.toSQL());
    const result = await query.execute();
    console.log("Query result (first 5 items):", result.slice(0, 5));

    return NextResponse.json({ projects: result }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error.message },
      { status: 500 }
    );
  }
};
