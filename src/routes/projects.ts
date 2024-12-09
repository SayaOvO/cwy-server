import express from "express";
import {db} from "../db";
import {filesTable, projectsTable} from "../db/schema";
import {eq} from "drizzle-orm/sql/expressions/conditions";
import {HttpError} from "../middlewares/errorHandler";

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Project name is required" });
  }
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.name, name));

  try {
    if (project) {
      throw new HttpError(400, 'Project already exists');
    }
    const [createdProject] = await db.insert(projectsTable).values({
      name,
      description,
    }).returning();
    return res.status(201).json(createdProject)
  } catch (error) {
    next(error)
  }
})


router.get('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const files = await db.select().from(filesTable).where(eq(filesTable.projectId, projectId));
    return res.json(files);
  } catch (e) {
    next(e)
  }
})

export const projectsRouter = router;
