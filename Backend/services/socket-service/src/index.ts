import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import WebSocket, { WebSocketServer } from "ws";
import submissionController from "../controllers/submissionController";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
export const clients = new Map<string, WebSocket>();

// post all the data to the submission controller, in order to send it to the client
app.post("/submission-update", submissionController);

const server = app.listen(process.env.PORT, () => {
  console.log("Listening to port " + process.env.PORT);
});

const wss: WebSocketServer = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");
  console.log("Client count:", wss.clients.size);

  ws.on("error", (err) => {
    console.log(err);
  });
  let userId: string;
  // First message from the client should be to register its userId
  ws.on("message", (data, isBinary) => {
    let messageStr: string;
    // parse the incoming message
    // data can be a string, Buffer, ArrayBuffer, or an array of Buffers
    // we will convert it to a string
    if (typeof data === "string") {
      messageStr = data;
    } else if (data instanceof Buffer) {
      messageStr = data.toString();
    } else if (data instanceof ArrayBuffer) {
      messageStr = Buffer.from(data).toString();
    } else if (Array.isArray(data)) {
      messageStr = Buffer.concat(data).toString();
    } else {
      throw new Error("Unsupported message type");
    }

    // parsing completed, now we can handle the message

    try {
      const parsed = JSON.parse(messageStr);
      if (parsed.type === "register") {
        // First message: client sends its userId
        userId = parsed.userId;
        clients.set(String(userId), ws);
        // console.log(clients);
        console.log(`✅ Registered client: ${userId}`);
      } else if (parsed.type === "private-message") {
        // just for example, handle private messages
        const { toUserId, content } = parsed;
        const recipient = clients.get(toUserId);
        if (recipient && recipient.readyState === WebSocket.OPEN) {
          recipient.send(JSON.stringify({ from: userId, content }));
        }
      } else {
        // handle other messages (e.g., broadcast)
        console.log("Logic is not supposed to be here, but received:", parsed);
      }
    } catch (err) {
      console.error("Invalid message:", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    console.log("Client count:", wss.clients.size);
    if (userId) {
      clients.delete(userId);
      console.log(`⛔ Client disconnected: ${userId}`);
    }
  });
  ws.send("Hello!, Message from the server");
});
