import express from "express";
import { db } from "../db";
import { filesTable, projectsTable } from "../db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { HttpError } from "../middlewares/errorHandler";
import { buildFileTree } from "../lib/build-file-tree";

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Project name is required" });
  }
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, name));

  try {
    if (project) {
      throw new HttpError(400, "Project already exists");
    }
    await db.transaction(async (tx) => {
      const [project] = await tx
        .insert(projectsTable)
        .values({
          name,
          description,
        })
        .returning();
      await tx.insert(filesTable).values({
        projectName: project.name,
        path: "",
        name,
        fileType: "directory",
        projectId: project.id,
      });
    });

    const [createdProject] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.name, name));

    return res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
});

router.get("/:projectId", async (req, res, next) => {
  try {
    const { projectId } = req.params;

    let files: Array<typeof filesTable.$inferInsert> = [];
    await db.transaction(async (tx) => {
      const [project] = await tx
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.id, projectId));
      files = await tx
        .select()
        .from(filesTable)
        .where(eq(filesTable.projectId, projectId));
    });

    const fileTree = buildFileTree(files);
    return res.json(files);
  } catch (e) {
    next(e);
  }
});

export const projectsRouter = router;
