// src/queue/runConsumer.ts
import Redis from "ioredis";
// import { runQuestion } from "../runner/runQuestion";
import { runCode } from "../controllers/runController";
import { submitCode } from "../controllers/submitController";
import axios from "axios";
import { RunQuestionResponse } from "../types/global";

const redis = new Redis();

export async function listenSubmitQueue() {
  while (true) {
    try {
      const data = await redis.brpop("submissionQueue", 0); // blocks until item
      if (data) {
        const job = JSON.parse(data[1]);
        console.log("🔁 submitting Job:", job);

        const result = await submitCode(job);
        const downstreamRes = await axios.post(
          `${process.env.SOCKET_SERVICE_API}/submission-update`,
          {
            userId: String(job.userId),
            data: {
              output: result?.output,
              questionId: job.questionId,
              submissionId: job.submissionId,
              result: result?.success,
              status: result?.status,
              error: result?.error,
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );

        // Relay status code and JSON payload back to client
        console.log(
          "🔁 runCode response status:",
          downstreamRes.status,
          downstreamRes.data
        );
        console.log("✅ submission Result:", result);
      }
    } catch (err) {
      console.error("❌ Error in submissionQueue worker:", err);
    }
  }
}

listenSubmitQueue();
