import { Request, Response } from "express";
import { SubmissionUpdate } from "../types/global"; // Assuming you have a types file for SubmissionUpdate
import { clients } from "../src/index"; // Import the clients map from your main server file
// node imports reference, not the copy, so we wll have all the clients
import WebSocket from "ws";
const submissionController = (req: Request, res: Response) => {
  // expected body: { userId: "...", data: { …SubmissionUpdate } }
  const { userId, data } = req.body as {
    userId: string;
    data: SubmissionUpdate;
  };

  if (!userId || !data) {
    return res.status(400).json({ error: "userId and data required" });
  }
  const recipient: WebSocket | undefined = clients.get(userId);
  if (recipient?.readyState === WebSocket.OPEN) {
    recipient.send(JSON.stringify({ type: "submission-update", data }));
    console.log(`🚀 Sent submission‑update to ${userId}`);
    return res.sendStatus(200);
  }

  console.warn(`No WS client for ${userId}`);
  // Decide whether to queue, store, or just return 202
  return res.status(202).json({ queued: true });
};

export default submissionController;
