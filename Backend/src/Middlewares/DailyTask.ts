import cron from "node-cron";
import { PrismaClient, Prisma } from "@prisma/client";
import { generateBlog } from "../Helper/generateBlog.js";

export interface Blog {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  content: Prisma.InputJsonValue;
}

const pClient = new PrismaClient();
// Schedule a task to run every day at midnight (server time)
// The cron expression '0 0 * * *' means: minute 0, hour 0, every day.
// The cron expression '* * * * *' means: every miute.
export default cron.schedule("0 0 * * *", async () => {
  //   console.log("Running daily task at midnight");
  console.log("running every minute");

  //   const blog;
  try {
    const blog: Blog = await generateBlog("Z Algorithm");
    // console.log(blog);
    const entry = await pClient.blog.create({
      data: {
        title: blog.title,
        description: blog.description,
        date: blog.date,
        imageUrl: blog.imageUrl,
        content: blog.content,
      },
    });
    console.log("Entry created: ");
    console.log(entry);
  } catch (error) {
    console.error("Error in generating blogs: " + error);
  }

  // Place your code here. For example:
  // - Clean up your database
  // - Send out reminder emails
  // - Generate reports
  // Or any other daily task.
});

console.log("Generating Blogs");
