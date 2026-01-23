import { Scenario, ExtractedRequirements } from './scenario';

// Project database record
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  client_name: string | null;
  prompt_text: string;
  scenarios: Scenario[] | null;
  extracted_requirements: ExtractedRequirements | null;
  created_at: string;
  updated_at: string;
}

// For creating a new project
export interface CreateProjectInput {
  name: string;
  description?: string | null;
  client_name?: string | null;
  prompt_text: string;
  scenarios?: Scenario[] | null;
  extracted_requirements?: ExtractedRequirements | null;
}

// For updating an existing project
export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
  client_name?: string | null;
  prompt_text?: string;
  scenarios?: Scenario[] | null;
  extracted_requirements?: ExtractedRequirements | null;
}

// API response types
export interface ProjectListResponse {
  projects: Project[];
}

export interface ProjectResponse {
  project: Project;
}

// Helper functions for display formatting
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  } else {
    return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
