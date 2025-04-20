import express from "express";
import submitRouter from "./Routes/submitRoutes";

const app = express();

app.use(express.json()); // used to convert body to json format, otherwise body will be undefined
app.use("/api/v1", submitRouter); // middleware not added now

app.listen(3002, () => {
  console.log("submission-service started at port 3002");
});
