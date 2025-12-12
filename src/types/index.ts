export type Role = 'founder' | 'admin' | 'reviewer';
export type TRLCategory = 'Technology' | 'Product Engineering' | 'Market Research' | 'Organisation Structure' | 'Target Market Engagement';
export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}
export interface Project {
  id: string;
  name: string;
  domain: string;
  currentTRL: number;
  description: string;
  foundedDate: string;
}
export interface Startup {
  id: string;
  name: string;
  projects: Project[];
  contactEmail: string;
  logo: string;
}
export interface Question {
  id: string;
  trlLevel: number;
  category: TRLCategory;
  text: string;
  required: boolean;
}
export interface Answer {
  questionId: string;
  value: 'yes' | 'no' | null;
  notes: string;
  files: string[];
}
export interface Assessment {
  id: string;
  projectId: string;
  trlLevel: number;
  status: 'in_progress' | 'submitted' | 'reviewed' | 'approved';
  answers: Answer[];
  submittedDate?: string;
}
export interface ActionItem {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}
export interface Facility {
  id: string;
  name: string;
  type: 'lab' | 'equipment' | 'space';
  availability: 'available' | 'booked' | 'maintenance';
  image: string;
}
export interface Mentor {
  id: string;
  name: string;
  domain: string;
  role: string;
  availability: string;
  image: string;
}
export interface Review {
  id: string;
  assessmentId: string;
  reviewerId: string;
  startupName: string;
  projectName: string;
  trlLevel: number;
  status: 'pending' | 'completed';
  deadline: string;
  submittedDate?: string;
}