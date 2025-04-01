import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import SolveQuestion from "./SolveQuestion";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Contest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  questions: {
    id: number;
    title: string;
    difficulty: string;
  }[];
}

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

const ContestArea: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const [contest, setContest] = useState<Contest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/contests/${contestId}`
        );
        setContest(response.data);
        if (response.data.questions.length > 0) {
          fetchQuestion(response.data.questions[0].id);
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
        toast.error("Failed to fetch contest");
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  const fetchQuestion = async (questionId: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/questions/${questionId}`
      );
      setCurrentQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question:", error);
      toast.error("Failed to fetch question");
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setShowTabWarning(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleQuestionChange = (index: number) => {
    if (!contest) return;
    setCurrentQuestionIndex(index);
    fetchQuestion(contest.questions[index].id);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!contest || !currentQuestion) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">
          Contest or Question not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{contest.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-4 h-4" />
                <span>Time Remaining: 2:30:00</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Tab Switches: {tabSwitches}/3</Badge>
            <Button variant="destructive" onClick={() => navigate("/contests")}>
              Exit Contest
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } border-r transition-all duration-300 overflow-hidden`}
        >
          <div className="p-4 space-y-2">
            <h2 className="font-semibold mb-4">Questions</h2>
            {contest.questions.map((question, index) => (
              <Button
                key={question.id}
                variant={currentQuestionIndex === index ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleQuestionChange(index)}
              >
                <span className="mr-2">{index + 1}.</span>
                {question.title}
                <Badge variant="secondary" className="ml-auto">
                  {question.difficulty}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <SolveQuestion question={currentQuestion} />
        </div>
      </div>

      {/* Tab Switch Warning */}
      <AlertDialog open={showTabWarning} onOpenChange={setShowTabWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning: Tab Switch Detected</AlertDialogTitle>
            <AlertDialogDescription>
              You have switched tabs {tabSwitches} times. After 3 tab switches,
              you will be disqualified from the contest.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContestArea;
