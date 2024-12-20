import {
  AnyPgColumn,
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core/columns/uuid";
import { sql } from "drizzle-orm/sql/sql";
import { relations } from "drizzle-orm";

export const projectsTable = pgTable(
  "projects",
  {
    id: uuid("project_id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    created_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("project_name_idx").on(table.name),
    uniqueName: unique("project_name").on(table.name),
  }),
);

export const fileTypeEnum = pgEnum("FileType", ["regular", "directory"]);

export const filesTable = pgTable(
  "files",
  {
    id: uuid("file_id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projectsTable.id),
    // projectName: varchar({ length: 255 })
    //   .notNull()
    //   .references(() => projectsTable.name, {
    //     onDelete: "cascade",
    //   }),
    name: varchar({ length: 255 }).notNull(),
    path: varchar({ length: 255 }).notNull().default(""),
    fileType: fileTypeEnum().default("regular").notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => filesTable.id, {
      onDelete: "cascade",
    }),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => {
    return {
      nameIdx: index("file_name_idx").on(table.name),
      projectIdx: index("file_project_id_idx").on(table.projectId),
      path: index("file_path").on(table.path),
      uniqueNameInFolder: unique("unique_name_in_folder_idx").on(
        table.projectId,
        table.parentId,
        table.name,
      ),
    };
  },
);

export const tabsTable = pgTable(
  "tabs",
  {
    id: uuid("tab_id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    fileId: uuid("file_id")
      .notNull()
      .references(() => filesTable.id, {
        onDelete: "cascade",
      }),
    filename: varchar({ length: 255 }).notNull(),
    created_at: timestamp().defaultNow().notNull(),
  },
  (table) => {
    return {
      fileIdx: index("tab_id_idx").on(table.fileId),
    };
  },
);

export const tabsRelations = relations(tabsTable, ({ one }) => ({
  file: one(filesTable, {
    fields: [tabsTable.fileId],
    references: [filesTable.id],
  }),
}));

export const filesRelations = relations(filesTable, ({ one }) => ({
  projectId: one(projectsTable, {
    fields: [filesTable.parentId],
    references: [projectsTable.id],
  }),
  parent: one(filesTable, {
    fields: [filesTable.parentId],
    references: [filesTable.id],
  }),
  tabs: one(tabsTable),
}));
