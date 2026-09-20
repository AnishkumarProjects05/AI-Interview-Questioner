/**
 * @jest-environment node
 */
import { checkRateLimit, resetRateLimits } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

describe("Rate Limiting API & Middleware Response Logic", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  function simulateMiddlewareRateLimit(ip: string, options = { maxRequests: 2, windowMs: 60000 }) {
    const { isLimited, limit, remaining, resetTime, retryAfter } = checkRateLimit(ip, options);

    if (isLimited) {
      return new NextResponse(
        JSON.stringify({
          error: `Too many requests. Please try again in ${retryAfter} seconds.`,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
          },
        }
      );
    }

    return {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    };
  }

  it("passes requests under the rate limit with valid metadata headers", () => {
    const res = simulateMiddlewareRateLimit("192.168.1.100");
    expect(res.status).toBe(200);
    expect(res.headers["X-RateLimit-Limit"]).toBe("2");
    expect(res.headers["X-RateLimit-Remaining"]).toBe("1");
  });

  it("returns 429 with correct rate limit headers and retry info when throttled", async () => {
    const ip = "192.168.1.101";
    // 2 allowed requests
    simulateMiddlewareRateLimit(ip);
    simulateMiddlewareRateLimit(ip);

    // 3rd request should trigger 429 NextResponse
    const throttledResponse = simulateMiddlewareRateLimit(ip) as NextResponse;

    expect(throttledResponse.status).toBe(429);
    expect(throttledResponse.headers.get("Retry-After")).toBeDefined();
    expect(throttledResponse.headers.get("X-RateLimit-Limit")).toBe("2");
    expect(throttledResponse.headers.get("X-RateLimit-Remaining")).toBe("0");

    const json = await throttledResponse.json();
    expect(json.error).toMatch(/Too many requests/i);
    expect(json.retryAfter).toBeGreaterThan(0);
  });
});
