// src/data/adminMockData.ts

export type RAGStatus = 'Green' | 'Yellow' | 'Red';
export type Domain = 'Healthcare' | 'AgriTech' | 'Robotics' | 'Mobility' | 'CleanTech';

export interface Project {
  id: string;
  name: string;
  domain: Domain;
  currentAIRL: number; // 1-9
  previousAIRL: number; // For progression chart logic
  status: RAGStatus;
  description: string;
}

export interface FundingRequest {
  id: string;
  amount: string; // e.g., "50 Lakhs"
  reason: string;
  submittedDate: string;
  isUrgent: boolean;
}

export interface Startup {
  id: string;
  name: string;
  logo: string;
  description: string;
  foundedYear: number;
  location: string;
  
  // Financials (in Crores)
  fundsAllocated: number; 
  fundsUtilized: number;
  burnRateMonthly: number; // in Lakhs
  runwayMonths: number;
  
  projects: Project[];
  fundingRequest?: FundingRequest; // Optional active request
  
  // Reviewer Metadata
  lastReviewDate: string;
  reviewerComment: string;
}

// --- 1. FINANCIAL COCKPIT DATA ---
// Total Budget: 100 Cr (50 DST + 50 GoK)
// Received: 70 Cr
// Allocated to Startups: ~35 Cr
// Remaining in Bank: ~35 Cr
export const financialOverview = {
  totalBudgetSanctioned: 100.0, 
  sources: [
    { name: 'DST (Dept of Science & Tech)', sanctioned: 50.0, received: 35.0, deadline: '2025-03-31' },
    { name: 'GoK (Govt of Karnataka)', sanctioned: 50.0, received: 35.0, deadline: '2025-06-30' },
  ],
  totalReceived: 70.0, 
  // Note: totalAllocated will be calculated dynamically from startups below to be "Real-time"
  bankBalanceDescription: "Unallocated funds available for new cohorts or top-ups."
};

