import { checkRateLimit, resetRateLimits } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
    jest.useRealTimers();
  });

  it("allows initial requests within the limit", () => {
    const res = checkRateLimit("192.168.1.1", { maxRequests: 5, windowMs: 60000 });
    expect(res.isLimited).toBe(false);
    expect(res.limit).toBe(5);
    expect(res.remaining).toBe(4);
    expect(res.retryAfter).toBe(0);
    expect(res.resetTime).toBeGreaterThan(Date.now());
  });

  it("decrements remaining requests with each hit", () => {
    const ip = "10.0.0.1";
    const options = { maxRequests: 3, windowMs: 60000 };

    const first = checkRateLimit(ip, options);
    expect(first.isLimited).toBe(false);
    expect(first.remaining).toBe(2);

    const second = checkRateLimit(ip, options);
    expect(second.isLimited).toBe(false);
    expect(second.remaining).toBe(1);

    const third = checkRateLimit(ip, options);
    expect(third.isLimited).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it("blocks requests once the limit is exceeded", () => {
    const ip = "10.0.0.2";
    const options = { maxRequests: 2, windowMs: 60000 };

    checkRateLimit(ip, options); // req 1
    checkRateLimit(ip, options); // req 2

    const blocked = checkRateLimit(ip, options); // req 3 (exceeds)
    expect(blocked.isLimited).toBe(true);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });

  it("isolates rate limits between different IP addresses", () => {
    const options = { maxRequests: 2, windowMs: 60000 };

    checkRateLimit("1.1.1.1", options);
    checkRateLimit("1.1.1.1", options);
    const ip1Blocked = checkRateLimit("1.1.1.1", options);
    expect(ip1Blocked.isLimited).toBe(true);

    // IP 2 should still have full quota
    const ip2Result = checkRateLimit("2.2.2.2", options);
    expect(ip2Result.isLimited).toBe(false);
    expect(ip2Result.remaining).toBe(1);
  });

  it("allows new requests after the window expires", () => {
    jest.useFakeTimers();
    const ip = "172.16.0.1";
    const options = { maxRequests: 2, windowMs: 10000 }; // 10s window

    checkRateLimit(ip, options);
    checkRateLimit(ip, options);
    expect(checkRateLimit(ip, options).isLimited).toBe(true);

    // Fast-forward time past the window
    jest.advanceTimersByTime(11000);

    // Should be allowed again
    const afterExpiry = checkRateLimit(ip, options);
    expect(afterExpiry.isLimited).toBe(false);
    expect(afterExpiry.remaining).toBe(1);
  });

  it("uses defaults when no options are provided", () => {
    const res = checkRateLimit("default-ip-test");
    expect(res.limit).toBe(5);
    expect(res.remaining).toBe(4);
    expect(res.isLimited).toBe(false);
  });
});
