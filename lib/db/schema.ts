import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const tableMetadata = pgTable("table_metadata", {
  id: integer("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  modifiedBy: text("modified_by"),
  section: text("section").notNull(),
  columnName: text("column_name").notNull(),
  dataType: text("data_type").notNull(),
  columnDescription: text("column_description"),
  sensitive: boolean("sensitive").notNull().default(false),
});
