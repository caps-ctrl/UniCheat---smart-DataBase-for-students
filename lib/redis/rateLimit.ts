
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const uploadRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "upload",
    analytics: true,
});

export const reportRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "5 m"),
    prefix: "report",
    analytics: true,
});




export const authRateLimit = new Ratelimit({

    redis,

    limiter: Ratelimit.slidingWindow(10, "5 m"),

    prefix: "auth",

    analytics: true,
})