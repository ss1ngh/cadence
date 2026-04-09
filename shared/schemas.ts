import { z } from "zod";

export const JobTypeSchema = z.enum(["VIDEO_TRANSCODE", "GENERATE_REPORT", "SEND_BULK_EMAIL"]);

export const VideoPayloadSchema = z.object({
  type: z.literal("VIDEO_TRANSCODE"),
  data: z.object({
    fileUrl: z.url("Must be a valid URL"),
    resolution: z.enum(["1080p", "720p", "360p"]),
  }),
});

export const ReportPayloadSchema = z.object({
  type: z.literal("GENERATE_REPORT"),
  data: z.object({
    userId: z.string().min(1, "userId is required"),
    dateRange: z.object({
      start: z.string(),
      end: z.string(),
    }),
  }),
});

export const EmailPayloadSchema = z.object({
  type: z.literal("SEND_BULK_EMAIL"),
  data: z.object({
    templateId: z.string().min(1, "templateId is required"),
    recipients: z.array(z.string().email("Must be a valid email array")),
    variables: z.record(z.string(), z.string()),
  }),
});

export const JobDataSchema = z.discriminatedUnion("type", [
  VideoPayloadSchema,
  ReportPayloadSchema,
  EmailPayloadSchema,
]);

export const JobStatusUpdateSchema = z.object({
  jobId: z.string(),
  progress: z.number().min(0).max(100),
  status: z.enum(["active", "completed", "failed"]),
});
