import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dummy rankings data (for a real app, this would be much larger)
const dummyRankings = [
  {
    id: "1",
    rank: 1,
    user: "Alice",
    solvedCount: 5,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:30 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:45 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:00 AM" },
    ],
  },
  {
    id: "2",
    rank: 2,
    user: "Bob",
    solvedCount: 4,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:40 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:05 AM" },
    ],
  },
  {
    id: "3",
    rank: 3,
    user: "Charlie",
    solvedCount: 3,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:10 AM" },
    ],
  },
  {
    id: "4",
    rank: 4,
    user: "Alice",
    solvedCount: 5,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:30 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:45 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:00 AM" },
    ],
  },
  {
    id: "5",
    rank: 5,
    user: "Bob",
    solvedCount: 4,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:40 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:05 AM" },
    ],
  },
  {
    id: "6",
    rank: 6,
    user: "Charlie",
    solvedCount: 3,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:10 AM" },
    ],
  },
  {
    id: "7",
    rank: 7,
    user: "Alice",
    solvedCount: 5,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:30 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:45 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:00 AM" },
    ],
  },
  {
    id: "8",
    rank: 8,
    user: "Bob",
    solvedCount: 4,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:40 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:05 AM" },
    ],
  },
  {
    id: "9",
    rank: 9,
    user: "Charlie",
    solvedCount: 3,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:10 AM" },
    ],
  },
  {
    id: "10",
    rank: 10,
    user: "Alice",
    solvedCount: 5,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:30 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:45 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:00 AM" },
    ],
  },
  {
    id: "11",
    rank: 11,
    user: "Bob",
    solvedCount: 4,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:40 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:05 AM" },
    ],
  },
  {
    id: "12",
    rank: 12,
    user: "Charlie",
    solvedCount: 3,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:10 AM" },
    ],
  },
  {
    id: "13",
    rank: 13,
    user: "Alice",
    solvedCount: 5,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:30 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:45 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:00 AM" },
    ],
  },
  {
    id: "14",
    rank: 14,
    user: "Bob",
    solvedCount: 4,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:40 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:05 AM" },
    ],
  },
  {
    id: "15",
    rank: 15,
    user: "Charlie",
    solvedCount: 3,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:10 AM" },
    ],
  },
  {
    id: "16",
    rank: 16,
    user: "Alice",
    solvedCount: 5,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:30 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:45 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:00 AM" },
    ],
  },
  {
    id: "17",
    rank: 17,
    user: "Bob",
    solvedCount: 4,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:40 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:05 AM" },
    ],
  },
  {
    id: "18",
    rank: 18,
    user: "Charlie",
    solvedCount: 3,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:10 AM" },
    ],
  },
  {
    id: "19",
    rank: 19,
    user: "Alice",
    solvedCount: 5,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:30 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:45 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:00 AM" },
    ],
  },
  {
    id: "20",
    rank: 20,
    user: "Bob",
    solvedCount: 4,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:40 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:05 AM" },
    ],
  },
  {
    id: "21",
    rank: 21,
    user: "Charlie",
    solvedCount: 3,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:10 AM" },
    ],
  },
  {
    id: "22",
    rank: 22,
    user: "Alice",
    solvedCount: 5,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:30 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:45 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:00 AM" },
    ],
  },
  {
    id: "23",
    rank: 23,
    user: "Bob",
    solvedCount: 4,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:40 AM" },
      { question: "Add Two Numbers", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:05 AM" },
    ],
  },
  {
    id: "24",
    rank: 24,
    user: "Charlie",
    solvedCount: 3,
    submissions: [
      { question: "Two Sum", time: "2025-03-24 10:50 AM" },
      { question: "Longest Substring", time: "2025-03-24 11:10 AM" },
    ],
  },
  // ... assume many more entries here
];
// dummy data: don't open it

// Setting page size to 10 for now
const PAGE_SIZE = 10;

const CurrentRankingsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dummyRankings.length / PAGE_SIZE);

  // Get the rankings for the current page
  const currentData = dummyRankings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Current Rankings</h1>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Solved</TableHead>
                <TableHead>Submissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.rank}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>{entry.solvedCount}</TableCell>
                  <TableCell>
                    {entry.submissions.map((sub, index) => (
                      <div key={index} className="mb-1">
                        <span className="font-medium">{sub.question}</span> -{" "}
                        <span className="text-sm text-muted-foreground">
                          {sub.time}
                        </span>
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentRankingsPage;
