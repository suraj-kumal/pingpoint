import { db } from "~/server/db";

import { cafes } from "~/server/db/schema";

import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    //get query paramete
    const query = getQuery(event);

    //page and limit
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 7;

    const offset = (page - 1) * limit;

    const cafesData = await db
      .select({
        id: cafes.id,
        name: cafes.name,
        slug: cafes.slug,
        city: cafes.city,
        location: cafes.location,
        coverImage: cafes.coverImage,
        excerpt: cafes.excerpt,
        createdAt: cafes.createdAt,
      })
      .from(cafes)
      .where(eq(cafes.isPublished, true))
      .limit(limit)
      .offset(offset);

    return {
      cafesData,
      page,
      limit,
    };
  } catch (error) {
    console.error("Failed to fetch cafes:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
