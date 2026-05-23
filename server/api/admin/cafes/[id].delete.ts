import { db } from "~/server/db";
import { cafes } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, "id"));

    if (!id || isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
    }

    const [existing] = await db.select().from(cafes).where(eq(cafes.id, id));
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: "Cafe not found" });
    }

    await db.delete(cafes).where(eq(cafes.id, id));

    return { message: `Cafe "${existing.name}" deleted successfully` };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    console.error("Failed to delete cafe:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
