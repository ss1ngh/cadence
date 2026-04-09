import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import type { JobData } from "../shared/types";
import { config } from "../shared/env";

//establish connection to redis
const connection = new IORedis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  maxRetriesPerRequest: null,
});

console.log("worker is starting up and listening to Redis");

const worker = new Worker<JobData>(
  "main-task-queue",
  async (job: Job<JobData>) => {
    console.log(`\n Picked up job ${job.id} of type ${job.data.type}`);

    switch (job.data.type) {
      case "VIDEO_TRANSCODE":
        await job.log(`Processing video: ${job.data.data.fileUrl}`);
        await job.log(`Target resolution: ${job.data.data.resolution}`);
        console.log(`Processing video: ${job.data.data.fileUrl}`);
        //simulate heavy work with progress updates
        await job.updateProgress(33);
        await new Promise((res) => setTimeout(res, 1000));
        await job.updateProgress(66);
        await new Promise((res) => setTimeout(res, 1000));
        await job.updateProgress(100);
        await new Promise((res) => setTimeout(res, 1000));
        await job.log("video transcoding completed");
        console.log("video transcoding completed");
        break;

      case "GENERATE_REPORT":
        await job.log(`Generating report for User: ${job.data.data.userId}`);
        console.log(`Generating report for User: ${job.data.data.userId}`);
        await job.updateProgress(50);
        await new Promise((res) => setTimeout(res, 1500));
        await job.updateProgress(100);
        await new Promise((res) => setTimeout(res, 1500));
        await job.log("Report has been generated!");
        console.log("Report has been generated!");
        break;

      case "SEND_BULK_EMAIL":
        await job.log(`Sending emails for template: ${job.data.data.templateId}`);
        console.log(`Sending emails for template: ${job.data.data.templateId}`);
        await job.updateProgress(50);
        await new Promise((res) => setTimeout(res, 1500));
        await job.updateProgress(100);
        await new Promise((res) => setTimeout(res, 1500));
        await job.log("All Emails sent!");
        console.log("All Emails sent!");
        break;

      default:
        throw new Error("Unknown job type");
    }
    //return data to save it to completed redis hash
    return { success: true, processedAt: new Date().toISOString() };
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} marked as completed in Redis.`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed: ${err.message}`);
});

async function gracefulShutdown(signal: string) {
  console.log(`\nReceived ${signal}, shutting down worker...`);
  // close() stops accepting new jobs and gracefully waits for active jobs to finish
  await worker.close();
  connection.quit();
  console.log("Worker Graceful shutdown complete.");
  process.exit(0);
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
