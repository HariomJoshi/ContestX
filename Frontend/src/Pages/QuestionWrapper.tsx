import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import SolveQuestion, { Question } from "./SolveQuestion";
const QuestionWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [id]);

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
    <div className="w-full h-full">
      <SolveQuestion question={question} />
    </div>
  );
};

export default QuestionWrapper;
