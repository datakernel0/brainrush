"use client";

import { useEffect, useRef } from "react";

export default function AdSlot({
  placement = "content",
  className = "",
}: {
  placement?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Clear any previous injections on route transitions
    el.innerHTML = "";

    const adDiv = document.createElement("div");
    adDiv.id = "container-81043a0120cdcdf913ef29f0d187248e";

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://bauval.org/21/81043a0120cdcdf913ef29f0d187248e";

    el.appendChild(adDiv);
    el.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ad-slot-wrapper ${className}`}
      data-ad-placement={placement}
      style={{
        margin: "20px auto",
        minHeight: "90px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
      }}
    />
  );
}
