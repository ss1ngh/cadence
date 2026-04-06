import { Queue } from "bullmq";
import express from "express";
import IORedis from "ioredis";
import type { JobData } from "../shared/types";

const app = express();
app.use(express.json());

//establish connection to docker redis container
const connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

//intialize the queue
const taskQueue = new Queue<JobData>("main-task-queue", { connection });

app.post("/submit", async (req, res) => {
  try {
    const data: JobData = req.body;

    const job = await taskQueue.add("process-task", data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });

    console.log(`Added job ${job.id} to the queue`);

    return res.status(202).json({
      success: true,
      jobId: job.id,
      message: "job is now in the queue",
    });
  } catch (error) {
    console.log(error);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
