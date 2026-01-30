'use client';

import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  heading: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ heading, content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClickOpen, setIsClickOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const scheduleHide = () => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      if (!isClickOpen) {
        setIsVisible(false);
      }
    }, 150);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isClickOpen) {
      setIsClickOpen(false);
      setIsVisible(false);
    } else {
      setIsClickOpen(true);
      setIsVisible(true);
    }
  };

  const handleMouseEnter = () => {
    clearHideTimeout();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    scheduleHide();
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        setIsClickOpen(false);
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isVisible]);

  // Close when clicking outside (only for click-opened tooltips)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsVisible(false);
        setIsClickOpen(false);
      }
    };

    if (isClickOpen) {
      const timeout = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);
      return () => {
        clearTimeout(timeout);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isClickOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearHideTimeout();
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPositionClasses = {
    top: 'top-full left-1/2 -translate-x-1/2',
    bottom: 'bottom-full left-1/2 -translate-x-1/2',
    left: 'left-full top-1/2 -translate-y-1/2',
    right: 'right-full top-1/2 -translate-y-1/2',
  };

  const arrowBorderClasses = {
    top: 'border-t-[var(--bg-elevated)] border-x-transparent border-b-transparent',
    bottom: 'border-b-[var(--bg-elevated)] border-x-transparent border-t-transparent',
    left: 'border-l-[var(--bg-elevated)] border-y-transparent border-r-transparent',
    right: 'border-r-[var(--bg-elevated)] border-y-transparent border-l-transparent',
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleTriggerClick}
        className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all"
        aria-label={`More info about ${heading}`}
        aria-expanded={isVisible}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {/* Tooltip */}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-[9999] min-w-[280px] max-w-[320px] p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] ${positionClasses[position]}`}
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-[6px] ${arrowPositionClasses[position]} ${arrowBorderClasses[position]}`}
          />

          {/* Content */}
          <div className="text-sm font-semibold text-[var(--text-primary)] mb-2">
            {heading}
          </div>
          <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
            {content}
          </p>
        </div>
      )}
    </div>
  );
}
