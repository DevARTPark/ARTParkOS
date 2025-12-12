import { Startup, Question, ActionItem, Facility, Mentor, Review, Project } from '../types';
export const currentUser = {
  id: 'u1',
  name: 'Alex Chen',
  role: 'founder',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};
export const projects: Project[] = [{
  id: 'p1',
  name: 'AgriSense IoT',
  domain: 'AgriTech',
  currentTRL: 3,
  description: 'IoT sensors for precision agriculture monitoring soil health.',
  foundedDate: '2023-01-15'
}, {
  id: 'p2',
  name: 'MediDrone',
  domain: 'Healthcare',
  currentTRL: 5,
  description: 'Autonomous drone delivery for emergency medical supplies.',
  foundedDate: '2022-11-20'
}];
export const startups: Startup[] = [{
  id: 's1',
  name: 'GreenField Tech',
  projects: [projects[0]],
  contactEmail: 'alex@greenfield.com',
  logo: 'https://ui-avatars.com/api/?name=Green+Field&background=10B981&color=fff'
}, {
  id: 's2',
  name: 'SkyHealth Systems',
  projects: [projects[1]],
  contactEmail: 'sarah@skyhealth.com',
  logo: 'https://ui-avatars.com/api/?name=Sky+Health&background=3B82F6&color=fff'
}];
export const trlQuestions: Question[] = [{
  id: 'q1',
  trlLevel: 1,
  category: 'Technology',
  text: 'Have basic principles been observed and reported?',
  required: true
}, {
  id: 'q2',
  trlLevel: 1,
  category: 'Product Engineering',
  text: 'Has the initial product concept been defined?',
  required: true
}, {
  id: 'q3',
  trlLevel: 1,
  category: 'Market Research',
  text: 'Has a preliminary market need been identified?',
  required: true
}, {
  id: 'q4',
  trlLevel: 1,
  category: 'Organisation Structure',
  text: 'Is the core founding team identified?',
  required: true
}, {
  id: 'q5',
  trlLevel: 1,
  category: 'Target Market Engagement',
  text: 'Have potential customer segments been listed?',
  required: true
}, {
  id: 'q6',
  trlLevel: 2,
  category: 'Technology',
  text: 'Has the technology concept been formulated?',
  required: true
}, {
  id: 'q7',
  trlLevel: 2,
  category: 'Product Engineering',
  text: 'Are initial design sketches available?',
  required: true
}, {
  id: 'q8',
  trlLevel: 2,
  category: 'Market Research',
  text: 'Has a competitive landscape analysis been started?',
  required: true
}, {
  id: 'q9',
  trlLevel: 2,
  category: 'Organisation Structure',
  text: 'Are roles and responsibilities defined?',
  required: true
}, {
  id: 'q10',
  trlLevel: 2,
  category: 'Target Market Engagement',
  text: 'Have initial customer interviews been conducted?',
  required: true
}];
export const actionItems: ActionItem[] = [{
  id: 'a1',
  title: 'Submit TRL 3 Evidence',
  status: 'open',
  priority: 'high',
  dueDate: '2023-10-25'
}, {
  id: 'a2',
  title: 'Schedule Mentor Session',
  status: 'in_progress',
  priority: 'medium',
  dueDate: '2023-10-28'
}, {
  id: 'a3',
  title: 'Update Financial Projections',
  status: 'done',
  priority: 'low',
  dueDate: '2023-10-15'
}, {
  id: 'a4',
  title: 'Lab Safety Certification',
  status: 'open',
  priority: 'high',
  dueDate: '2023-11-01'
}];
export const facilities: Facility[] = [{
  id: 'f1',
  name: 'Robotics Lab A',
  type: 'lab',
  availability: 'available',
  image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a783?auto=format&fit=crop&q=80&w=300&h=200'
}, {
  id: 'f2',
  name: '3D Printing Station',
  type: 'equipment',
  availability: 'booked',
  image: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?auto=format&fit=crop&q=80&w=300&h=200'
}, {
  id: 'f3',
  name: 'Conference Room B',
  type: 'space',
  availability: 'available',
  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300&h=200'
}];
export const mentors: Mentor[] = [{
  id: 'm1',
  name: 'Dr. Priya Sharma',
  domain: 'Robotics',
  role: 'IISc Professor',
  availability: 'Tue, Thu',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}, {
  id: 'm2',
  name: 'Rahul Verma',
  domain: 'Business Strategy',
  role: 'Venture Partner',
  availability: 'Mon, Fri',
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}];
export const reviews: Review[] = [{
  id: 'r1',
  assessmentId: 'as1',
  reviewerId: 'rev1',
  startupName: 'GreenField Tech',
  projectName: 'AgriSense IoT',
  trlLevel: 3,
  status: 'pending',
  deadline: '2023-10-30'
}, {
  id: 'r2',
  assessmentId: 'as2',
  reviewerId: 'rev1',
  startupName: 'SkyHealth Systems',
  projectName: 'MediDrone',
  trlLevel: 5,
  status: 'completed',
  deadline: '2023-10-15',
  submittedDate: '2023-10-14'
}];