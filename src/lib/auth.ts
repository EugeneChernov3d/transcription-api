/**
 * Authentication utilities for API key validation
 */

/**
 * Get valid API keys from environment variables
 * Supports multiple keys separated by commas
 */
export function getValidApiKeys(): string[] {
  const keys = process.env.API_KEYS;
  if (!keys) {
    return [];
  }
  return keys
    .split(',')
    .map((key) => key.trim())
    .filter((key) => key.length > 0);
}

/**
 * Extract Bearer token from Authorization header
 * Returns null if header is missing or malformed
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Validate API key against configured valid keys
 */
export function validateApiKey(apiKey: string): boolean {
  const validKeys = getValidApiKeys();

  // If no keys are configured, deny all requests
  if (validKeys.length === 0) {
    return false;
  }

  return validKeys.includes(apiKey);
}

/**
 * Authentication error response helper
 */
export function unauthorizedResponse(reason: 'missing' | 'invalid' | 'malformed') {
  const messages = {
    missing: 'Authorization header required',
    invalid: 'Invalid API key',
    malformed: 'Invalid authorization format. Use: Bearer <api-key>',
  };

  return new Response(JSON.stringify({ error: messages[reason] }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'Bearer',
    },
  });
}

/**
 * Validate authentication from a request
 * Returns { valid: true } if authenticated
 * Returns { valid: false, response: Response } if not authenticated
 */
export function validateAuth(authHeader: string | null):
  | { valid: true }
  | { valid: false; response: Response } {
  const token = extractBearerToken(authHeader);

  if (!token) {
    return {
      valid: false,
      response: unauthorizedResponse(authHeader ? 'malformed' : 'missing'),
    };
  }

  if (!validateApiKey(token)) {
    return {
      valid: false,
      response: unauthorizedResponse('invalid'),
    };
  }

  return { valid: true };
}
