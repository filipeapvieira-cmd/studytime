import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // Per 60 seconds
});

export const getRateLimit = async (key: string) => {
  try {
    await rateLimiter.consume(key);
    return true;
  } catch (error) {
    return false;
  }
};
