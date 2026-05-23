import { db } from "~/server/db";
import { cafes } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, "id"));
    const body = await readBody(event);

    if (!id || isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
    }

    // Check exists
    const [existing] = await db.select().from(cafes).where(eq(cafes.id, id));
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: "Cafe not found" });
    }

    const [updated] = await db
      .update(cafes)
      .set({
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.slug !== undefined && { slug: body.slug.trim() }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.conclusion !== undefined && { conclusion: body.conclusion }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
        ...(body.metaDescription !== undefined && {
          metaDescription: body.metaDescription,
        }),
        ...(body.metaKeywords !== undefined && {
          metaKeywords: body.metaKeywords,
        }),
        ...(body.isPublished !== undefined && {
          isPublished: body.isPublished,
        }),
        updatedAt: new Date(),
      })
      .where(eq(cafes.id, id))
      .returning();

    return { data: updated };
  } catch (error: any) {
    if (error?.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "Slug already exists",
      });
    }
    if (error?.statusCode) throw error;
    console.error("Failed to update cafe:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
