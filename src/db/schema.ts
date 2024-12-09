import {
  AnyPgColumn, index,
  pgEnum,
  pgTable,
  text, timestamp, unique,
  varchar
} from "drizzle-orm/pg-core";
import {uuid} from "drizzle-orm/pg-core/columns/uuid";
import {sql} from "drizzle-orm/sql/sql";

export const projectsTable = pgTable("projects", {
  id:uuid('file_id').default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  created_at: timestamp().defaultNow().notNull(),
});

export const fileTypeEnum =  pgEnum('fileType', ['regular', 'directory']);

export const filesTable = pgTable("files", {
  id:uuid('file_id').default(sql`gen_random_uuid()`).primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projectsTable.id, {
    onDelete: "cascade"
  }),
  name: varchar({ length: 255 }).notNull(),
  filetype: fileTypeEnum().default('regular').notNull(),
  content: text(),
  parentId: uuid('parent_id').references((): AnyPgColumn => filesTable.id, {
    onDelete: "cascade"
  }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull().$onUpdate(() => sql`now()`),
}, (table) => {
  return {
    nameIdx: index("file_name_idx").on(table.name),
    projectIdx: index('file_project_id_idx').on(table.projectId),
    uniqueNameInFolder: unique('unique_name_in_folder_idx').on(
      table.projectId, table.parentId, table.name
    )
  }
})

