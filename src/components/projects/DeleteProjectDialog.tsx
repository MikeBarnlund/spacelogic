'use client';

import { useEffect, useRef } from 'react';

interface DeleteProjectDialogProps {
  isOpen: boolean;
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteProjectDialog({
  isOpen,
  projectName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteProjectDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isDeleting, onCancel]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node) &&
        !isDeleting
      ) {
        onCancel();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isDeleting, onCancel]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 animate-fade-in-up"
        style={{ animationFillMode: 'forwards' }}
      >
        {/* Warning Icon */}
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/20 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[var(--error)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-[var(--text-primary)] text-center mb-2">
          Delete Project
        </h3>
        <p className="text-[var(--text-tertiary)] text-center mb-6">
          Are you sure you want to delete{' '}
          <span className="font-medium text-[var(--text-secondary)]">
            &ldquo;{projectName}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 btn btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 btn bg-[var(--error)] text-white border-[var(--error)] hover:bg-[var(--error)]/80 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="32"
                    strokeDashoffset="12"
                  />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
