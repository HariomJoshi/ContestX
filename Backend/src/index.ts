import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./Auth/login.js";
import errorHandler from "./Middlewares/ErrorHandler.js";
import getUserRouter from "./Controllers/GetUser.js";
import blogRouter from "./Controllers/GetBlogs.js";
import "./Middlewares/DailyTask.js"; // Import the scheduler
// The scheduler will run independently once imported.
import pkg from "pg";
import morgan from "morgan";
const { Client } = pkg;

const app = express();
dotenv.config();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/getUser", getUserRouter);
app.use("/api/v1/getBlogs", blogRouter);
app.use(errorHandler);

const client = new Client({
  connectionString: process.env.DATABASE_URL, // corrected typo
});
client.connect(() => {
  console.log("Connected to DB");
});
app.listen(process.env.PORT, () => {
  console.log("Server started on Port:", process.env.PORT);
});
