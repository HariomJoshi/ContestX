import express, { NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./Auth/login.js";
import errorHandler from "./Middlewares/ErrorHandler.js";
import authorize from "./Middlewares/Auth.js";
import getUserRouter from "./Controllers/GetUser.js";
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

// global error handler must be declared after all the route declarations , as express processes middlewares sequentially
app.use(errorHandler);

const client = new Client({
  connectionString: process.env.DATABSE_URL,
});
client.connect(() => {
  console.log("Connected to DB");
});
app.listen(process.env.PORT, () => {
  console.log("Server started on Port: ", process.env.PORT);
});
