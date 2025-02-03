CREATE TABLE "table_metadata" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"modified_by" text,
	"section" text NOT NULL,
	"column_name" text NOT NULL,
	"data_type" text NOT NULL,
	"column_description" text,
	"sensitive" boolean DEFAULT false NOT NULL
);
