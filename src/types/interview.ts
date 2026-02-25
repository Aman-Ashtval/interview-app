export interface MockInterviewDetails {
  id: number;
  job_title: string;
  job_description: string;
  experience: number;
  created_by: string;
  created_at: string;
  mock_id: string;
  level: string;
  data_res: string;
}

export interface Question {
  id: number;
  question: string;
  answer: string;
  user_answer: string | null;
  rating: number;
  feedback: string | null;
  created_at: string;
  created_by: string;
  mock_id: string;
}