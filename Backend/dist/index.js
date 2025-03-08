import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./Auth/login.js";
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", router);
app.listen(process.env.PORT, () => {
    console.log("Server started on Port: ", process.env.PORT);
});
