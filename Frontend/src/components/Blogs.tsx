// src/Pages/HomePage.tsx
import React from "react";

interface Blog {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

// Dummy data for demonstration
const latestBlog: Blog = {
  id: 1,
  title: "Latest Blog Title",
  description:
    "This is the latest blog description. It is concise and informative.",
  date: "2024-12-01",
  imageUrl: "https://via.placeholder.com/800x400",
};

const oldBlogs: Blog[] = [
  {
    id: 2,
    title: "Old Blog 1",
    description: "Description for old blog 1.",
    date: "2024-11-01",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    id: 3,
    title: "Old Blog 2",
    description: "Description for old blog 2.",
    date: "2024-10-15",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    id: 4,
    title: "Old Blog 3",
    description: "Description for old blog 3.",
    date: "2024-09-20",
    imageUrl: "https://via.placeholder.com/400x200",
  },
  {
    id: 5,
    title: "Old Blog 4",
    description: "Description for old blog 4.",
    date: "2024-08-30",
    imageUrl: "https://via.placeholder.com/400x200",
  },
];

const Blogs: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Latest Blog Section */}
      <section className="p-6">
        <h2 className="text-3xl font-bold mb-4">Latest Blog</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src={latestBlog.imageUrl}
            alt={latestBlog.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="text-2xl font-semibold">{latestBlog.title}</h3>
            <p className="text-gray-600 text-sm">{latestBlog.date}</p>
            <p className="mt-2 text-gray-800">{latestBlog.description}</p>
          </div>
        </div>
      </section>

      {/* Old Blogs Section */}
      <section className="p-6">
        <h2 className="text-3xl font-bold mb-4">Old Blogs</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {oldBlogs.map((blog) => (
            <div
              key={blog.id}
              className="min-w-[250px] bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="text-gray-600 text-sm">{blog.date}</p>
                <p className="mt-2 text-gray-800">{blog.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="mt-auto bg-gray-800 text-white py-4 text-center">
        <p className="text-lg font-semibold">ContestX</p>
      </footer>
    </div>
  );
};

export default Blogs;
