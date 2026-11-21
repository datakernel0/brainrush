"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("BrainRush route error:", error);
  }, [error]);

  return (
    <div className="container">
      <section className="page-hero">
        <span className="eyebrow">ERROR</span>
        <h1>An unexpected error occurred</h1>
        <p>Something went wrong loading this view. Your saved records remain intact.</p>
        <button className="primary-btn" onClick={() => reset()} style={{ marginTop: 20 }}>
          Try again
        </button>
      </section>
    </div>
  );
}
