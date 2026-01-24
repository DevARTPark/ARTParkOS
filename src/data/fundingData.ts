// src/data/fundingData.ts

export interface FundingHistoryItem {
  date: string;
  amount: number; // Total amount in Crores
  reAmount: number; // Recurring portion
  nreAmount: number; // Non-recurring portion
  description: string;
  transactionRef: string;
  status: 'Received' | 'Pending' | 'Scheduled';
}

export interface FundingSource {
  id: string;
  name: string;
  shortName: string;
  totalSanctioned: number; // Cr
  sanctionedRE: number; // Recurring (Salaries, Ops)
  sanctionedNRE: number; // Non-Recurring (Equipment, Infra)
  totalReceived: number; // Cr
  expiryDate: string;
  colorTheme: 'blue' | 'emerald' | 'purple' | 'amber';
  description: string;
  history: FundingHistoryItem[];
}

export const fundingSourcesDetailed: FundingSource[] = [
  {
    id: 'fs_1',
    name: 'Government of Karnataka (GoK)',
    shortName: 'GoK',
    totalSanctioned: 50.0,
    sanctionedRE: 30.0,
    sanctionedNRE: 20.0,
    totalReceived: 35.0,
    expiryDate: '2025-06-30',
    colorTheme: 'blue',
    description: 'State government policy for infrastructure (NRE) and seed funding/ops (RE).',
    history: [
      { date: '2023-04-10', amount: 15.0, reAmount: 5.0, nreAmount: 10.0, description: 'Tranche 1: Infrastructure Setup', transactionRef: 'GOK-FY23-001', status: 'Received' },
      { date: '2024-01-15', amount: 20.0, reAmount: 15.0, nreAmount: 5.0, description: 'Tranche 2: Seed Fund & Ops', transactionRef: 'GOK-FY24-056', status: 'Received' },
      { date: '2024-09-01', amount: 15.0, reAmount: 10.0, nreAmount: 5.0, description: 'Tranche 3: Final Disbursement', transactionRef: 'PENDING', status: 'Scheduled' },
    ]
  },
  {
    id: 'fs_2',
    name: 'Dept of Science & Technology (DST)',
    shortName: 'DST',
    totalSanctioned: 50.0,
    sanctionedRE: 25.0,
    sanctionedNRE: 25.0,
    totalReceived: 35.0,
    expiryDate: '2025-03-31',
    colorTheme: 'emerald',
    description: 'NIDHI-TBI scheme. Heavy focus on lab equipment (NRE) and utility costs (RE).',
    history: [
      { date: '2022-11-20', amount: 20.0, reAmount: 5.0, nreAmount: 15.0, description: 'Capital Grant for Machinery', transactionRef: 'DST-NIDHI-88', status: 'Received' },
      { date: '2023-08-05', amount: 15.0, reAmount: 10.0, nreAmount: 5.0, description: 'Operational Expenses (Year 1-2)', transactionRef: 'DST-OPEX-12', status: 'Received' },
      { date: '2024-12-01', amount: 15.0, reAmount: 10.0, nreAmount: 5.0, description: 'Operational Expenses (Year 3)', transactionRef: 'PENDING', status: 'Scheduled' },
    ]
  },
  {
    id: 'fs_3',
    name: 'RDI Scheme',
    shortName: 'RDI',
    totalSanctioned: 20.0,
    sanctionedRE: 15.0,
    sanctionedNRE: 5.0,
    totalReceived: 10.0,
    expiryDate: '2026-12-31',
    colorTheme: 'purple',
    description: 'Deep tech research. Mostly recurring costs for research staff salaries.',
    history: [
      { date: '2024-02-01', amount: 10.0, reAmount: 8.0, nreAmount: 2.0, description: 'Innovation Corpus Init', transactionRef: 'RDI-CORP-01', status: 'Received' },
      { date: '2025-02-01', amount: 10.0, reAmount: 7.0, nreAmount: 3.0, description: 'Performance Linked Top-up', transactionRef: 'PENDING', status: 'Pending' },
    ]
  }
];