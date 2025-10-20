import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number.parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => {
    if (times > 10) {
      return null;
    }
    const delay = 2000;
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
};

export const redisClient = new Redis(redisConfig);

let isRedisConnected = false;

redisClient.on("connect", () => {
  console.log("Connecting a Redis...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis is ready");
  isRedisConnected = true;
});

redisClient.on("error", (err) => {
  console.error("Error connecting to redis:", err.message);
  isRedisConnected = false;
});

redisClient.on("close", () => {
  console.log("Conection closed");
  isRedisConnected = false;
});

redisClient.on("reconnecting", () => {
  console.log("Reconnection to redis...");
});

export const isRedisAvailable = (): boolean => {
  return isRedisConnected && redisClient.status === "ready";
};

export const connectRedis = async (): Promise<boolean> => {
  try {
    await redisClient.connect();
    await redisClient.ping();
    isRedisConnected = true;
    return true;
  } catch (error) {
    console.error("Error conecting to redis:", error);
    isRedisConnected = false;
    return false;
  }
};

export default redisClient;
