import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import SolveQuestion from "./SolveQuestion";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "./SolveQuestion";
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

export interface Contest {
  id: number;
  title: string;
  description: string;
  duration: number;
  start_time: string;
  end_time: string;
  contestQuestions: {
    question: Question;
  }[];
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
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/contests/${contestId}`
        );
        setContest(response.data);
        if (response.data.contestQuestions.length > 0) {
          setCurrentQuestion(response.data.contestQuestions[0].question);
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

  useEffect(() => {
    if (!contest) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(contest.end_time).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft("Contest Ended");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [contest]);

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
    setCurrentQuestion(contest.contestQuestions[index].question);
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
            <motion.div
              initial={false}
              animate={{ rotate: isSidebarOpen ? 0 : 180 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">{contest.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-4 h-4" />
                <span>Time Remaining: {timeLeft}</span>
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question List Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: 256,
                opacity: 1,
                transition: {
                  width: { duration: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.2, delay: 0.1 },
                },
              }}
              exit={{
                width: 0,
                opacity: 0,
                transition: {
                  width: { duration: 0.3, ease: "easeIn" },
                  opacity: { duration: 0.2 },
                },
              }}
              className="border-r overflow-hidden"
            >
              <div className="w-64 p-4">
                <h2 className="font-semibold mb-4">Questions</h2>
                <div className="space-y-2">
                  {contest.contestQuestions.map((q, index) => (
                    <motion.div
                      key={q.question.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      <Button
                        variant={
                          currentQuestionIndex === index ? "default" : "ghost"
                        }
                        className="w-full justify-start transition-all"
                        onClick={() => handleQuestionChange(index)}
                      >
                        <span className="truncate">
                          {index + 1}. {q.question.title}
                        </span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Content */}
        <motion.div
          className="flex-1 p-6"
          animate={{
            paddingLeft: isSidebarOpen ? "1.5rem" : "2.5rem",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {currentQuestion && (
            <SolveQuestion question={currentQuestion} contestId={contest.id} />
          )}
        </motion.div>
      </div>

      {/* Tab Warning Dialog */}
      <AlertDialog open={showTabWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning: Tab Switching</AlertDialogTitle>
            <AlertDialogDescription>
              You have switched tabs 3 times. This may be considered as
              cheating. Further tab switches may result in disqualification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowTabWarning(false)}>
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContestArea;
