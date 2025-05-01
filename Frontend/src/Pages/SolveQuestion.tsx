import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TestCase {
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

interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

interface SolveQuestionProps {
  question: Question;
  contestId?: number;
}

const SolveQuestion: React.FC<SolveQuestionProps> = ({
  question: propQuestion,
  contestId,
}) => {
  const [question, setQuestion] = useState<Question | null>(
    propQuestion || null
  );
  const [loading, setLoading] = useState(!propQuestion);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [submissionVisible, setSubmissionVisible] = useState(false);
  const [language, setLanguage] = useState("java");
  const [monacoTheme, setMonacoTheme] = useState<"vs-light" | "vs-dark">(
    "vs-dark"
  );
  const userId = useSelector((state: RootState) => state.user.data.id);
  const [halfCode, setHalfCode] =
    useState(`private static void solve(Scanner scan){
    // Write your solution here        
}`);
  const [code, setCode] = useState("");
  const [resultsVisible, setResultsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const separatorRef = useRef<HTMLDivElement>(null);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">(
    "description"
  );
  const [selectedLanguage, setSelectedLanguage] = useState("java");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const [id, setId] = useState<Number>();
  const [response, setResponse] = useState<{
    success: boolean;
    status: string;
    output?: string;
    error?: string;
    time?: number;
    memory?: number;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  console.log(question);

  useEffect(() => {
    setId(question?.id);
  }, []);

  useEffect(() => {
    setCode(`import java.util.*;

      public class Main {
       
          public static void main(String[] args) {
              try {
                  int t;
                  Scanner scan = new Scanner(System.in);
                  t = scan.nextInt();
                  while(t-- != 0){
                      solve(scan);
                  }
                  scan.close();
              } catch (Exception e) {
                  e.printStackTrace();
                  throw new NullPointerException("Some Error Occured");
              }
          }
      
          ${halfCode}
      }`);
  }, [halfCode]);

  useEffect(() => {
    if (propQuestion) {
      setQuestion(propQuestion);
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/questions/${id}`
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

  useEffect(() => {
    if (!question?.testCases) return;
    const visibleTestCase: TestCase[] = question.testCases;
    setTestCases(visibleTestCase);
  }, [question?.testCases]);

  const scrollToResult = () => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setResponse(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/solve/run`,
        {
          code,
          language: selectedLanguage,
          testCases: testCases,
          questionId: id,
        }
      );
      setResponse(response.data);
      setTimeout(scrollToResult, 100); // Small delay to ensure DOM is updated
    } catch (error) {
      console.error("Error running code:", error);
      setResponse({
        success: false,
        status: "error",
        error: "Failed to run code. Please try again.",
      });
      setTimeout(scrollToResult, 100);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunCustomInput = async () => {
    setIsRunning(true);
    // setResultsVisible(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/solve/run`,
        {
          code,
          language: selectedLanguage,
          customInput,
          questionId: id,
        }
      );

      setCustomOutput(response.data.output);
      setTestResults([
        {
          input: customInput,
          expectedOutput: "",
          actualOutput: response.data.output,
          passed: true,
        },
      ]);
    } catch (error) {
      console.error("Error running code:", error);
      toast.error("Failed to run code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResponse(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/solve/submit`,
        {
          code,
          userId,
          language: selectedLanguage,
          questionId: question?.id,
          ...(contestId && { contestId }),
          testCases,
        }
      );
      setResponse(response.data);
      setTimeout(scrollToResult, 100);
    } catch (error) {
      console.error("Error submitting code:", error);
      setResponse({
        success: false,
        status: "error",
        error: "Failed to submit code. Please try again.",
      });
      setTimeout(scrollToResult, 100);
    } finally {
      setIsSubmitting(false);
    }
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

  const prevCodeRef = useRef<string>(halfCode);

  // handling code change
  const handleChange = (value: string | undefined) => {
    const newCode = value ?? "";
    const prevCode = prevCodeRef.current;
    console.log(newCode.length);
    console.log(prevCode.length);

    // if the new text is more than 10 chars longer than before, reject it
    if (newCode.length > prevCode.length + 20) {
      // reset back to the previous value
      console.log("rejected");
      setHalfCode(prevCode);
      editorRef.current?.setValue(prevCode);
    } else {
      // accept the change
      setHalfCode(newCode);
      prevCodeRef.current = newCode;
    }
  };
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const handleEditorMount = (editor: any) => {
    // Disable copy-paste
    editorRef.current = editor;
    editor.onKeyDown((e: any) => {
      if ((e.ctrlKey || e.metaKey) && (e.keyCode === 67 || e.keyCode === 86)) {
        e.preventDefault();
        toast.error("Copy-paste is disabled during contests");
      }
    });

    // Disable context menu
    editor.onContextMenu((e: any) => {
      e.preventDefault();
      toast.error("Right-click is disabled during contests");
    });
  };

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
        <div className="text-xl text-red-500">Question not f ound</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Loading Modal */}
      <Dialog open={isRunning || isSubmitting}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col     items-center justify-center p-6">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">
              {isRunning ? "Running Code..." : "Submitting Code..."}
            </p>
          </div>
        </DialogContent>
      </Dialog>

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
            <Button onClick={handleRunCode} variant="outline">
              <FileCode className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Dialog
              open={isCustomInputOpen}
              onOpenChange={setIsCustomInputOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Code2 className="w-4 h-4 mr-2" />
                  Run Custom Input
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Run with Custom Input</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="custom-input">Input</Label>
                    <Textarea
                      id="custom-input"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter your custom input"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="custom-output">Output</Label>
                    <Textarea
                      id="custom-output"
                      value={customOutput}
                      readOnly
                      className="min-h-[100px] bg-gray-100"
                    />
                  </div>
                  <Button onClick={handleRunCustomInput} disabled={isRunning}>
                    {isRunning ? "Running..." : "Run"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSubmit}>
              <Code2 className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden relative">
        {/* Left Section - Problem Details */}
        <div
          className="w-full lg:w-auto p-6 overflow-y-auto h-[calc(100vh-4rem)]"
          style={{
            width: window.innerWidth >= 1024 ? `${editorWidth}%` : "100%",
          }}
        >
          <div className="space-y-6">
            {/* Problem Statement */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-bold">Problem Statement</h2>
                </div>
                <div className="prose max-w-none">
                  <ReactMarkdown>{question?.description}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Input Format */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl font-bold">Input Format</h2>
                </div>
                <div className="prose max-w-none">
                  <ReactMarkdown>{question?.inputFormat}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Output Format */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl font-bold">Output Format</h2>
                </div>
                <div className="prose max-w-none">
                  <ReactMarkdown>{question?.outputFormat}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Constraints */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl font-bold">Constraints</h2>
                </div>
                <div className="prose max-w-none">
                  <ReactMarkdown>{question?.constraints}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-bold">Sample Test Cases</h2>
                  </div>
                  <Button onClick={handleRunCode} variant="outline" size="sm">
                    <FileCode className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                </div>
                <div className="space-y-4">
                  {testCases.map((test, index) => (
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
                </div>
              </CardContent>
            </Card>
          </div>
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

        {/* Right Section - Editor and Results */}
        <div
          className="w-full lg:w-auto p-6 overflow-y-auto h-[calc(100vh-4rem)]"
          style={{
            width: window.innerWidth >= 1024 ? `${100 - editorWidth}%` : "100%",
          }}
        >
          <div className="flex flex-col h-full">
            {/* Editor Section */}
            <div className="flex-1">
              <Card className="h-full">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="language-select" className="text-sm">
                        Language:
                      </Label>
                      <div className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-800">
                        Java
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="theme-select" className="text-sm">
                        Theme:
                      </Label>
                      <select
                        id="theme-select"
                        value={monacoTheme}
                        onChange={(e) =>
                          setMonacoTheme(
                            e.target.value as "vs-light" | "vs-dark"
                          )
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
                      defaultLanguage="java"
                      language="java"
                      value={halfCode}
                      onChange={handleChange}
                      // onChange={(value) => setHalfCode(value || "")}
                      theme={monacoTheme}
                      onMount={handleEditorMount}
                      options={{
                        fontSize: 18,
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        automaticLayout: true,
                        contextmenu: false, // Disable context menu
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div ref={resultRef} className="mt-4">
              <AnimatePresence>
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4"
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Result</h3>
                            <Badge
                              variant={
                                response.success
                                  ? "secondary"
                                  : response.status === "wrong_answer"
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {response.status.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          {response.time && response.memory && (
                            <div className="flex gap-4 text-sm text-gray-500">
                              <span>Time: {response.time}ms</span>
                              <span>Memory: {response.memory}KB</span>
                            </div>
                          )}
                          {response.output && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Output</h4>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-x-auto">
                                {response.output}
                              </pre>
                            </div>
                          )}
                          {response.error && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-red-500">
                                Error
                              </h4>
                              <pre className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-sm overflow-x-auto text-red-500">
                                {response.error}
                              </pre>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge
                        variant={
                          response?.success ? "secondary" : "destructive"
                        }
                        className="capitalize"
                      >
                        {response?.status || "Pending"}
                      </Badge>
                    </div>
                    {response?.time && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Runtime</span>
                        <span className="text-sm text-gray-500">
                          {response.time} ms
                        </span>
                      </div>
                    )}
                    {response?.memory && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Memory</span>
                        <span className="text-sm text-gray-500">
                          {response.memory} KB
                        </span>
                      </div>
                    )}
                    {response?.output && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Output</span>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-x-auto">
                          {response.output}
                        </pre>
                      </div>
                    )}
                    {response?.error && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-red-500">
                          Error
                        </span>
                        <pre className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-sm overflow-x-auto text-red-500">
                          {response.error}
                        </pre>
                      </div>
                    )}
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
