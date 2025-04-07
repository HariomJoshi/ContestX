import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Contest } from "@/Pages/ContestsPage";

interface OngoingContestProps {
  contest: Contest;
}

const OngoingContest: React.FC<OngoingContestProps> = ({ contest }) => {
  const navigate = useNavigate();
  const [contestEnded, setContestEnded] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

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
              onClick={() => navigate(`/contest/${contest.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {contest.isRegistered ? "Go to Contest" : "Register"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OngoingContest;
