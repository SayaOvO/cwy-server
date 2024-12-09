import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from "postgres";
import * as process from "node:process";
import * as schema from "./schema";
import 'dotenv/config.js'

export const db = drizzle(postgres(process.env.DATABASE_URL!, { prepare: false, max: 1}), { schema });
