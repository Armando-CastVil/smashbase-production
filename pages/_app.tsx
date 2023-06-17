import "../styles/globals.css";
import type { AppProps } from "next/app";
import ErrorBoundary from "../globalComponents/ErrorBoundary";
import { Suspense, useEffect, useState } from "react";
import React from "react";
import ErrorPage from "../globalComponents/ErrorPage";

function MyApp({ Component, pageProps }: AppProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Set up event listeners for unhandled promise rejections and global errors
    window.onerror = () => true;
    window.addEventListener("unhandledrejection", handlePromiseRejection);
    window.addEventListener("error", handleGlobalError);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
      window.removeEventListener("error", handleGlobalError);
    };
  }, []);

  function handlePromiseRejection(event: PromiseRejectionEvent): void {
    event.preventDefault();

    try {
      // Log or handle the error here
      console.error("Unhandled Promise Rejection:", event.reason);
      setHasError(true);
    } catch (error) {
      console.error("Error while handling promise rejection:", error);
    }
  }

  function handleGlobalError(event: Event): void {
    event.preventDefault();

    try {
      // Log or handle the error here
      console.error("Global Error:", event);
      setHasError(true);
    } catch (error) {
      console.error("Error while handling global error:", error);
    }
  }

  // Render the ErrorPage component if there is an error, otherwise render the main component wrapped in ErrorBoundary and Suspense
  if (hasError) {
    return <ErrorPage />;
  }

  return (
    <Suspense fallback={<div>ERROR...</div>}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </Suspense>
  );
}

export default MyApp;
