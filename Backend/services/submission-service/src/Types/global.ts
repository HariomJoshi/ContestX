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
  token: string;
}

export interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  status: {
    id: number;
    description: string;
  };
}

export interface RunQuestionResponse {
  status?: Number;
  error?: String;
  result?: Judge0Result | null;
  expectedOutput?: String;
}
