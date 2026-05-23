import { db } from "~/server/db";
import { cafes } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const [cafe] = await db.select().from(cafes).where(eq(cafes.id, id));

  if (!cafe) {
    throw createError({ statusCode: 404, statusMessage: "Cafe not found" });
  }

  return { data: cafe };
});
