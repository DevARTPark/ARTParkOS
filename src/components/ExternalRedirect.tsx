import React, { useEffect } from "react";

interface ExternalRedirectProps {
  url: string;
}

/**
 * Redirects the browser to an external URL using replace() so the redirect
 * route doesn't remain in history.
 */
export default function ExternalRedirect({ url }: ExternalRedirectProps) {
  useEffect(() => {
    if (url) {
      // replace so user doesn't go back to /founder/facilities
      window.location.replace(url);
    }
  }, [url]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-slate-500">Redirecting…</p>
    </div>
  );
}
