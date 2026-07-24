export interface Project {
  id: string;
  title: string;
  category: 'Web Applications' | 'Mobile Applications' | 'Desktop Applications' | 'Live Projects';
  description: string;
  technologies: string[];
  live_url?: string | null;
  github_url?: string | null;
  youtube_url?: string | null;
  is_featured?: boolean;
  images?: string[];
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Languages' | 'Web Development' | 'Mobile Development' | 'Frameworks' | 'Tools' | 'AI Tools';
  icon?: string;
  proficiency?: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  is_current?: boolean;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at?: string;
}

export interface Statistic {
  label: string;
  value: string;
  description: string;
}
