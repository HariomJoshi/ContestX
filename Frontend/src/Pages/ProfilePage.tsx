import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchContests } from "@/redux/slices/contestSlice";

interface ProfileData {
  name: string;
  username: string;
  email: string;
}

interface Submission {
  id: string;
  question: string;
  status: string;
  time: string;
}

interface Contest {
  id: string;
  name: string;
  participatedOn: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [ratings, setRatings] = useState<number[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = useSelector((state: RootState) => state.user.data.id);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/profile`,
          {
            params: {
              userId: userId,
            },
          }
        );
        const data = response.data;

        setProfile(data.profile);
        setRatings(data.ratings || []);
        setSubmissions(data.submissions || []);
        setContests(data.contests || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    // adding loader
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
        </CardContent>
      </Card>

      {/* Rating Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Rating Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <RatingGraph ratings={ratings} contests={contests} />
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
              {submissions.map((sub, index) => (
                <TableRow key={sub.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sub.question}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded ${
                        sub.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(sub.time).toLocaleString()}</TableCell>
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
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contests.map((contest, index) => (
                <TableRow key={contest.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{contest.name}</TableCell>
                  <TableCell>
                    {new Date(contest.participatedOn).toLocaleDateString()}
                  </TableCell>
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
