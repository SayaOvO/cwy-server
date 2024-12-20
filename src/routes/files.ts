import express from "express";
import { eq } from "drizzle-orm/sql/expressions/conditions";

import { db } from "../db";
import { filesTable } from "../db/schema";
const router = express.Router();

router.get("/:fileId", async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const [files] = await db
      .select()
      .from(filesTable)
      .where(eq(filesTable.id, fileId));
    return res.json(files);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, fileType, projectId, parentId, path } = req.body;
    const [file] = await db
      .insert(filesTable)
      .values({
        path,
        name,
        fileType,
        projectId,
        parentId,
      })
      .returning();
    console.log("file", file);
    return res.status(201).json(file);
  } catch (error) {
    next(error);
  }
});

export const filesRouter = router;
