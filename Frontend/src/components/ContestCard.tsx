import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface ContestCardProps {
  contest: {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  };
  userId: number;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, userId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/contests/register`,
        {
          userId,
          contestId: contest.id,
        }
      );
      toast.success("Successfully registered for contest!");
    } catch (error) {
      console.error("Error registering for contest:", error);
      toast.error("Failed to register for contest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{contest.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {contest.description}
      </p>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Start: {new Date(contest.startTime).toLocaleString()}</p>
          <p>End: {new Date(contest.endTime).toLocaleString()}</p>
        </div>
        <Button
          onClick={handleRegister}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContestCard;
