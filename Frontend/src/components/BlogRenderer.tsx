import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Import a Highlight.js theme
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";

// Define the type for a single blog section.
export interface BlogSection {
  section: string;
  text: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const BlogRenderer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId: number = Number(id);
  const blog = useSelector((state: RootState) => state.blogs.data[numericId]);

  // Fallback if blog is not found
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Blog not found.</p>
      </div>
    );
  }

  const heading: string = blog.title;
  const description: string = blog.description;
  const content: BlogSection[] = blog.content;

  return (
    <motion.article
      className="prose lg:prose-xl mx-auto p-8 font-serif"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header variants={itemVariants}>
        <motion.h1
          className="mb-4 text-5xl font-bold text-gray-900"
          variants={itemVariants}
        >
          {heading}
        </motion.h1>
        <motion.p
          className="italic text-lg text-gray-600 mb-6"
          variants={itemVariants}
        >
          {description}
        </motion.p>
      </motion.header>
      {content.map((item, index) => (
        <motion.section key={index} className="my-8" variants={itemVariants}>
          {item.section && (
            <motion.h2
              className="mb-2 text-3xl font-semibold text-gray-800"
              variants={itemVariants}
            >
              {item.section}
            </motion.h2>
          )}
          <motion.div variants={itemVariants}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {item.text}
            </ReactMarkdown>
          </motion.div>
        </motion.section>
      ))}
    </motion.article>
  );
};

export default BlogRenderer;
