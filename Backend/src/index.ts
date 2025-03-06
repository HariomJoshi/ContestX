import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./server.js";

const app = express();
dotenv.config();
app.use(cors());
app.use("/api/v1", router);

app.listen(process.env.PORT, () => {
  console.log("Server started on Port: ", process.env.PORT);
});
