"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function CopyButton({ text, label = "Copy", className = "", size = "sm" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      aria-label={copied ? "Copied" : `Copy ${label}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
        copied
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
          : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
      } ${className}`}
      title={copied ? "Copied!" : `Copy: ${text}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-zinc-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

