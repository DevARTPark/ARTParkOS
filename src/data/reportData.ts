// src/data/reportData.ts

export interface ProjectUpdate {
  projectId: string;
  projectName: string;
  highlights: string; // Editable by Founder
  risks: string;      // Editable by Founder (Lowlights)
  scheduleFile: string | null; // Editable (Upload)
  systemRisk: 'Low' | 'Medium' | 'High'; // Read-only from System
}

export interface ReportData {
  reportId: string;
  month: string;
  status: 'Draft' | 'Submitted';
  
  // 1. Project-wise Updates
  projectUpdates: ProjectUpdate[];

  // 2. Budget (Overall Startup) - Read-only
  budget: {
    totalSanctioned: string;
    utilized: string;
    percentage: number;
    status: 'On Track' | 'Overrun' | 'Underspent';
  };

  // 3. Risk (Overall Startup) - Read-only
  overallSystemRisk: 'Low' | 'Medium' | 'High';

  // 4. Reviewer Remarks - Read-only
  artparkRemarks: string;
}

// --- MOCK DATA ---

export const currentReport: ReportData = {
  reportId: "rep-2023-10",
  month: "October 2023",
  status: "Draft",
  
  projectUpdates: [
    {
      projectId: "p1",
      projectName: "AgriSense IoT",
      highlights: "Deployed 50 sensors in Mandya district. Initial data stream stable.",
      risks: "Supply chain delay for LoRaWAN modules (2 weeks).",
      scheduleFile: "AgriSense_Gantt_Oct.pdf",
      systemRisk: "Low"
    },
    {
      projectId: "p2",
      projectName: "MediDrone",
      highlights: "Completed BVLOS trials in controlled airspace.",
      risks: "Battery heating issue observed during rapid ascent.",
      scheduleFile: null,
      systemRisk: "High" // System flagged this due to safety incident?
    }
  ],

  budget: {
    totalSanctioned: "₹50,00,000",
    utilized: "₹32,50,000",
    percentage: 65,
    status: 'On Track'
  },

  overallSystemRisk: "Medium", // Aggregated risk

  artparkRemarks: "Please provide more details on the battery heating issue in MediDrone. Ensure safety protocols are updated before the next pilot."
};