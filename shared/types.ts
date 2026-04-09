import { z } from "zod";
import {
  JobTypeSchema,
  VideoPayloadSchema,
  ReportPayloadSchema,
  EmailPayloadSchema,
  JobDataSchema,
  JobStatusUpdateSchema,
} from "./schemas";

export type JobType = z.infer<typeof JobTypeSchema>;
export type VideoPayload = z.infer<typeof VideoPayloadSchema>;
export type ReportPayload = z.infer<typeof ReportPayloadSchema>;
export type EmailPayload = z.infer<typeof EmailPayloadSchema>;
export type JobData = z.infer<typeof JobDataSchema>;

export type JobStatusUpdate = z.infer<typeof JobStatusUpdateSchema>;
