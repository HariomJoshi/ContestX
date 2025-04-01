import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Import a Highlight.js theme
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

// Define the type for a single blog section.
export interface BlogSection {
  section: string;
  text: string;
  code?: string;
  language?: string;
  subsections?: SubsectionBlogContent[];
}

export interface SubsectionBlogContent {
  subsection: string;
  text: string;
  code?: string;
  language?: string;
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

// Component to render code using Monaco Editor
const CodeRenderer: React.FC<{ code: string; language?: string }> = ({
  code,
  language = "python",
}) => {
  return (
    <motion.div
      className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      variants={itemVariants}
    >
      <Editor
        height="400px"
        defaultLanguage={language}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
          },
        }}
      />
    </motion.div>
  );
};

// Component to render a single section with its subsections
const BlogSectionRenderer: React.FC<{
  section: BlogSection;
}> = ({ section }) => {
  return (
    <motion.section className="my-8" variants={itemVariants}>
      {section.section && (
        <motion.h2
          className="mb-2 text-3xl font-semibold text-gray-800"
          variants={itemVariants}
        >
          {section.section}
        </motion.h2>
      )}
      <motion.div variants={itemVariants}>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {section.text}
        </ReactMarkdown>
      </motion.div>
      {section.code && (
        <CodeRenderer code={section.code} language={section.language} />
      )}
      {section.subsections && section.subsections.length > 0 && (
        <div className="ml-6 mt-4">
          {section.subsections.map((subsection, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.h3
                className="mb-2 text-2xl font-semibold text-gray-800"
                variants={itemVariants}
              >
                {subsection.subsection}
              </motion.h3>
              <motion.div variants={itemVariants}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {subsection.text}
                </ReactMarkdown>
              </motion.div>
              {subsection.code && (
                <CodeRenderer
                  code={subsection.code}
                  language={subsection.language}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

const BlogRenderer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  let numericId: number = Number(id);
  numericId -= 1;

  const allBlogs = useSelector((state: RootState) => state.blogs.data);
  const blog = allBlogs[numericId];
  console.log(allBlogs);
  console.log(blog);

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
      {Array.isArray(content) &&
        content.map((item, index) => (
          <BlogSectionRenderer key={index} section={item} />
        ))}
    </motion.article>
  );
};

export default BlogRenderer;
