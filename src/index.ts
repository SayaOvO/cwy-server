import express from "express";
import cors from "cors";
import {projectsRouter} from "./routes/projects";
import {filesRouter} from "./routes/files";
import {errorHandler} from "./middlewares/errorHandler";
import {createServer} from "node:http";

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/projects', projectsRouter);
app.use('/api/files', filesRouter);
app.use(errorHandler);

const server = createServer(app);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});








