import { projects } from './mockData';

// --- Shared Types ---
export interface Task {
    id: string;
    title: string;
    deadline: string;
    description?: string; // Added: For the 1-2 sentence plan
    status: 'Pending' | 'Completed';
}

export interface PromiseItem {
    id: string;
    text: string;
    status: 'Met' | 'Missed' | 'Pending'; 
}

// --- Quarterly Types ---
export interface QuarterlyReport {
    id: string;
    quarter: string;
    status: 'Draft' | 'Submitted' | 'Reviewed';
    date: string;

    // 1. Review of Past Promises
    committedGoals: PromiseItem[];

    // 2. Overall Startup Review
    overallUpdates: {
        highlights: string;
        risks: string;
        strategy: string;
        nextQuarterCheckpoints: PromiseItem[];
    };

    // 3. Project-wise Reviews
    projectUpdates: {
        projectId: string;
        projectName: string;
        highlights: string;
        risks: string;
    }[];

    reviewer?: string;
    feedback?: string;
}

export interface ReportDetail {
    reportId: string;
    month: string;
    status: 'Submitted' | 'Pending' | 'Locked';
    date: string;
    budget: { utilized: string; total: string; status: 'On Track' | 'Overrun' };
    overallRisk: 'Low' | 'Medium' | 'High';
    artparkRemarks?: string;
    projectUpdates: {
        projectId: string;
        projectName: string;
        currentAIRL: number;
        highlights: string;
        risks: string;
        scheduleTasks: Task[];
        systemRisk: 'Low' | 'Medium' | 'High';
    }[];
}

// --- Mock Data ---

export const currentQuarterGoals = [
  "Complete Lab Trials for Prototype V2",
  "Onboard 2 Pilot Customers",
  "Hire Senior Embedded Engineer"
];

// Monthly Reports
export const monthlyReports: ReportDetail[] = [
    {
        reportId: 'rep-oct',
        month: 'October 2023',
        status: 'Submitted',
        date: 'Oct 28, 2023',
        budget: { utilized: '₹32L', total: '₹50L', status: 'On Track' },
        overallRisk: 'Low',
        artparkRemarks: "Great progress. Keep an eye on the sensor calibration timeline.",
        projectUpdates: [
            {
                projectId: projects[0].id,
                projectName: projects[0].name,
                currentAIRL: 3,
                highlights: "Deployed 50 sensors. Data stream stable.",
                risks: "Minor latency in 4G modules.",
                scheduleTasks: [
                    { id: 't1', title: 'Complete Sensor Calibration', deadline: '2023-11-15', status: 'Pending', description: "Calibrate against gold standard in Lab A." },
                    { id: 't2', title: 'Field Test Report', deadline: '2023-11-20', status: 'Pending' }
                ],
                systemRisk: 'Low'
            },
            {
                projectId: projects[1].id,
                projectName: projects[1].name,
                currentAIRL: 5,
                highlights: "Drone frame assembly complete.",
                risks: "Battery supply delayed by 2 weeks.",
                scheduleTasks: [
                    { id: 't3', title: 'Battery Stress Test', deadline: '2023-11-10', status: 'Pending' }
                ],
                systemRisk: 'Medium'
            }
        ]
    },
    {
        reportId: 'rep-nov',
        month: 'November 2023',
        status: 'Pending',
        date: 'Due: Nov 30, 2023',
        budget: { utilized: '₹38L', total: '₹50L', status: 'On Track' },
        overallRisk: 'Medium',
        projectUpdates: projects.map(p => ({
            projectId: p.id,
            projectName: p.name,
            currentAIRL: p.currentAIRL,
            highlights: "",
            risks: "",
            scheduleTasks: [],
            systemRisk: p.currentAIRL < 4 ? 'Low' : 'Medium'
        }))
    },
    {
        reportId: 'rep-dec',
        month: 'December 2023',
        status: 'Locked',
        date: 'Opens: Dec 25, 2023',
        budget: { utilized: '₹0', total: '₹0', status: 'On Track' },
        overallRisk: 'Low',
        projectUpdates: []
    }
];

// Quarterly Reports
export const quarterlyReports: QuarterlyReport[] = [
  {
    id: 'q3-2023',
    quarter: 'Q3 2023',
    status: 'Reviewed',
    date: 'Submitted: Oct 5, 2023',
    committedGoals: [
      { id: 'p1', text: 'Achieve AIRL 3', status: 'Met' },
      { id: 'p2', text: 'File Provisional Patent', status: 'Met' },
      { id: 'p3', text: 'Sign 1 MOU', status: 'Missed' }
    ],
    overallUpdates: {
        highlights: "Filed our first patent (IP-2023-99). Secured 2 pilot partners.",
        risks: "Cash flow is tight. We have 4 months of runway left.",
        strategy: "Shift focus from R&D to Commercialization.",
        nextQuarterCheckpoints: [
            { id: 'np1', text: 'Onboard 2 Pilot Customers', status: 'Pending' },
            { id: 'np2', text: 'Hire Sales Lead', status: 'Pending' }
        ]
    },
    projectUpdates: [
        {
            projectId: projects[0].id,
            projectName: projects[0].name,
            highlights: "Sensor accuracy improved by 15%.",
            risks: "Supply chain for LoRa modules is slow."
        },
        {
            projectId: projects[1].id,
            projectName: projects[1].name,
            highlights: "Hover test successful.",
            risks: "Motor heating issue unresolved."
        }
    ],
    reviewer: 'Dr. Priya Sharma',
    feedback: 'Technical milestones met, but commercial partnerships are lagging. Good pivot in strategy.'
  },
  {
    id: 'q4-2023',
    quarter: 'Q4 2023',
    status: 'Draft',
    date: 'Due: Jan 10, 2024',
    committedGoals: [
      { id: 'np1', text: 'Onboard 2 Pilot Customers', status: 'Pending' },
      { id: 'np2', text: 'Hire Sales Lead', status: 'Pending' }
    ],
    overallUpdates: {
        highlights: "",
        risks: "",
        strategy: "",
        nextQuarterCheckpoints: []
    },
    projectUpdates: projects.map(p => ({
        projectId: p.id,
        projectName: p.name,
        highlights: "",
        risks: ""
    }))
  }
];

export const performanceMetrics = {
    promisesMetPercentage: 85,
    onTimeSubmissionRate: '100%',
    streak: 2
};

export const performanceChartData = quarterlyReports.filter(q => q.status === 'Reviewed').map(q => {
    const total = q.committedGoals.length;
    const met = q.committedGoals.filter(g => g.status === 'Met').length;
    const pct = total > 0 ? (met / total) * 10 : 0;
    return { name: q.quarter, score: pct };
}).reverse();