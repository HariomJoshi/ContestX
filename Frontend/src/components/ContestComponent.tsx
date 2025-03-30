import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Contest } from "@/types";

const ContestComponent = (contest: Contest) => {
  const navigate = useNavigate();
  const now = new Date();
  const start = new Date(contest.startAt);
  const end = new Date(contest.endsAt);
  let statusLabel = "";
  if (start <= now && end >= now) {
    statusLabel = "Ongoing";
  } else if (start > now) {
    statusLabel = "Upcoming";
  } else {
    statusLabel = "Past";
  }

  return (
    <Card key={contest.id} className="min-w-md max-w-md mx-auto mb-4 mx-2">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">{contest.title}</CardTitle>
        <Badge variant="secondary">{statusLabel}</Badge>
      </CardHeader>
      <CardContent>
        <p>{contest.description}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {start.toLocaleString()} - {end.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">Register</Button>
        <Button
          variant="secondary"
          onClick={() => navigate(`/rankings/${contest.id}`)}
        >
          See Rankings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContestComponent;
