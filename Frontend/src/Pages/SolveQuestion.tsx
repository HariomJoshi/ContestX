import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CodeEditor from "@/components/CodeEditor";

const SolveQuestion: React.FC = () => {
  // States for controlling output visibility and editor theme.
  const [testCasesVisible, setTestCasesVisible] = useState(false);
  const [submissionVisible, setSubmissionVisible] = useState(false);
  const [editorTheme, setEditorTheme] = useState<"light" | "dark">("light");
  const [code, setCode] = useState("// Write your solution here...");

  // When run is pressed, show test cases and hide submission results.
  const handleRun = () => {
    setTestCasesVisible(true);
    setSubmissionVisible(false);
  };

  // When submit is pressed, show submission results and hide test cases.
  const handleSubmit = () => {
    setSubmissionVisible(true);
    setTestCasesVisible(false);
  };

  const toggleTheme = () => {
    setEditorTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Dummy markdown problem statement.
  const problemStatement = `
# Two Sum Problem

Given an array of integers and a target integer, return indices of the two numbers such that they add up to the target.

**Note:**
- Each input has exactly one solution.
- You may not use the same element twice.

**Example:**

\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
\`\`\`
`;

  // Dummy static test cases.
  const staticTestCases = [
    { input: "[2,7,11,15], target = 9", output: "[0,1]" },
    { input: "[3,2,4], target = 6", output: "[1,2]" },
  ];

  // Dummy submission results (can be replaced with actual result data)
  const submissionResults = {
    status: "Accepted",
    runtime: "56 ms",
    memory: "43.2 MB",
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar with Theme Toggle */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="theme-switch" className="text-sm">
            Editor Theme:
          </Label>
          <Switch
            id="theme-switch"
            checked={editorTheme === "dark"}
            onCheckedChange={toggleTheme}
          />
          <span className="text-sm">
            {editorTheme === "dark" ? "Dark" : "Light"}
          </span>
        </div>
      </div>

      {/* Main Content: Problem Statement and Code Editor */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Problem Statement */}
        <Card className="p-4">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">Problem Statement</h2>
            <div className="prose">
              <ReactMarkdown>{problemStatement}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
        {/* Code Editor */}
        <Card className="p-4">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">Code Editor</h2>
            <CodeEditor
              value={code}
              onChange={setCode}
              editorTheme={editorTheme}
            />
          </CardContent>
          {/* Action Buttons */}
          <div className="flex justify-end">
            <div className="space-x-4">
              <Button onClick={handleRun} variant="outline">
                Run
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Animated Bottom Section */}
      <AnimatePresence>
        {testCasesVisible && (
          <motion.div
            initial={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 50 }}
            transition={{ duration: 0.5 }}
            className="relative p-4 bg-gray-50 dark:bg-gray-900"
          >
            {/* Close Button */}
            <button
              onClick={() => setTestCasesVisible(false)}
              className="absolute top-2 right-2 text-2xl leading-none"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Test Cases</h2>
            <Card className="p-4">
              <CardContent>
                {staticTestCases.map((test, index) => (
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
            {/* Close Button */}
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
                  <strong>Status:</strong> {submissionResults.status}
                </p>
                <p className="text-sm">
                  <strong>Runtime:</strong> {submissionResults.runtime}
                </p>
                <p className="text-sm">
                  <strong>Memory:</strong> {submissionResults.memory}
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
