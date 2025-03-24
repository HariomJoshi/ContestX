import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RatingGraph from "@/components/RatingGraph";

// Dummy data – replace these with dynamic data from your API or store.
const dummyProfile = {
  name: "Alice Johnson",
  username: "alice_j",
};

const dummyRatingData = [0, 735, 1300, 1415];

const dummySubmissions = [
  {
    id: "s1",
    question: "Two Sum",
    status: "Accepted",
    time: "2025-03-24 10:30 AM",
  },
  {
    id: "s2",
    question: "Longest Substring",
    status: "Wrong Answer",
    time: "2025-03-24 11:00 AM",
  },
  {
    id: "s3",
    question: "Add Two Numbers",
    status: "Accepted",
    time: "2025-03-24 11:30 AM",
  },
];

const dummyContests = [
  {
    id: "c1",
    name: "Weekly Contest 1",
    rank: 15,
    participatedOn: "2025-03-23",
  },
  { id: "c2", name: "Monthly Contest", rank: 5, participatedOn: "2025-04-20" },
  { id: "c3", name: "Biweekly Contest", rank: 5, participatedOn: "2025-04-25" },
  { id: "c4", name: "Biweekly Contest", rank: 5, participatedOn: "2025-05-10" },
];

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {dummyProfile.name}
          </p>
          <p>
            <strong>Username:</strong> {dummyProfile.username}
          </p>
        </CardContent>
      </Card>

      {/* Rating Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Rating Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <RatingGraph ratings={dummyRatingData} contests={dummyContests} />
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummySubmissions.map((sub, index) => (
                <TableRow key={sub.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sub.question}</TableCell>
                  <TableCell>{sub.status}</TableCell>
                  <TableCell>{sub.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Contests Participated */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Contests Participated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Contest Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyContests.map((contest, index) => (
                <TableRow key={contest.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{contest.name}</TableCell>
                  <TableCell>{contest.rank}</TableCell>
                  <TableCell>{contest.participatedOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
