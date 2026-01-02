import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { handleServerError } from '@/lib/handle-server-error';
import { useAuthStore } from '@/stores/auth-store';
import { DirectionProvider } from './context/direction-provider';
import { FontProvider } from './context/font-provider';
import { ThemeProvider } from './context/theme-provider';
import { logError } from './lib/errorTracking';
// Generated Routes
import { routeTree } from './routeTree.gen';
// Styles
import './styles/index.css';

/**
 * Validates that a redirect URL is a safe, internal path.
 * @param url The URL to validate.
 * @returns `true` if the URL is a valid internal redirect, `false` otherwise.
 */
function isValidRedirect(url: string | undefined | null): boolean {
  if (!url) {
    return false;
  }
  // Must start with '/'
  if (!url.startsWith('/')) {
    return false;
  }
  // Must not start with '//' (protocol-relative URLs)
  if (url.startsWith('//')) {
    return false;
  }
  // Must not contain a protocol like 'http:' or 'https:'
  if (url.includes('://')) {
    return false;
  }
  return true;
}

// Global error handling for uncaught errors and unhandled promise rejections
window.addEventListener('error', (event) => {
  if (event.error instanceof Error) {
    logError(event.error, { source: 'global-error-handler' });
    toast.error('An unexpected error occurred. Please try again later.');
  } else {
    logError(new Error('An unknown error occurred'), { source: 'global-error-handler', originalEvent: event });
    toast.error('An unexpected error occurred. Please try again later.');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason instanceof Error) {
    logError(event.reason, { source: 'unhandled-rejection-handler' });
    toast.error(`An unhandled promise rejection occurred: ${event.reason.message}`);
  } else {
    logError(new Error('An unknown promise rejection occurred'), {
      source: 'unhandled-rejection-handler',
      originalEvent: event,
    });
    toast.error('An unhandled promise rejection occurred.');
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error });

        if (failureCount >= 0 && import.meta.env.DEV) return false;
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return !(error instanceof AxiosError && [401, 403].includes(error.response?.status ?? 0));
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified!');
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Session expired!');
          useAuthStore.getState().auth.reset();
          const unsafeRedirect = router.history.location.pathname;
          const redirect = isValidRedirect(unsafeRedirect) ? unsafeRedirect : '/';
          router.navigate({ to: '/sign-in', search: { redirect } });
        }
        if (error.response?.status === 500) {
          toast.error('Internal Server Error!');
          // Only navigate to error page in production to avoid disrupting HMR in development
          if (import.meta.env.PROD) {
            router.navigate({ to: '/500' });
          }
        }
        if (error.response?.status === 403) {
          // router.navigate("/forbidden", { replace: true });
        }
      }
    },
  }),
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <FontProvider>
              <DirectionProvider>
                <RouterProvider router={router} />
              </DirectionProvider>
            </FontProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
