import { db } from "~/server/db";
import { cafes } from "~/server/db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = query.search as string | undefined;

    // Build optional search filter
    const where = search
      ? or(
          ilike(cafes.name, `%${search}%`),
          ilike(cafes.city, `%${search}%`),
          ilike(cafes.slug, `%${search}%`),
        )
      : undefined;

    const [cafesData, countResult] = await Promise.all([
      db
        .select({
          id: cafes.id,
          name: cafes.name,
          slug: cafes.slug,
          city: cafes.city,
          location: cafes.location,
          coverImage: cafes.coverImage,
          excerpt: cafes.excerpt,
          isPublished: cafes.isPublished,
          createdAt: cafes.createdAt,
          updatedAt: cafes.updatedAt,
        })
        .from(cafes)
        .where(where)
        .orderBy(cafes.createdAt)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(cafes)
        .where(where),
    ]);

    const total = countResult[0]?.count ?? 0;

    return {
      data: cafesData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Failed to fetch cafes:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
