'use client';

import { useState } from 'react';

interface ProjectFormData {
  name: string;
  description: string;
  client_name: string;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  submitLabel = 'Continue',
  isSubmitting = false,
}: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [clientName, setClientName] = useState(initialData?.client_name ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      client_name: clientName.trim(),
    });
  };

  const isValid = name.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Project Name - Required */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
        >
          Project Name <span className="text-[var(--error)]">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Acme Corp HQ Relocation"
          className="input"
          required
          autoFocus
        />
      </div>

      {/* Client Name - Optional */}
      <div>
        <label
          htmlFor="client_name"
          className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
        >
          Client Name
        </label>
        <input
          type="text"
          id="client_name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="e.g., Acme Corporation"
          className="input"
        />
      </div>

      {/* Description - Optional */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief notes about this project..."
          className="input"
          rows={3}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
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
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{submitLabel}</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
