import Redis from "ioredis";
const redis = new Redis(); // default => localhost:6379

export const pushSubmission = async (data: any) => {
  await redis.lpush("submissionQueue", JSON.stringify(data));
};

export const pushRun = async (data: any) => {
  await redis.lpush("runQueue", JSON.stringify(data));
};
