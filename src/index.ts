import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
// @ts-ignore
import { setupWSConnection } from 'y-websocket/bin/utils';
import {projectsRouter} from "./routes/projects";
import {filesRouter} from "./routes/files";
import {errorHandler} from "./middlewares/errorHandler";
import {createServer} from "node:http";
import {tabsRouter} from "./routes/tabs";

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/projects', projectsRouter);
app.use('/api/files', filesRouter);
app.use('/api/tabs', tabsRouter);
app.use(errorHandler);

const server = createServer(app);

const wsserver =new WebSocketServer({ server })

wsserver.on("connection", (conn, req) => {
  console.log(req.url?.slice(1).split("?")[0]);
  setupWSConnection(conn, req);
  conn.on('error', (error) => {
    console.log('connection error:', error);
  });
});

wsserver.on("error", (error) => {
  console.log("WebSocket Server Error:", error);
});


const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});








