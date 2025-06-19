// wsManager.ts
import axios from "axios";
import { RunQuestionResponse } from "../types/global";

const WS_SERVICE_URL = "http://localhost:3005/send";

export async function sendResultToClient(
  userId: string,
  result: RunQuestionResponse | undefined
) {
  try {
    await axios.post(WS_SERVICE_URL, {
      userId,
      result,
    });
    console.log(`Result sent to WebSocket service for user ${userId}`);
  } catch (error: any) {
    console.error(`Failed to send result to WebSocket service:`, error.message);
  }
}
