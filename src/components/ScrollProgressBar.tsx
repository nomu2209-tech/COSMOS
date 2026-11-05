"use client";

import React, { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrolled = (totalScroll / windowHeight) * 100;
        setScrollProgress(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="scroll-progress"
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[#ea580c] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

