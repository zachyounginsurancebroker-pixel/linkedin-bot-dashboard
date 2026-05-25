export type JobSource = "applypilot" | "linkedin_bot";

export type ApplicationStatus =
  | "discovered"
  | "scored"
  | "tailored"
  | "submitted"
  | "response_received"
  | "interview"
  | "offer"
  | "rejected"
  | "skipped";

export type Application = {
  id: string;
  user_id: string;
  source: JobSource;
  external_job_id: string | null;
  title: string;
  company: string;
  location: string | null;
  job_url: string | null;
  external_apply_url: string | null;
  job_board: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  job_description: string | null;
  ai_score: number | null;
  ai_score_reasoning: string | null;
  has_sponsorship_mention: boolean | null;
  sponsorship_friendly: boolean | null;
  status: ApplicationStatus;
  applied_at: string | null;
  hr_name: string | null;
  hr_link: string | null;
  resume_path: string | null;
  cover_letter: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SearchRun = {
  id: string;
  user_id: string;
  source: JobSource;
  search_terms: string[];
  location: string | null;
  total_discovered: number;
  total_applied: number;
  total_skipped: number;
  started_at: string;
  ended_at: string | null;
  status: string;
  notes: string | null;
};
