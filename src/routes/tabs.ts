import express from "express";
import { db } from "../db";
import { tabsTable } from "../db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const tabs = await db.query.tabsTable.findMany({
      with: {
        file: true,
      },
    });
    return res.json(tabs);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  const { fileId, filename } = req.body;
  try {
    const [createdTab] = await db
      .insert(tabsTable)
      .values({
        fileId,
        filename,
      })
      .returning();
    return res.status(201).json(createdTab);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.delete(tabsTable).where(eq(tabsTable.id, id));
    return res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export const tabsRouter = router;
