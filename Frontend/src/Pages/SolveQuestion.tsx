import React, { useState, useEffect } from "react";
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

interface Question {
  id: number;
  title: string;
  description: string;
  constraints: string;
  testCases: any[];
  tags: string[];
}

const SolveQuestion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [testCasesVisible, setTestCasesVisible] = useState(false);
  const [submissionVisible, setSubmissionVisible] = useState(false);
  const [language, setLanguage] = useState<string>("javascript");
  const [monacoTheme, setMonacoTheme] = useState<"vs-light" | "vs-dark">(
    "vs-dark"
  );
  const [code, setCode] = useState("// Write your solution here...");

  useEffect(() => {
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
  }, [id]);

  useEffect(() => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  }, []);

  const handleRun = () => {
    setTestCasesVisible(true);
    setSubmissionVisible(false);
  };

  const handleSubmit = () => {
    setSubmissionVisible(true);
    setTestCasesVisible(false);
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
        <div className="text-xl text-red-500">Question not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">{question.title}</h1>
        <div className="flex gap-2 mt-2">
          {question.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <Card className="p-4">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">Problem Statement</h2>
            <div className="prose max-w-none">
              <ReactMarkdown>{question.description}</ReactMarkdown>
            </div>
            {question.constraints && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Constraints</h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{question.constraints}</ReactMarkdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
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
            <Editor
              height="400px"
              defaultLanguage={language}
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={monacoTheme}
              options={{ fontSize: 18 }}
            />
          </CardContent>
          <div className="flex justify-end p-4">
            <div className="space-x-4">
              <Button onClick={handleRun} variant="outline">
                Run
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {testCasesVisible && (
          <motion.div
            initial={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 50 }}
            transition={{ duration: 0.5 }}
            className="relative p-4 bg-gray-50 dark:bg-gray-900"
          >
            <button
              onClick={() => setTestCasesVisible(false)}
              className="absolute top-2 right-2 text-2xl leading-none"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Test Cases</h2>
            <Card className="p-4">
              <CardContent>
                {question.testCases.map((test, index) => (
                  <div key={index} className="mb-4 border-b pb-2">
                    <p className="font-medium">Test Case {index + 1}:</p>
                    <p className="text-sm">
                      <strong>Input:</strong> {test.input}
                    </p>
                    <p className="text-sm">
                      <strong>Expected Output:</strong> {test.output}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {submissionVisible && (
          <motion.div
            initial={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 50 }}
            transition={{ duration: 0.5 }}
            className="relative p-4 bg-gray-50 dark:bg-gray-900"
          >
            <button
              onClick={() => setSubmissionVisible(false)}
              className="absolute top-2 right-2 text-2xl leading-none"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Submission Results</h2>
            <Card className="p-4">
              <CardContent>
                <p className="text-sm">
                  <strong>Status:</strong> Pending
                </p>
                <p className="text-sm">
                  <strong>Runtime:</strong> -
                </p>
                <p className="text-sm">
                  <strong>Memory:</strong> -
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolveQuestion;
