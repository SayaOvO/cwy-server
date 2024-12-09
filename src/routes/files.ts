import express from "express";
import {db} from "../db";
import {eq} from "drizzle-orm/sql/expressions/conditions";
import {filesTable, projectsTable} from "../db/schema";

const router = express.Router();

router.get('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const files = await db.select().from(projectsTable).where(eq(filesTable.projectId, projectId));
    res.json(files);
  } catch (e) {
    next(e)
  }
})

export const filesRouter = router;

