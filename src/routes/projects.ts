import express, { Request, Response, NextFunction } from "express";
import {db} from "../db";
import {projectsTable} from "../db/schema";
import {HttpError} from "../middlewares/errorHandler";

const router = express.Router();

router.post('/', async (req: Request, res: Response, next) => {
  const { name, description } = req.body;
  if (!name) {
    throw new HttpError(400, 'Project name is required');
  }
  try {
    const [createdProject] = await db.insert(projectsTable).values({
      name,
      description,
    }).returning();
    return res.status(201).json(createdProject)
  } catch (error) {
    next(error)
  }
})

export const projectsRouter = router;
