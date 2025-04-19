import express from "express";
import cors from "cors";
import authRouter from "./Routes/Auth";
import pkg from "pg";
import morgan from "morgan";
const app = express();
const { Client } = pkg;

app.use(morgan("dev"));
// app.use(cors());
app.use(express.json());

app.use("/api/v1", authRouter);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect(() => {
  console.log("Connected to DB => auth-service");
});

// Auth service will be used here
app.listen(3001, () => {
  console.log("auth-service started at port 3001");
});
