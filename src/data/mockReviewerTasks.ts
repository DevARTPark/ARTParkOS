export interface ReviewTask {
  id: string;
  startup: string;
  type: 'AIRL Assessment' | 'Monthly Report' | 'Quarterly Review' | 'Mentorship Request';
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  submittedDate: string;
  description: string;
  assigneeId: string | null; // null = Unassigned (Pool), 'me' = Assigned to you
  status: 'Pending' | 'In Progress' | 'Completed';
}

// Initial State
export const initialTasks: ReviewTask[] = [
  // --- Unassigned Tasks (For Task Pool) ---
  {
    id: 't_pool_1',
    startup: 'BlueSky Aero',
    type: 'AIRL Assessment',
    title: 'AIRL 4: Flight Log Validation',
    priority: 'High',
    due: '2 Days',
    submittedDate: 'Oct 26, 2023',
    description: 'Validate 50 hours of autonomous flight logs.',
    assigneeId: null,
    status: 'Pending'
  },
  {
    id: 't_pool_2',
    startup: 'EcoWaste',
    type: 'Monthly Report',
    title: 'September Financials',
    priority: 'Medium',
    due: '3 Days',
    submittedDate: 'Oct 27, 2023',
    description: 'Review burn rate and runway updates.',
    assigneeId: null,
    status: 'Pending'
  },
  {
    id: 't_pool_3',
    startup: 'NanoHealth',
    type: 'Quarterly Review',
    title: 'Q3 Milestone Check',
    priority: 'High',
    due: 'Tomorrow',
    submittedDate: 'Oct 25, 2023',
    description: 'Critical review for tranche release.',
    assigneeId: null,
    status: 'Pending'
  },

  // --- Assigned Tasks (For My Tasks) ---
  {
    id: 't1',
    startup: 'GreenField Tech',
    type: 'AIRL Assessment',
    title: 'AIRL 3 Verification: Lab Scale',
    priority: 'High',
    due: 'Today',
    submittedDate: 'Oct 24, 2023',
    description: 'Verify lab results against technical milestones.',
    assigneeId: 'me',
    status: 'In Progress'
  },
  {
    id: 't2',
    startup: 'MediDrone Systems',
    type: 'Monthly Report',
    title: 'October 1-Pager Review',
    priority: 'Medium',
    due: 'Tomorrow',
    submittedDate: 'Oct 25, 2023',
    description: 'Review monthly progress on "Pilot Onboarding" goal.',
    assigneeId: 'me',
    status: 'Pending'
  },
];