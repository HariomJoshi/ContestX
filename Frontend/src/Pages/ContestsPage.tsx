import React from "react";
import { Contest } from "@/types";
import ContestComponent from "@/components/ContestComponent";
import { motion } from "framer-motion";

// Sample contests data
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
      startAt: new Date(Date.now() - 86400000).toISOString(),
      endsAt: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      id: "1",
      title: "Ongoing Coding Challenge",
      description: "Solve coding puzzles and win exciting prizes!",
      startAt: new Date(Date.now() - 86400000).toISOString(),
      endsAt: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      id: "1",
      title: "Ongoing Coding Challenge",
      description: "Solve coding puzzles and win exciting prizes!",
      startAt: new Date(Date.now() - 86400000).toISOString(),
      endsAt: new Date(Date.now() + 86400000).toISOString(),
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

  // Filter contests based on current time
  const ongoing = contests.filter(
    (contest) =>
      new Date(contest.startAt) <= now && new Date(contest.endsAt) >= now
  );
  const upcoming = contests.filter(
    (contest) => new Date(contest.startAt) > now
  );
  const past = contests.filter((contest) => new Date(contest.endsAt) < now);

  // Framer Motion variants for container and individual contest cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto p-4 space-y-10">
      {/* Ongoing Contests */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Ongoing Contests</h2>
        <motion.div
          className="flex flex-row overflow-x-auto space-x-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {ongoing.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No ongoing contests at the moment.
            </p>
          ) : (
            ongoing.map((contest, index) => (
              <motion.div
                key={`${contest.id}-${index}`}
                variants={cardVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <ContestComponent {...contest} />
              </motion.div>
            ))
          )}
        </motion.div>
      </section>

      {/* Upcoming Contests */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Contests</h2>
        <motion.div
          className="flex flex-row overflow-x-auto space-x-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {upcoming.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No upcoming contests at the moment.
            </p>
          ) : (
            upcoming.map((contest, index) => (
              <motion.div
                key={`${contest.id}-${index}`}
                variants={cardVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <ContestComponent {...contest} />
              </motion.div>
            ))
          )}
        </motion.div>
      </section>

      {/* Past Contests */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Past Contests</h2>
        <motion.div
          className="flex flex-row overflow-x-auto space-x-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {past.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No past contests available.
            </p>
          ) : (
            past.map((contest, index) => (
              <motion.div
                key={`${contest.id}-${index}`}
                variants={cardVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <ContestComponent {...contest} />
              </motion.div>
            ))
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default ContestsPage;
