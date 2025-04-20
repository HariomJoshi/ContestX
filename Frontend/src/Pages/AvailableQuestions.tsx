import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Motion-wrapped components
const MotionCard = motion(Card);
const MotionButton = motion(Button);

interface Question {
  id: number;
  title: string;
  description: string;
  testCases: string;
  tags: string[];
}

const AvailableQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;

  const fetchQuestions = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/user/questions?page=${pageNum}&limit=${ITEMS_PER_PAGE}`
      );

      const newQuestions = response.data;
      setQuestions((prev) =>
        pageNum === 1 ? newQuestions : [...prev, ...newQuestions]
      );
      setHasMore(newQuestions.length === ITEMS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(1);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchQuestions(page + 1);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setHasMore(true);
    fetchQuestions(1);
  };

  const handleSolveQuestion = (id: number) => {
    navigate(`/questions/${id}`);
  };

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search questions..."
          className="w-full"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Questions List */}
      <motion.div
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredQuestions.map((question) => (
          <MotionCard
            key={question.id}
            className="p-4 relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {question.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <Badge key={tag} className="bg-blue-100 text-blue-800">
                  {tag}
                </Badge>
              ))}
            </div>
            <MotionButton
              onClick={() => handleSolveQuestion(question.id)}
              className="absolute bottom-4 right-4 w-1/5"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Solve Question
            </MotionButton>
          </MotionCard>
        ))}
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleLoadMore} variant="outline" className="w-1/4">
            Load More
          </Button>
        </div>
      )}

      {/* No More Questions */}
      {!loading && !hasMore && questions.length > 0 && (
        <div className="text-center text-gray-500 mt-4">
          No more questions to load
        </div>
      )}
    </div>
  );
};

export default AvailableQuestions;
