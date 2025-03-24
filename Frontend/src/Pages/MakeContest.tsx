// src/Pages/MakeContest.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface Question {
  id: number;
  title: string;
}

// Sample questions – in a real application, these might come from an API or context.
const sampleQuestions: Question[] = [
  { id: 1, title: "2Sum" },
  { id: 2, title: "3Sum" },
  { id: 3, title: "Find the min array" },
  { id: 4, title: "Find the min array" },
];

const MakeContests: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace this with your form submission logic
    console.log("Creating contest with data:", {
      title,
      description,
      startTime,
      endTime,
      selectedQuestion,
    });
  };

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a Contest</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contest Title */}
          <div>
            <label
              htmlFor="contest-title"
              className="block text-sm font-medium text-gray-700"
            >
              Contest Title
            </label>
            <Input
              id="contest-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter contest title"
              className="mt-1"
            />
          </div>
          {/* Contest Description */}
          <div>
            <label
              htmlFor="contest-description"
              className="block text-sm font-medium text-gray-700"
            >
              Contest Description
            </label>
            <Textarea
              id="contest-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter contest description"
              className="mt-1"
            />
          </div>
          {/* date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <Input
              id="date"
              type="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Date"
              className="mt-1"
            />
          </div>
          {/* Start Time */}
          <div>
            <label
              htmlFor="start-time"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Start Time"
              className="mt-1"
            />
          </div>
          {/* End Time */}
          <div>
            <label
              htmlFor="end-time"
              className="block text-sm font-medium text-gray-700"
            >
              End Time
            </label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="End Time"
              className="mt-1"
            />
          </div>
          {/* Question Selector */}
          <div>
            <label
              htmlFor="question-select"
              className="block text-sm font-medium text-gray-700"
            >
              Select a Question
            </label>
            <Select onValueChange={(value) => setSelectedQuestion(value)}>
              <SelectTrigger id="question-select" className="mt-1">
                <SelectValue placeholder="Choose a question" />
              </SelectTrigger>
              <SelectContent>
                {sampleQuestions.map((question) => (
                  <SelectItem key={question.id} value={question.id.toString()}>
                    {question.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-5"
          >
            <Button type="submit" className="w-full">
              Create Contest
            </Button>
          </motion.div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MakeContests;
