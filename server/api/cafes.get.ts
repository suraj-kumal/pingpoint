import { db } from "~/server/db";

import { cafes } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    //get query paramete
    const query = getQuery(event);

    //page and limit
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 7;

    const offset = (page - 1) * limit;

    const cafesData = await db.select().from(cafes).limit(limit).offset(offset);
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
