import "../styles/globals.css";
import type { AppProps } from "next/app";
import ErrorBoundary from "../globalComponents/ErrorBoundary";
import { Suspense, useEffect, useState } from "react";
import React from "react";
import ErrorPage from "../globalComponents/ErrorPage";
import { log, reportLogs } from "../globalComponents/modules/logs";
function MyApp({ Component, pageProps }: AppProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  useEffect(() => {
    window.onerror = () => true;
    window.addEventListener("unhandledrejection", handlePromiseRejection);
    window.addEventListener("error", handleGlobalError);
    return () => {
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
      window.removeEventListener("error", handleGlobalError);
    };
  }, []);
  
  function handlePromiseRejection(event: PromiseRejectionEvent) {
    event.preventDefault();
  
    try {
      // Log or handle the error here
      log("Unhandled Promise Rejection:")
      log(event.reason);
      setHasError(true);
    } catch (error) {
      log("Error while handling promise rejection:")
      log(error);
    }
    reportLogs()
  }
  
  function handleGlobalError(event: Event) {
    event.preventDefault();
  
    try {
      // Log or handle the error here
      log("Global Error:") 
      log(event);
      setHasError(true);
    } catch (error) {
      log("Error while handling global error:");
      log(error);
    }
    reportLogs()
  }
  
  return hasError ? (
    <ErrorPage />
  ) : (
    <Suspense fallback={<div>ERROR...</div>}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </Suspense>
  );
}

export default MyApp;
