// src/queue/runConsumer.ts
import Redis from "ioredis";
// import { runQuestion } from "../runner/runQuestion";
import { runCode } from "../controllers/runController";
import axios from "axios";
import { RunQuestionResponse } from "../types/global";

const redis = new Redis();

export async function listenRunQueue() {
  while (true) {
    try {
      const data = await redis.brpop("runQueue", 0); // blocks until item
      if (data) {
        const job = JSON.parse(data[1]);
        console.log("🔁 running Job:", job);

        const result = await runCode(job);
        const downstreamRes = await axios.post(
          `${process.env.SOCKET_SERVICE_API}/submission-update`,
          {
            userId: String(job.userId),
            data: {
              output: result.output,
              questionId: job.questionId,
              submissionId: job.submissionId,
              result: result.success,
              status: result.status,
              error: result.error,
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
        console.log("✅ run Result:", result);
      }
    } catch (err) {
      console.error("❌ Error in runQueue worker:", err);
    }
  }
}

listenRunQueue();
