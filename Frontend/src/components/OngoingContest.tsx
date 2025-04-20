import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Loader2 } from "lucide-react";
import { Contest } from "@/Pages/ContestsPage";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface OngoingContestProps {
  contest: Contest;
  userId: number;
}

const OngoingContest: React.FC<OngoingContestProps> = ({ contest }) => {
  const navigate = useNavigate();
  const [contestEnded, setContestEnded] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(
    contest.isRegistered || false
  );

  const userId: Number = useSelector((state: RootState) => state.user.data.id);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(contest.end_time).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft("Contest Ended");
        setContestEnded(true);
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
  }, [contest.end_time]);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      // console.log(userId);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/contests/register`,
        {
          userId,
          contestId: contest.id,
        }
      );
      setIsRegistered(true);
      toast.success("Successfully registered for contest!");
    } catch (error) {
      console.error("Error registering for contest:", error);
      toast.error("Failed to register for contest");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToContest = () => {
    navigate(`/contest/${contest.id}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {contest.title || "Untitled Contest"}
            </h3>
            <p className="text-gray-600 mb-2">
              {contest.description || "No description available"}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Duration: {contest.duration} minutes</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Starts: {new Date(contest.start_time).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Ends: {new Date(contest.end_time).toLocaleString()}
            </div>
            <div className="text-sm font-medium text-red-600">{timeLeft}</div>
          </div>
        </div>
        <div className="flex justify-end">
          {!contestEnded && (
            <Button
              onClick={isRegistered ? handleGoToContest : handleRegister}
              disabled={isLoading || (isRegistered && contestEnded)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : isRegistered ? (
                "Go to Contest"
              ) : (
                "Register"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OngoingContest;
