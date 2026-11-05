"use client";

import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="glass-panel max-w-md w-full p-6 rounded-lg border border-zinc-800 space-y-5 bg-zinc-900 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-md flex items-center justify-center border ${
                variant === "danger"
                  ? "bg-rose-950/40 text-rose-400 border-rose-800/60"
                  : "bg-zinc-800 text-zinc-300 border-zinc-700"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 id="confirm-modal-title" className="text-base font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            type="button"
            className="py-2 px-3.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition-colors ${
              variant === "danger"
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : "bg-white hover:bg-zinc-200 text-zinc-950"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
