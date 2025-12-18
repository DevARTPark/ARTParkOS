export interface StartupEntry {
  id: string;
  name: string;
  domain: string;
  airlLevel: number;
  healthStatus: 'Green' | 'Yellow' | 'Red';
  lastReviewDate: string;
  hasPendingReview: boolean; // Determines "Pending Reviews" count
  isHighPriority?: boolean;
}

export const reviewerStartups: StartupEntry[] = [
  // --- Active Startups ---
  { 
    id: 's1', 
    name: 'GreenField Tech', 
    domain: 'AgriTech', 
    airlLevel: 3, 
    healthStatus: 'Green', 
    lastReviewDate: 'Oct 15', 
    hasPendingReview: true, 
    isHighPriority: true 
  },
  { 
    id: 's2', 
    name: 'MediDrone Systems', 
    domain: 'MedTech', 
    airlLevel: 5, 
    healthStatus: 'Yellow', 
    lastReviewDate: 'Sep 30', 
    hasPendingReview: true,
    isHighPriority: false
  },
  { 
    id: 's3', 
    name: 'AutoBotics', 
    domain: 'Robotics', 
    airlLevel: 2, 
    healthStatus: 'Red', 
    lastReviewDate: 'Oct 01', 
    hasPendingReview: false 
  },
  { 
    id: 's4', 
    name: 'HealthAI', 
    domain: 'AI/ML', 
    airlLevel: 4, 
    healthStatus: 'Green', 
    lastReviewDate: 'Oct 10', 
    hasPendingReview: false 
  },
  { 
    id: 's5', 
    name: 'SolarFlow', 
    domain: 'CleanTech', 
    airlLevel: 6, 
    healthStatus: 'Yellow', 
    lastReviewDate: 'Sep 25', 
    hasPendingReview: true,
    isHighPriority: true 
  },
  { 
    id: 's6', 
    name: 'NanoFix', 
    domain: 'DeepTech', 
    airlLevel: 3, 
    healthStatus: 'Red', 
    lastReviewDate: 'Sep 20', 
    hasPendingReview: true, // Red + Pending Review
    isHighPriority: true
  },
  
  // --- Graduated Startups (AIRL 7+) ---
  { 
    id: 'g1', 
    name: 'SkyHigh Aerospace', 
    domain: 'Aerospace', 
    airlLevel: 8, 
    healthStatus: 'Green', 
    lastReviewDate: 'Aug 15', 
    hasPendingReview: false 
  },
  { 
    id: 'g2', 
    name: 'UrbanMobi', 
    domain: 'Mobility', 
    airlLevel: 7, 
    healthStatus: 'Green', 
    lastReviewDate: 'Aug 20', 
    hasPendingReview: false 
  },
  { 
    id: 'g3', 
    name: 'CyberShield', 
    domain: 'CyberSec', 
    airlLevel: 9, 
    healthStatus: 'Green', 
    lastReviewDate: 'Jul 10', 
    hasPendingReview: false 
  },
  
  // --- More Active ---
  { 
    id: 's7', 
    name: 'AgriSense', 
    domain: 'AgriTech', 
    airlLevel: 2, 
    healthStatus: 'Yellow', 
    lastReviewDate: 'Oct 18', 
    hasPendingReview: true 
  },
];