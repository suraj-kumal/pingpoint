import { db } from "~/server/db";
import { cafes } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Basic validation
    if (!body?.name?.trim()) {
      throw createError({ statusCode: 400, statusMessage: "Name is required" });
    }
    if (!body?.slug?.trim()) {
      throw createError({ statusCode: 400, statusMessage: "Slug is required" });
    }

    const [newCafe] = await db
      .insert(cafes)
      .values({
        name: body.name.trim(),
        slug: body.slug.trim(),
        city: body.city ?? null,
        location: body.location ?? null,
        coverImage: body.coverImage ?? null,
        excerpt: body.excerpt ?? null,
        description: body.description ?? null,
        conclusion: body.conclusion ?? null,
        metaTitle: body.metaTitle ?? null,
        metaDescription: body.metaDescription ?? null,
        metaKeywords: body.metaKeywords ?? null,
        isPublished: body.isPublished ?? true,
      })
      .returning();

    setResponseStatus(event, 201);
    return { data: newCafe };
  } catch (error: any) {
    // Catch unique slug violation
    if (error?.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "Slug already exists",
      });
    }
    if (error?.statusCode) throw error; // re-throw createError
    console.error("Failed to create cafe:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
