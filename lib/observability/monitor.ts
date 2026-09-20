/**
 * Production Observability, Performance Tracing & Sanitized Logging
 *
 * STRICT PRIVACY RULES:
 * 1. NEVER log image or audio buffers or base64 strings.
 * 2. NEVER log raw user prompts or raw model outputs.
 * 3. NEVER log API keys, auth headers, or user IP addresses in plaintext.
 * 4. Only capture high-level metadata: endpoint, provider, model, latencyMs, HTTP status, and errorCategory.
 */

export type ErrorCategory =
  | "rate_limit_exceeded"
  | "validation_error"
  | "unsupported_media"
  | "payload_too_large"
  | "provider_auth_error"
  | "provider_quota_error"
  | "provider_timeout"
  | "provider_schema_mismatch"
  | "provider_unavailable"
  | "internal_error";

export interface LogContext {
  endpoint: string;
  provider?: string;
  model?: string;
  durationMs?: number;
  httpStatus?: number;
  errorCategory?: ErrorCategory;
  requestId?: string;
}

export class ProductionMonitor {
  /**
   * Log operational events with strict redaction of sensitive payloads
   */
  static logEvent(level: "info" | "warn" | "error", message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? { ...context } : {};

    const logEntry = {
      timestamp,
      level,
      message,
      ...sanitizedContext,
      service: "catanalyzer",
      env: process.env.NODE_ENV || "development",
    };

    if (level === "error") {
      console.error(JSON.stringify(logEntry));
    } else if (level === "warn") {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  /**
   * Capture and categorize server or AI provider errors for monitoring
   */
  static captureError(error: unknown, context: LogContext): { userMessage: string; httpStatus: number } {
    const rawMessage = error instanceof Error ? error.message : String(error);

    let errorCategory: ErrorCategory = "internal_error";
    let userMessage = "An unexpected error occurred. Please try again later.";
    let httpStatus = context.httpStatus || 500;

    if (rawMessage.includes("rate limit") || rawMessage.includes("Too many requests") || rawMessage.includes("429")) {
      errorCategory = "rate_limit_exceeded";
      userMessage = "Analysis service is receiving high traffic. Please wait a moment before trying again.";
      httpStatus = 429;
    } else if (rawMessage.includes("TIMEOUT") || rawMessage.includes("timed out") || rawMessage.includes("abort")) {
      errorCategory = "provider_timeout";
      userMessage = "Analysis timed out. Please try again with a clearer file.";
      httpStatus = 504;
    } else if (rawMessage.includes("API_KEY") || rawMessage.includes("401") || rawMessage.includes("403")) {
      errorCategory = "provider_auth_error";
      userMessage = "AI analysis service is temporarily unavailable. Please try again later.";
      httpStatus = 503;
    } else if (rawMessage.includes("quota") || rawMessage.includes("exceeded")) {
      errorCategory = "provider_quota_error";
      userMessage = "AI service capacity limit reached. Please try again shortly.";
      httpStatus = 503;
    } else if (rawMessage.includes("schema") || rawMessage.includes("quality standards")) {
      errorCategory = "provider_schema_mismatch";
      userMessage = "AI model returned an unexpected response format. Please try again.";
      httpStatus = 502;
    } else if (rawMessage.includes("format") || rawMessage.includes("corrupted") || rawMessage.includes("magic bytes")) {
      errorCategory = "validation_error";
      userMessage = rawMessage;
      httpStatus = 400;
    }

    this.logEvent("error", "Request processing failed", {
      ...context,
      httpStatus,
      errorCategory,
    });

    return { userMessage, httpStatus };
  }
}
