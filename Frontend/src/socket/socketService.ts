import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface SubmissionUpdate {
  submissionId: string;
  status: string;
  message: string;
  timestamp: string;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  lastSubmissionTime: Date;
  totalSubmissions: number;
  solvedProblems: Set<string>;
}

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private submissionCallbacks: Map<string, (update: SubmissionUpdate) => void> =
    new Map();
  private leaderboardCallbacks: Map<
    string,
    (entries: LeaderboardEntry[]) => void
  > = new Map();

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initializeSocket(userId: string): void {
    if (this.socket) {
      console.log("Socket already initialized");
      return;
    }

    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3002";
    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupSocketListeners();
    this.authenticate(userId);
  }

  private authenticate(userId: string): void {
    if (!this.socket) return;
    this.socket.emit("authenticate", userId);
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
      this.isConnected = false;
      toast.error("Connection lost. Attempting to reconnect...");
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
      toast.error("Failed to connect to server");
    });

    this.socket.on("reconnect", (attemptNumber: number) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      toast.success("Reconnected to server");
    });

    this.socket.on("reconnect_error", (error: Error) => {
      console.error("Socket reconnection error:", error);
      toast.error("Failed to reconnect to server");
    });

    // Handle submission updates
    this.socket.on("submission-update", (update: SubmissionUpdate) => {
      const callback = this.submissionCallbacks.get(update.submissionId);
      if (callback) {
        callback(update);
      }
    });

    // Handle leaderboard updates
    this.socket.on("leaderboard-update", (entries: LeaderboardEntry[]) => {
      this.leaderboardCallbacks.forEach((callback) => {
        callback(entries);
      });
    });
  }

  public subscribeToSubmission(
    submissionId: string,
    callback: (update: SubmissionUpdate) => void
  ): void {
    this.submissionCallbacks.set(submissionId, callback);
  }

  public unsubscribeFromSubmission(submissionId: string): void {
    this.submissionCallbacks.delete(submissionId);
  }

  public subscribeToLeaderboard(
    contestId: string,
    callback: (entries: LeaderboardEntry[]) => void
  ): void {
    if (!this.socket) return;

    this.leaderboardCallbacks.set(contestId, callback);
    this.socket.emit("subscribe-leaderboard", contestId);
  }

  public unsubscribeFromLeaderboard(contestId: string): void {
    if (!this.socket) return;

    this.leaderboardCallbacks.delete(contestId);
    this.socket.emit("unsubscribe-leaderboard", contestId);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.submissionCallbacks.clear();
      this.leaderboardCallbacks.clear();
    }
  }
}

export default SocketService;
