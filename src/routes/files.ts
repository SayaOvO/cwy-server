import express from "express";
import {db} from "../db";
import {eq} from "drizzle-orm/sql/expressions/conditions";
import {filesTable, projectsTable} from "../db/schema";

const router = express.Router();



export const filesRouter = router;

