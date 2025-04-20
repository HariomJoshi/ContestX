import express from "express";
import authRouter from "./Routes/Auth";
import morgan from "morgan";
import dotenv from "dotenv";
const app = express();
dotenv.config();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", authRouter);

// Auth service will be used here
app.listen(process.env.PORT, () => {
  console.log("Server started on Port: ", process.env.PORT);
});
