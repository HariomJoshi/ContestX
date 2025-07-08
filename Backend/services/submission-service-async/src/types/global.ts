export interface RunRequest {
  code: string;
  language: string;
  testCases?: string;
  customInput?: string; // Optional custom input for quick testing
  questionId: string; // Optional question ID for context
  userId: string; // User ID for tracking submissions
  contestId?: string; // Optional contest ID for context
}

export interface TestCase {
  input: string;
  output: string;
}

export interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
  token: string;
  status: {
    id: number;
    description: string;
  };
}

export interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: number;
  memory: number;
  status: {
    id: number;
    description: string;
  };
}

export interface RunQuestionResponse {
  result?: Judge0Result | null;
  status?: number;
  error?: string;
  expectedOutput?: string;
}

export interface Submission {
  code: string;
  language: string;
  testCases: any; // JSON string of test cases
}

export interface SubmissionUpdate {
  success: boolean;
  status: string;
  output?: string;
  error?: string;
  time?: number;
  memory?: number;
}
