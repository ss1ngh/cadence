import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ host: "127.0.0.1", port: 6379 });
const taskQueue = new Queue("main-task-queue", { connection });

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/ui");

createBullBoard({
  queues: [new BullMQAdapter(taskQueue)],
  serverAdapter: serverAdapter,
});

const app = express();
app.use("/ui", serverAdapter.getRouter());

app.listen(3001, () => {
  console.log("Admin Dashboard running on http://localhost:3001/ui");
});
