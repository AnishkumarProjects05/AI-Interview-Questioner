const rateLimitMap = new Map();

/**
 * Checks if a request should be rate-limited.
 * @param {string} ip - The requester's IP address.
 * @param {object} options - Options for the rate limiter.
 * @param {number} options.windowMs - The time window in milliseconds (default: 60000).
 * @param {number} options.maxRequests - The max number of requests allowed within the window (default: 5).
 * @returns {object} Rate limit status details.
 */
export function checkRateLimit(ip, options = {}) {
  const windowMs = options.windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000;
  const maxRequests = options.maxRequests || parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 5;

  const now = Date.now();
  
  // Get existing requests for this IP
  let requests = rateLimitMap.get(ip) || [];
  
  // Filter out expired timestamps
  requests = requests.filter(timestamp => now - timestamp < windowMs);
  
  const remaining = Math.max(0, maxRequests - requests.length);
  const isLimited = requests.length >= maxRequests;
  
  // Calculate reset time (when the oldest request expires and frees up a slot)
  const oldestRequest = requests[0];
  const resetTime = oldestRequest ? oldestRequest + windowMs : now + windowMs;
  const retryAfter = isLimited ? Math.ceil((resetTime - now) / 1000) : 0;
  
  if (!isLimited) {
    requests.push(now);
    rateLimitMap.set(ip, requests);
  }
  
  // Probabilistic garbage collection of expired keys (5% chance per invocation)
  if (Math.random() < 0.05) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const activeTimestamps = timestamps.filter(t => now - t < windowMs);
      if (activeTimestamps.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, activeTimestamps);
      }
    }
  }
  
  return {
    isLimited,
    limit: maxRequests,
    remaining: isLimited ? 0 : remaining - 1,
    resetTime,
    retryAfter,
  };
}
