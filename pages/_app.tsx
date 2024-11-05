import { ErrorBoundary } from '@sentry/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

function FallbackComponent({ resetError }: { resetError: () => void }) {
  const router = useRouter();

  const handleRedirect = () => {
    resetError(); // Reset Sentry ErrorBoundary on redirect
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Oops! Something went wrong.</h1>
        <p className="text-gray-600 mb-6">
          Working to fix the issue. You will be redirected shortly.
        </p>

        {/* Loading Spinner */}
        <div className="mb-6">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>

        <button
          onClick={handleRedirect}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Go Back to Home Now
        </button>
      </div>
    </div>
  );
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Prevent server-client mismatch by not rendering Sentry.ErrorBoundary on the server
  if (!hydrated) {
    return null;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ErrorBoundary
        fallback={({ resetError }) => (
          <FallbackComponent resetError={resetError} />
        )}
        showDialog
      >
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  );
}
