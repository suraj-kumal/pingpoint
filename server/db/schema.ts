import {
  pgTable,
  bigserial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const cafes = pgTable("cafes", {
  id: bigserial("id", { mode: "number" }).primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),

  city: varchar("city", { length: 100 }),
  location: text("location"),

  coverImage: text("cover_image"),

  excerpt: text("excerpt"),
  description: text("description"),
  conclusion: text("conclusion"),

  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 255 }),
  metaKeywords: text("meta_keywords"),

  isPublished: boolean("is_published").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
