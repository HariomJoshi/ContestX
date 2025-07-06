export interface SubmissionUpdate {
  success: boolean;
  status: string;
  output?: string;
  error?: string;
  time?: number;
  memory?: number;
}
