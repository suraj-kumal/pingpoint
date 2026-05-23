CREATE TABLE "cafes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"city" varchar(100),
	"location" text,
	"cover_image" text,
	"excerpt" text,
	"description" text,
	"conclusion" text,
	"meta_title" varchar(255),
	"meta_description" varchar(255),
	"meta_keywords" text,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cafes_slug_unique" UNIQUE("slug")
);
