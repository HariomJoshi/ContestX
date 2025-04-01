import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Clock,
  Code2,
  FileCode,
  Lightbulb,
  Lock,
  CheckCircle2,
  XCircle,
  GripVertical,
} from "lucide-react";

interface Question {
  id: number;
  title: string;
  description: string;
  constraints: string;
  testCases: {
    input: string;
    output: string;
  }[];
  tags: string[];
}

interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

interface SolveQuestionProps {
  question?: Question;
}

const SolveQuestion: React.FC<SolveQuestionProps> = ({
  question: propQuestion,
}) => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(
    propQuestion || null
  );
  const [loading, setLoading] = useState(!propQuestion);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [submissionVisible, setSubmissionVisible] = useState(false);
  const [language, setLanguage] = useState<string>("javascript");
  const [monacoTheme, setMonacoTheme] = useState<"vs-light" | "vs-dark">(
    "vs-dark"
  );
  const [code, setCode] = useState("// Write your solution here...");
  const [resultsVisible, setResultsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const separatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (propQuestion) {
      setQuestion(propQuestion);
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/questions/${id}`
        );
        setQuestion(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
        toast.error("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id, propQuestion]);

  useEffect(() => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  }, []);

  const handleRun = async () => {
    if (!question) return;

    try {
      // Here you would typically send the code to your backend for execution
      // For now, we'll simulate test results
      const results: TestResult[] = question.testCases.map((testCase) => {
        // This is a mock implementation - replace with actual code execution
        const actualOutput = "Mock output"; // Replace with actual code execution
        const passed = actualOutput.trim() === testCase.output.trim();

        return {
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput,
          passed,
        };
      });

      setTestResults(results);
      setResultsVisible(true);
    } catch (error) {
      console.error("Error running code:", error);
      toast.error("Failed to run code");
    }
  };

  const handleSubmit = () => {
    setSubmissionVisible(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !separatorRef.current) return;

      const container = separatorRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Limit the width between 30% and 70% of the container
      const clampedWidth = Math.min(Math.max(newWidth, 30), 70);
      setEditorWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Question not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{question.title}</h1>
            <div className="flex gap-2 mt-2">
              {question.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleRun} variant="outline">
              <FileCode className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button onClick={handleSubmit}>
              <Code2 className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden relative">
        {/* Problem Statement Section */}
        <div
          className="w-full p-4 space-y-4 overflow-auto"
          style={{
            width: window.innerWidth >= 1024 ? `${editorWidth}%` : "100%",
          }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold">Problem Statement</h2>
              </div>
              <div className="prose max-w-none">
                <ReactMarkdown>{question.description}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold">Constraints</h2>
              </div>
              <div className="prose max-w-none">
                <ReactMarkdown>{question.constraints}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold">Sample Test Cases</h2>
                </div>
                <Button onClick={handleRun} variant="outline" size="sm">
                  <FileCode className="w-4 h-4 mr-2" />
                  Run
                </Button>
              </div>
              <div className="space-y-4">
                {question.testCases.map((test, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Test Case {index + 1}</p>
                        {testResults[index] &&
                          (testResults[index].passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <strong className="text-blue-500">Input:</strong>
                        <pre className="mt-1 bg-white dark:bg-gray-900 p-2 rounded">
                          {test.input}
                        </pre>
                      </div>
                      <div>
                        <strong className="text-green-500">
                          Expected Output:
                        </strong>
                        <pre className="mt-1 bg-white dark:bg-gray-900 p-2 rounded">
                          {test.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  <p>
                    Additional test cases are hidden and will be used for
                    evaluation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resizable Separator */}
        <div
          ref={separatorRef}
          className={`hidden lg:block absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors ${
            isDragging ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
          }`}
          style={{ left: `${editorWidth}%` }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Code Editor Section */}
        <div
          className="w-full p-4 lg:border-l"
          style={{
            width: window.innerWidth >= 1024 ? `${100 - editorWidth}%` : "100%",
          }}
        >
          <Card className="h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="language-select" className="text-sm">
                    Language:
                  </Label>
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="java">Java</option>
                    <option value="C++14">C++14</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="theme-select" className="text-sm">
                    Theme:
                  </Label>
                  <select
                    id="theme-select"
                    value={monacoTheme}
                    onChange={(e) =>
                      setMonacoTheme(e.target.value as "vs-light" | "vs-dark")
                    }
                    className="p-1 border rounded"
                  >
                    <option value="vs-light">Light</option>
                    <option value="vs-dark">Dark</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 min-h-[400px]">
                <Editor
                  height="100%"
                  defaultLanguage={language}
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme={monacoTheme}
                  options={{ fontSize: 18 }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {resultsVisible && (
          <motion.div
            initial={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-900 w-full z-50"
          >
            <div className="w-full max-w-4xl mx-auto px-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Test Results</h2>
                <button
                  onClick={() => setResultsVisible(false)}
                  className="text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium">Test Case {index + 1}</p>
                          {result.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <strong className="text-blue-500">Input:</strong>
                            <pre className="mt-1 bg-white dark:bg-gray-900 p-2 rounded">
                              {result.input}
                            </pre>
                          </div>
                          <div>
                            <strong className="text-green-500">
                              Expected Output:
                            </strong>
                            <pre className="mt-1 bg-white dark:bg-gray-900 p-2 rounded">
                              {result.expectedOutput}
                            </pre>
                          </div>
                          <div>
                            <strong className="text-purple-500">
                              Your Output:
                            </strong>
                            <pre className="mt-1 bg-white dark:bg-gray-900 p-2 rounded">
                              {result.actualOutput}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {submissionVisible && (
          <motion.div
            initial={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-900 w-full z-50"
          >
            <div className="w-full max-w-4xl mx-auto px-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submission Results</h2>
                <button
                  onClick={() => setSubmissionVisible(false)}
                  className="text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Runtime</span>
                      <span className="text-sm text-gray-500">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory</span>
                      <span className="text-sm text-gray-500">-</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolveQuestion;
