import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CSSProperties } from "react";

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

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

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
      <SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div">
        {code}
      </SyntaxHighlighter>
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
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {section.section}
          </ReactMarkdown>
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

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Blog not found.</p>
      </div>
    );
  }

  return (
    <motion.article
      className="prose lg:prose-xl mx-auto p-8 font-serif dark:prose-invert"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header variants={itemVariants}>
        <motion.h1
          className="mb-4 text-5xl font-bold text-gray-900 dark:text-white"
          variants={itemVariants}
        >
          {blog.title}
        </motion.h1>
        <motion.p
          className="italic text-lg text-gray-600 dark:text-gray-300 mb-6"
          variants={itemVariants}
        >
          {blog.description}
        </motion.p>
      </motion.header>
      <motion.div variants={itemVariants} className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            code({ node, inline, className, children, ...props }: CodeProps) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus as Record<string, CSSProperties>}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    {children}
                  </table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  {children}
                </td>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-300">
                  {children}
                </blockquote>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                  {children}
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
                  {children}
                </h3>
              );
            },
            p({ children }) {
              return (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {children}
                </p>
              );
            },
            ul({ children }) {
              return (
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  {children}
                </ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  {children}
                </ol>
              );
            },
            li({ children }) {
              return <li className="mb-2">{children}</li>;
            },
          }}
        >
          {blog.content}
        </ReactMarkdown>
      </motion.div>
    </motion.article>
  );
};

export default BlogRenderer;
