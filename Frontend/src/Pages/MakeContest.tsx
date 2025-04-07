// src/Pages/MakeContest.tsx
import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  title: string;
  description: string;
  testCases: string;
  constraints: string;
  tags: string[];
}

const MakeContests: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/questions`
        );
        setAvailableQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to fetch questions");
      }
    };

    fetchQuestions();
  }, []);

  const handleAddQuestion = () => {
    if (questions.length >= 4) {
      toast.error("Maximum 4 questions allowed");
      return;
    }
    setQuestions([...questions, availableQuestions[0]]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, questionId: number) => {
    const selectedQuestion = availableQuestions.find(
      (q) => q.id === questionId
    );
    if (selectedQuestion) {
      const newQuestions = [...questions];
      newQuestions[index] = selectedQuestion;
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }
    if (questions.length > 4) {
      toast.error("Maximum 4 questions allowed");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/contests`, {
        title,
        description,
        startTime: `${date}T${startTime}`,
        endTime: `${date}T${endTime}`,
        questionIds: questions.map((q) => q.id),
      });
      toast.success("Contest created successfully");
      navigate("/ongoing-contest");
    } catch (error) {
      console.error("Error creating contest:", error);
      toast.error("Failed to create contest");
    } finally {
      setLoading(false);
    }
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
              required
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
              required
            />
          </div>
          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Contest Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
              required
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
              className="mt-1"
              required
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
              className="mt-1"
              required
            />
          </div>
          {/* Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Questions (Max 4)
            </label>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Select
                    value={question.id.toString()}
                    onValueChange={(value) =>
                      handleQuestionChange(index, parseInt(value))
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a question" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableQuestions.map((q) => (
                        <SelectItem key={q.id} value={q.id.toString()}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddQuestion}
                disabled={questions.length >= 4}
                className="w-full"
              >
                Add Question
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Contest"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MakeContests;
