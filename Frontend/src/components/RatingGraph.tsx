import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RatingGraphProps {
  ratings: number[];
  contests: { participatedOn: string }[];
}

const RatingGraph: React.FC<RatingGraphProps> = ({ ratings, contests }) => {
  // Merge the two arrays into one data array.
  // It assumes both arrays have the same length.
  const data = ratings.map((r, index) => ({
    date: contests[index].participatedOn,
    rating: r,
  }));

  return (
    <ResponsiveContainer width="100%" height={256}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RatingGraph;
