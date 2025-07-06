export interface TestCase {
  input: string;
  output: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  testCases: TestCase[];
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  tags: string[];
}

export interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface SolveQuestionProps {
  question: Question;
  contestId?: number;
}

export interface SubmissionUpdate {
  success: boolean;
  status: string;
  output?: string;
  error?: string;
  time?: number;
  memory?: number;
}
