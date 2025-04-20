import express from "express";
import cors from "cors";
import authRouter from "./Routes/Auth";
import morgan from "morgan";
const app = express();

app.use(morgan("dev"));
// app.use(cors());
app.use(express.json());

app.use("/api/v1", authRouter);

// Auth service will be used here
app.listen(3001, () => {
  console.log("auth-service started at port 3001");
});
