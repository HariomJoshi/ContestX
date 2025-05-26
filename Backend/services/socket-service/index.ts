import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store connected clients
const connectedClients = new Map<string, string>();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle authentication
  socket.on("authenticate", (userId: string) => {
    connectedClients.set(userId, socket.id);
    console.log(`User ${userId} authenticated with socket ${socket.id}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove client from connected clients
    for (const [userId, socketId] of connectedClients.entries()) {
      if (socketId === socket.id) {
        connectedClients.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// API endpoint to receive submission updates from submission service
app.post("/api/submission-update", express.json(), (req, res) => {
  const { userId, submissionId, status, message } = req.body;

  // Get socket ID for the user
  const socketId = connectedClients.get(userId);

  if (socketId) {
    // Emit the update to the specific user
    io.to(socketId).emit("submission-update", {
      submissionId,
      status,
      message,
      timestamp: new Date().toISOString(),
    });
    res.status(200).json({ message: "Update sent successfully" });
  } else {
    res.status(404).json({ message: "User not connected" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const PORT = process.env.PORT || 3002;

httpServer.listen(PORT, () => {
  console.log(`Socket service running on port ${PORT}`);
});
