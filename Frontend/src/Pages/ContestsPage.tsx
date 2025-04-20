import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import OngoingContest from "@/components/OngoingContest";

export interface Contest {
  id: number;
  duration: number;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
  contestQuestions: {
    question: {
      id: number;
      title: string;
      description: string;
      testCases: string;
      constraints: string;
      tags: string[];
    };
  }[];
  isRegistered?: boolean;
}

const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/contests`
        );
        setContests(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching contests:", error);
        toast.error("Failed to fetch contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getContestStatus = (contest: Contest) => {
    const now = new Date().getTime();
    const startTime = new Date(contest.start_time).getTime();
    const endTime = new Date(contest.end_time).getTime();

    if (now < startTime) return "upcoming";
    if (now >= startTime && now <= endTime) return "ongoing";
    return "past";
  };

  const upcomingContests = contests.filter(
    (contest) => getContestStatus(contest) === "upcoming"
  );
  const ongoingContests = contests.filter(
    (contest) => getContestStatus(contest) === "ongoing"
  );
  const pastContests = contests.filter(
    (contest) => getContestStatus(contest) === "past"
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Contests</h1>
      <Tabs defaultValue="ongoing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingContests.length === 0 ? (
            <p className="text-gray-500">No upcoming contests</p>
          ) : (
            upcomingContests.map((contest) => (
              <OngoingContest key={contest.id} contest={contest} />
            ))
          )}
        </TabsContent>

        <TabsContent value="ongoing" className="space-y-4">
          {ongoingContests.length === 0 ? (
            <p className="text-gray-500">No ongoing contests</p>
          ) : (
            ongoingContests.map((contest) => (
              <OngoingContest key={contest.id} contest={contest} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastContests.length === 0 ? (
            <p className="text-gray-500">No past contests</p>
          ) : (
            pastContests.map((contest) => (
              <OngoingContest key={contest.id} contest={contest} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContestsPage;
