// server.ts
import { redis } from "./redisClient.js";
import { runQuestion } from "../helper/runQuestion.js";
import { sendResultToClient } from "../helper/wsManager.js";
import {
  Submission,
  Judge0Result,
  RunQuestionResponse,
} from "../types/global.js";

const QUEUE_NAME = "submission_queue";

async function processQueue() {
  while (true) {
    const data = await redis.brpop(QUEUE_NAME, 0);
    // Blocking , so blocks till we have data
    // RPOP , so we have to LPUSH in the submission service
    if (!data) continue;

    try {
      const submission: Submission = JSON.parse(data[1]);
      console.log(`Processing submission: ${submission.id}`);

      const result: RunQuestionResponse | undefined = await runQuestion(
        submission
      );
      sendResultToClient(submission.id, result);
    } catch (err) {
      console.error("Failed to process submission:", err);
    }
  }
}

processQueue();
