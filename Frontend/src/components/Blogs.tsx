// src/Pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FetchState } from "@/helper";
import { fetchBlogs } from "@/redux/slices/blogsSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Blog {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

// Variants for container and cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Blogs: React.FC = () => {
  const fetchingBlogs = useSelector((state: RootState) => state.blogs.status);
  const dispatch = useDispatch<AppDispatch>();
  const blogs = useSelector((state: RootState) => state.blogs.data);
  // console.log(blogs);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Change to 12 if needed

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Handler for navigating to blog detail page
  const handleClick = (blogId: number) => {
    navigate(`/blog/${blogId}`);
  };

  // Calculate pagination details
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      {fetchingBlogs === FetchState.loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex flex-col">
          <section className="p-6 flex-1">
            <h2 className="text-3xl font-bold mb-4">Blogs</h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentBlogs.map((blog: Blog) => (
                <motion.div
                  key={blog.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer p-4 flex flex-col justify-between"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  onClick={() => handleClick(blog.id)}
                >
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{blog.date}</p>
                  <p className="text-gray-800">{blog.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center space-x-4 p-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded bg-blue-500 text-white ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Prev
            </motion.button>
            <span className="text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded bg-blue-500 text-white ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
};

export default Blogs;