// --- 2. STARTUP PORTFOLIO (10 Startups) ---
export const adminStartups: Startup[] = [
  {
    id: 's1',
    name: 'NeuroVibe',
    logo: 'https://ui-avatars.com/api/?name=Neuro+Vibe&background=6366f1&color=fff',
    description: 'Non-invasive brain stimulation for rehab.',
    foundedYear: 2023,
    location: 'Bangalore',
    fundsAllocated: 4.5,
    fundsUtilized: 3.2,
    burnRateMonthly: 15,
    runwayMonths: 8,
    lastReviewDate: '2024-01-10',
    reviewerComment: 'Clinical trials showing promising results. AIRL jumped from 4 to 5.',
    projects: [
      { id: 'p1', name: 'NeuroCap Pro', domain: 'Healthcare', currentAIRL: 5, previousAIRL: 4, status: 'Green', description: 'Wearable EEG device.' }
    ]
  },
  {
    id: 's2',
    name: 'AgriSense',
    logo: 'https://ui-avatars.com/api/?name=Agri+Sense&background=10b981&color=fff',
    description: 'Soil IoT sensors for large acreage.',
    foundedYear: 2022,
    location: 'Hubli',
    fundsAllocated: 3.0,
    fundsUtilized: 2.8, 
    burnRateMonthly: 10,
    runwayMonths: 2, // LOW RUNWAY -> RED FLAG
    lastReviewDate: '2024-01-05',
    reviewerComment: 'Critical cash flow issues. Product is solid but needs bridge round.',
    fundingRequest: {
      id: 'fr1',
      amount: '50 Lakhs',
      reason: 'Bridge capital for inventory purchase before harvest season.',
      submittedDate: '2024-01-12',
      isUrgent: true
    },
    projects: [
      { id: 'p2', name: 'SoilNode X1', domain: 'AgriTech', currentAIRL: 6, previousAIRL: 6, status: 'Red', description: 'IoT Sensor array.' }
    ]
  },
  {
    id: 's3',
    name: 'MediDrone',
    logo: 'https://ui-avatars.com/api/?name=Medi+Drone&background=ef4444&color=fff',
    description: 'Autonomous blood delivery drones.',
    foundedYear: 2022,
    location: 'Bangalore',
    fundsAllocated: 5.0,
    fundsUtilized: 2.5,
    burnRateMonthly: 20,
    runwayMonths: 12,
    lastReviewDate: '2024-01-08',
    reviewerComment: 'Regulation approvals pending DGCA. Timeline slipped by 2 months.',
    fundingRequest: {
      id: 'fr2',
      amount: '2 Cr',
      reason: 'Expansion of fleet to 50 drones for state-wide pilot.',
      submittedDate: '2024-01-02',
      isUrgent: false
    },
    projects: [
      { id: 'p3', name: 'SkyLift V3', domain: 'Mobility', currentAIRL: 7, previousAIRL: 5, status: 'Yellow', description: 'Long range VTOL drone.' }
    ]
  },
  {
    id: 's4',
    name: 'RoboClean',
    logo: 'https://ui-avatars.com/api/?name=Robo+Clean&background=f59e0b&color=fff',
    description: 'Solar panel cleaning robots.',
    foundedYear: 2023,
    location: 'Mysore',
    fundsAllocated: 2.5,
    fundsUtilized: 0.5, 
    burnRateMonthly: 5,
    runwayMonths: 24,
    lastReviewDate: '2023-12-20',
    reviewerComment: 'Execution is slow. Funds are sitting in the bank.',
    projects: [
      { id: 'p4', name: 'SunBot', domain: 'CleanTech', currentAIRL: 3, previousAIRL: 2, status: 'Yellow', description: 'Autonomous cleaning bot.' }
    ]
  },
  {
    id: 's5',
    name: 'VisionAI',
    logo: 'https://ui-avatars.com/api/?name=Vision+AI&background=8b5cf6&color=fff',
    description: 'Computer vision for factory safety.',
    foundedYear: 2024,
    location: 'Bangalore',
    fundsAllocated: 2.0,
    fundsUtilized: 1.8,
    burnRateMonthly: 12,
    runwayMonths: 3,
    lastReviewDate: '2024-01-14',
    reviewerComment: 'Strong pilot pipeline. Need to close Series A.',
    fundingRequest: {
      id: 'fr3',
      amount: '1 Cr',
      reason: 'Hiring senior sales lead and IP filing costs.',
      submittedDate: '2024-01-15',
      isUrgent: true
    },
    projects: [
      { id: 'p5', name: 'SafeSight', domain: 'Robotics', currentAIRL: 4, previousAIRL: 3, status: 'Green', description: 'AI Camera system.' }
    ]
  },
  {
    id: 's6',
    name: 'AquaPure',
    logo: 'https://ui-avatars.com/api/?name=Aqua+Pure&background=06b6d4&color=fff',
    description: 'Wastewater treatment nanotechnology.',
    foundedYear: 2023,
    location: 'Mangalore',
    fundsAllocated: 3.5,
    fundsUtilized: 3.0,
    burnRateMonthly: 8,
    runwayMonths: 5,
    lastReviewDate: '2024-01-02',
    reviewerComment: 'Technology validation completed at IISc labs.',
    projects: [
      { id: 'p6', name: 'NanoFilter', domain: 'CleanTech', currentAIRL: 5, previousAIRL: 5, status: 'Green', description: 'Membrane filter.' }
    ]
  },
  {
    id: 's7',
    name: 'OrthoTech',
    logo: 'https://ui-avatars.com/api/?name=Ortho+Tech&background=ec4899&color=fff',
    description: 'Custom 3D printed implants.',
    foundedYear: 2022,
    location: 'Bangalore',
    fundsAllocated: 4.0,
    fundsUtilized: 3.5,
    burnRateMonthly: 18,
    runwayMonths: 4,
    lastReviewDate: '2023-12-28',
    reviewerComment: 'Meeting all milestones. Regulatory audit passed.',
    projects: [
      { id: 'p7', name: 'SpineFix', domain: 'Healthcare', currentAIRL: 8, previousAIRL: 7, status: 'Green', description: 'Titanium spine implant.' }
    ]
  },
  {
    id: 's8',
    name: 'FarmDrone',
    logo: 'https://ui-avatars.com/api/?name=Farm+Drone&background=84cc16&color=fff',
    description: 'Pesticide spraying drones.',
    foundedYear: 2024,
    location: 'Belgaum',
    fundsAllocated: 2.5,
    fundsUtilized: 1.0,
    burnRateMonthly: 6,
    runwayMonths: 18,
    lastReviewDate: '2024-01-10',
    reviewerComment: 'Early stage. Prototype crashed twice. Needs mentorship.',
    projects: [
      { id: 'p8', name: 'SprayMaster', domain: 'AgriTech', currentAIRL: 2, previousAIRL: 1, status: 'Red', description: 'Hexacopter sprayer.' }
    ]
  },
  {
    id: 's9',
    name: 'ExoSuit',
    logo: 'https://ui-avatars.com/api/?name=Exo+Suit&background=64748b&color=fff',
    description: 'Industrial exoskeletons for heavy lifting.',
    foundedYear: 2023,
    location: 'Bangalore',
    fundsAllocated: 5.0,
    fundsUtilized: 4.2,
    burnRateMonthly: 15,
    runwayMonths: 6,
    lastReviewDate: '2024-01-05',
    reviewerComment: 'Tata Motors signed LOI for 50 units. Great progress.',
    projects: [
      { id: 'p9', name: 'TitanArm', domain: 'Robotics', currentAIRL: 6, previousAIRL: 5, status: 'Green', description: 'Upper body exoskeleton.' }
    ]
  },
  {
    id: 's10',
    name: 'SmartTraffic',
    logo: 'https://ui-avatars.com/api/?name=Smart+Traffic&background=f43f5e&color=fff',
    description: 'AI for traffic signal optimization.',
    foundedYear: 2024,
    location: 'Bangalore',
    fundsAllocated: 3.0,
    fundsUtilized: 0.8,
    burnRateMonthly: 4,
    runwayMonths: 36,
    lastReviewDate: '2024-01-11',
    reviewerComment: 'Just started. Team is still hiring.',
    projects: [
      { id: 'p10', name: 'FlowControl', domain: 'Mobility', currentAIRL: 2, previousAIRL: 1, status: 'Green', description: 'Signal controller software.' }
    ]
  }
];