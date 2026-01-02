/**
 * A simple error tracking utility.
 * In a real-world application, this would integrate with a service like Sentry,
 * Datadog, or LogRocket.
 *
 * For now, it just logs errors to the console with additional context.
 */
interface ErrorContext {
  [key: string]: any;
}

export function logError(error: Error, context?: ErrorContext): void {
  console.error('[ErrorTracker]', error);
  if (context) {
    console.error('[ErrorContext]', context);
  }
  // TODO: Add Sentry.captureException(error, { extra: context });
}

/**
 * A higher-order function to wrap async functions with error tracking.
 * This can be useful for wrapping event handlers, API calls, etc.
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): (...args: Parameters<T>) => Promise<ReturnType<T> | void> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        logError(error, {
          ...context,
          functionName: fn.name,
          arguments: args,
        });
      } else {
        logError(new Error('An unknown error occurred'), {
          ...context,
          originalError: error,
          functionName: fn.name,
          arguments: args,
        });
      }
      // Optionally re-throw or handle the error further
    }
  };
}
