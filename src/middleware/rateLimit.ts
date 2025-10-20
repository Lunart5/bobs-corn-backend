import type { Request, Response, NextFunction } from "express";
import redisClient, { isRedisAvailable } from "../redis/client";
import { secondsToMs } from "../utils";

const req_time_limit_seconds = 60;
const req_time_limit = secondsToMs(req_time_limit_seconds);
const local_memory_time_limit = secondsToMs(req_time_limit_seconds * 2);

const localMemoryStore = new Map<string, number>();

const cleanupInMemoryStore = () => {
  const now = Date.now();

  for (const [key, timestamp] of localMemoryStore.entries()) {
    if (now - timestamp > req_time_limit) {
      localMemoryStore.delete(key);
    }
  }
};

setInterval(cleanupInMemoryStore, local_memory_time_limit);

const attempsMessage = (retryAfter: number) => ({
  error: "Too many requests",
  message: "You can only make 1 purchase per minute",
  retryAfter,
});

const getRemainingTime = (timeDifference: number) =>
  Math.ceil((req_time_limit - timeDifference) / 1000);

export const salesRateLimiter = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  const now = Date.now();

  const userId = res.locals.user.id;
  const redisKey = `sale:ratelimit:user:${userId}`;

  const handleSaveOnRedis = async () => {
    const lastSaleTime = await redisClient.get(redisKey);

    if (lastSaleTime) {
      const timeDifference = now - Number.parseInt(lastSaleTime);
      if (timeDifference < req_time_limit) {
        const remainingTime = getRemainingTime(timeDifference);
        return res.status(429).json(attempsMessage(remainingTime));
      }
    }

    await redisClient.set(
      redisKey,
      now.toString(),
      "EX",
      req_time_limit_seconds,
    );
    next();
  };

  const hadleSaveLocal = () => {
    const lastSaleTime = localMemoryStore.get(redisKey);

    if (lastSaleTime) {
      const timeDifference = now - lastSaleTime;

      if (timeDifference < req_time_limit) {
        const remainingTime = getRemainingTime(timeDifference);
        return res.status(429).json(attempsMessage(remainingTime));
      }
    }

    localMemoryStore.set(redisKey, now);
    next();
  };

  try {
    if (isRedisAvailable()) {
      await handleSaveOnRedis();
    } else {
      hadleSaveLocal();
    }
  } catch (error) {
    const lastSaleTime = localMemoryStore.get(redisKey);

    if (lastSaleTime) {
      const timeDifference = now - lastSaleTime;

      if (timeDifference < req_time_limit) {
        const remainingTime = getRemainingTime(timeDifference);

        return res.status(429).json(attempsMessage(remainingTime));
      }
    }

    localMemoryStore.set(redisKey, now);
    next();
  }
};
