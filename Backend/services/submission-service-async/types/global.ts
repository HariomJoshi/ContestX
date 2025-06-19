export interface RunRequest {
  code: string;
  language: string;
  testCases: string;
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
  id: string; // unique id for matching frontend
  code: string;
  language: string;
  testCases: string;
}
