import React from "react";
import { Contest } from "@/types";
import ContestComponent from "@/components/ContestComponent";
// Import shadcn/ui components (ensure these paths match your project structure)

const ContestsPage: React.FC = () => {
  const contests: Contest[] = [
    {
      id: "1",
      title: "Ongoing Coding Challenge",
      description: "Solve coding puzzles and win exciting prizes!",
      startAt: new Date(Date.now() - 86400000).toISOString(), // started 1 day ago
      endsAt: new Date(Date.now() + 86400000).toISOString(), // ends in 1 day
    },
    {
      id: "1",
      title: "Ongoing Coding Challenge",
      description: "Solve coding puzzles and win exciting prizes!",
      startAt: new Date(Date.now() - 86400000).toISOString(), // started 1 day ago
      endsAt: new Date(Date.now() + 86400000).toISOString(), // ends in 1 day
    },

    {
      id: "1",
      title: "Ongoing Coding Challenge",
      description: "Solve coding puzzles and win exciting prizes!",
      startAt: new Date(Date.now() - 86400000).toISOString(), // started 1 day ago
      endsAt: new Date(Date.now() + 86400000).toISOString(), // ends in 1 day
    },
    {
      id: "1",
      title: "Ongoing Coding Challenge",
      description: "Solve coding puzzles and win exciting prizes!",
      startAt: new Date(Date.now() - 86400000).toISOString(), // started 1 day ago
      endsAt: new Date(Date.now() + 86400000).toISOString(), // ends in 1 day
    },
    {
      id: "2",
      title: "Upcoming Design Contest",
      description: "Show off your design skills in our upcoming contest.",
      startAt: new Date(Date.now() + 86400000 * 2).toISOString(), // starts in 2 days
      endsAt: new Date(Date.now() + 86400000 * 3).toISOString(), // ends in 3 days
    },
    {
      id: "3",
      title: "Past Math Olympiad",
      description: "A challenging contest for math enthusiasts.",
      startAt: new Date(Date.now() - 86400000 * 3).toISOString(), // started 3 days ago
      endsAt: new Date(Date.now() - 86400000 * 2).toISOString(), // ended 2 days ago
    },
  ];

  const now = new Date();

  // Filter contests based on the current time
  const ongoing = contests.filter(
    (contest) =>
      new Date(contest.startAt) <= now && new Date(contest.endsAt) >= now
  );
  const upcoming = contests.filter(
    (contest) => new Date(contest.startAt) > now
  );
  const past = contests.filter((contest) => new Date(contest.endsAt) < now);

  // Render a contest card with a dynamic badge

  return (
    <div className="container mx-auto p-4 space-y-10">
      <h2 className="text-2xl font-bold mb-4">Ongoing Contests</h2>
      <section className="flex flex-row overflow-x-auto space-x-4">
        {ongoing.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No ongoing contests at the moment.
          </p>
        ) : (
          ongoing.map(ContestComponent)
        )}
      </section>
      <h2 className="text-2xl font-bold mb-4">Upcoming Contests</h2>
      <section className="flex flex-row overflow-x-auto space-x-4">
        {upcoming.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No upcoming contests at the moment.
          </p>
        ) : (
          upcoming.map(ContestComponent)
        )}
      </section>
      <h2 className="text-2xl font-bold mb-4">Past Contests</h2>
      <section className="flex flex-row overflow-x-auto space-x-4">
        {past.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No past contests available.
          </p>
        ) : (
          past.map(ContestComponent)
        )}
      </section>
    </div>
  );
};

export default ContestsPage;
