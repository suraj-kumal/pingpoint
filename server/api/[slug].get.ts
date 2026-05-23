import { db } from "~/server/db";

import { cafes } from "~/server/db/schema";

import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing cafe slug",
      });
    }
    const cafeBySlug = await db
      .select()
      .from(cafes)
      .where(eq(cafes.slug, slug!));
    return cafeBySlug[0] || null;
  } catch (err) {
    console.error("Error fetching cafe by slug:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch cafe",
    });
  }
});
