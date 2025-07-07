import Redis from "ioredis";
// import { runQuestion } from "../helper/runQuestion";
//

const redis = new Redis();

async function listen() {
  while (true) {
    try {
      const data = await redis.brpop("submissionQueue", 0); // blocking pop
      if (data) {
        const submission = JSON.parse(data[1]);
        console.log("⚙️  Processing:", submission);

        // const result = await runQuestion(submission); // actual eval logic
        // running will de done by controller
        // You can send result back via WebSocket or store in DB
        // console.log("✅ Result:", result);
      }
    } catch (err) {
      console.error("❌ Worker error:", err);
    }
  }
}

listen();
