import React from "react";
import { Input } from "@/components/ui/input"; // shadcn Input component
import { Card } from "@/components/ui/card"; // shadcn Card component
import { Badge } from "@/components/ui/badge"; // shadcn Badge component
import { Button } from "@/components/ui/button"; // shadcn Button component
import { Question } from "@/types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Motion-wrapped components
const MotionCard = motion(Card);
const MotionButton = motion(Button);

// Dummy questions data
const questions: Question[] = [
  {
    id: 1,
    title: "Two Sum Problem",
    tags: ["Array", "Hash Table", "LeetCode"],
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    tags: ["String", "Sliding Window", "LeetCode"],
  },
  {
    id: 3,
    title: "Merge Intervals",
    tags: ["Sorting", "Intervals", "LeetCode"],
  },
];

const AvailableQuestions: React.FC = () => {
  const navigate = useNavigate();
  const handleSolveQuestion = (id: number) => {
    // Navigate to the question detail/solve page
    navigate(`/questions/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search coding questions..."
          className="w-full"
          // Search functionality to be implemented later
        />
      </div>

      {/* Questions List */}
      <motion.div
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {questions.map((question) => (
          <MotionCard
            key={question.id}
            className="p-4 relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <Badge key={tag} className="bg-blue-100 text-blue-800">
                  {tag}
                </Badge>
              ))}
            </div>
            <MotionButton
              onClick={() => handleSolveQuestion(question.id)}
              className="absolute bottom-4 right-4 w-1/5"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Solve Question
            </MotionButton>
          </MotionCard>
        ))}
      </motion.div>
    </div>
  );
};

export default AvailableQuestions;
