export type JobType = "VIDEO_TRANSCODE" | "GENERATE_REPORT" | "SEND_BULK_EMAIL";

export interface VideoPayload {
  type: "VIDEO_TRANSCODE";
  data: {
    fileUrl: string;
    resolution: "1080p" | "720p" | "360p";
  };
}

export interface ReportPayload {
  type: "GENERATE_REPORT";
  data: {
    userId: string;
    dateRange: { start: string; end: string };
  };
}

interface EmailPayload {
  type: "SEND_BULK_EMAIL"; // The "Label"
  data: {
    templateId: string;
    recipients: string[];
    variables: Record<string, string>;
  };
}

export type JobData = VideoPayload | ReportPayload | EmailPayload;

export interface JobStatusUpdate {
  jobId: string;
  progress: number;
  status: "active" | "completed" | "failed";
}
