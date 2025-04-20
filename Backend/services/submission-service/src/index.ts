import express from "express";
import submitRouter from "./Routes/submitRoutes";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(express.json()); // used to convert body to json format, otherwise body will be undefined
app.use("/api/v1", submitRouter); // middleware not added now

app.listen(process.env.PORT, () => {
  console.log("Server started on Port: ", process.env.PORT);
});
