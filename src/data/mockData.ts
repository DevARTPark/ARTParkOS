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
  currentAIRL: 3,
  description: 'IoT sensors for precision agriculture monitoring soil health.',
  foundedDate: '2023-01-15'
}, {
  id: 'p2',
  name: 'MediDrone',
  domain: 'Healthcare',
  currentAIRL: 5,
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
// --- UPDATED QUESTIONS WITH EXPECTATIONS ---
export const airlQuestions: Question[] = [
  // --- LEVEL 1 ---
  {
    id: 'q1',
    airlLevel: 1,
    category: 'Technology',
    text: 'Have basic principles been observed and reported?',
    required: true,
    expectations: [
      "Cite specific academic papers or internal lab reports.",
      "Demonstrate a clear understanding of the underlying physics/chemistry.",
      "Identify the core hypothesis being tested.",
      "Ensure the principle aligns with current scientific consensus."
    ]
  },
  {
    id: 'q2',
    airlLevel: 1,
    category: 'Product Engineering',
    text: 'Has the initial product concept been defined?',
    required: true,
    expectations: [
      "Define the potential problem this technology solves.",
      "Outline the basic 'form factor' idea (e.g., software vs hardware).",
      "List the high-level features required for the solution.",
      "Identify any obvious technical blockers to feasibility."
    ]
  },
  {
    id: 'q3',
    airlLevel: 1,
    category: 'Market Research',
    text: 'Has a preliminary market need been identified?',
    required: true,
    expectations: [
      "Identify at least one broad customer segment (e.g., 'Logistics').",
      "Explain why current solutions might be insufficient.",
      "Map the technology to a generic value proposition.",
      "Provide anecdotal evidence of the need."
    ]
  },
  {
    id: 'q4',
    airlLevel: 1,
    category: 'Organisation Structure',
    text: 'Is the core founding team identified?',
    required: true,
    expectations: [
      "List the 1-3 key individuals driving the idea.",
      "Ideally, have a mix of technical and business intent.",
      "Ensure founders have the legal right to pursue this idea.",
      "Draft a basic equity split or understanding."
    ]
  },
  {
    id: 'q5',
    airlLevel: 1,
    category: 'Target Market Engagement',
    text: 'Have potential customer segments been listed?',
    required: true,
    expectations: [
      "Create a list of 10-20 potential companies or user types.",
      "Hypothesize who the 'buyer' vs the 'user' might be.",
      "No direct contact is required yet, just identification.",
      "Identify the geographic focus (e.g., India, Global)."
    ]
  },

  // --- LEVEL 2 ---
  {
    id: 'q6',
    airlLevel: 2,
    category: 'Technology',
    text: 'Has the technology concept been formulated?',
    required: true,
    expectations: [
      "Provide a schematic or conceptual drawing of the solution.",
      "List the key components required to build a prototype.",
      "Identify potential technical risks or bottlenecks.",
      "Outline the theoretical performance limits."
    ]
  },
  {
    id: 'q7',
    airlLevel: 2,
    category: 'Product Engineering',
    text: 'Are initial design sketches available?',
    required: true,
    expectations: [
      "Paper sketches or wireframes of the product.",
      "Basic flow diagrams of how the user interacts with it.",
      "Identification of physical dimensions (if hardware).",
      "Initial thoughts on materials or software stack."
    ]
  },
  {
    id: 'q8',
    airlLevel: 2,
    category: 'Market Research',
    text: 'Has a competitive landscape analysis been started?',
    required: true,
    expectations: [
      "Identify top 3-5 direct competitors.",
      "Identify indirect substitutes (e.g., 'doing nothing' or Excel).",
      "Create a feature comparison matrix.",
      "Highlight your intended Unique Selling Proposition (USP)."
    ]
  },
  {
    id: 'q9',
    airlLevel: 2,
    category: 'Organisation Structure',
    text: 'Are roles and responsibilities defined?',
    required: true,
    expectations: [
      "Who is the CEO vs. CTO?",
      "Identify gaps (e.g., 'We need a marketing lead').",
      "Agree on decision-making processes.",
      "Set a regular meeting cadence."
    ]
  },
  {
    id: 'q10',
    airlLevel: 2,
    category: 'Target Market Engagement',
    text: 'Have initial customer interviews been conducted?',
    required: true,
    expectations: [
      "Conduct at least 10 'Problem Discovery' interviews.",
      "Do not sell the solution yet; focus on validating the pain point.",
      "Record insights and quotes from users.",
      "Validate that the problem is 'urgent' and 'expensive'."
    ]
  },

  // --- LEVEL 4 ---
  {
    id: 'q401',
    airlLevel: 4,
    category: 'Technology',
    text: 'Has the system/subsystem been validated in a laboratory environment?',
    required: true,
    expectations: [
      "Demonstrate a 'Breadboard' prototype working in controlled conditions.",
      "Data must show the core function works repeatedly.",
      "Identify failure modes encountered during testing.",
      "Compare lab results with theoretical models."
    ]
  },
  {
    id: 'q402',
    airlLevel: 4,
    category: 'Product Engineering',
    text: 'Is the functional prototype fully integrated and tested?',
    required: true,
    expectations: [
      "Combine separate components into a single 'ugly' prototype.",
      "Ensure software and hardware talk to each other correctly.",
      "Prototype should be capable of end-to-end functionality.",
      "Document the Bill of Materials (BOM) for this version."
    ]
  },
  {
    id: 'q403',
    airlLevel: 4,
    category: 'Market Research',
    text: 'Have you completed a detailed competitive landscape analysis?',
    required: true,
    expectations: [
      "Deep dive into competitor pricing strategies.",
      "Analyze competitor marketing positioning and keywords.",
      "Identify gaps in competitor features using real user reviews.",
      "Validate your 'Unfair Advantage' against this data."
    ]
  },
  {
    id: 'q404',
    airlLevel: 4,
    category: 'Organisation Structure',
    text: 'Are key technical leads (CTO/Head of Eng) onboarded full-time?',
    required: true,
    expectations: [
      "Technical leadership must be dedicated (no moonlighting).",
      "Employment contracts or vesting schedules signed.",
      "Clear ownership of IP assignment to the company.",
      "Team capability assessment to reach next milestone."
    ]
  },
  {
    id: 'q405',
    airlLevel: 4,
    category: 'Target Market Engagement',
    text: 'Have you secured Letters of Intent (LOIs) for pilot programs?',
    required: true,
    expectations: [
      "Signed non-binding LOIs from potential pilot partners.",
      "Clear definition of 'Success Criteria' for the pilot in the LOI.",
      "Customer willingness to pay (or cost-share) indicated.",
      "Identification of the specific champion within the customer org."
    ]
  },

  // --- LEVEL 6 ---
  {
    id: 'q601',
    airlLevel: 6,
    category: 'Technology',
    text: 'Has the prototype been demonstrated in a relevant operational environment?',
    required: true,
    expectations: [
      "Test the device in real-world conditions (heat, dust, noise).",
      "Run the system by intended users, not just engineers.",
      "Log operational hours without critical failure.",
      "Validate safety and compliance in the field environment."
    ]
  },
  {
    id: 'q602',
    airlLevel: 6,
    category: 'Product Engineering',
    text: 'Has the "Design for Manufacturing" (DFM) process been initiated?',
    required: true,
    expectations: [
      "Simplify part count for assembly.",
      "Identify long-lead-time components and supply chain risks.",
      "Move from 3D printing to injection molding/scalable processes.",
      "Cost-down analysis for volume production."
    ]
  },
  {
    id: 'q603',
    airlLevel: 6,
    category: 'Market Research',
    text: 'Has the pricing model been validated with paying customers?',
    required: true,
    expectations: [
      "Execute actual transactions (even if discounted).",
      "Validate unit economics (CAC vs LTV projections).",
      "Confirm the billing frequency (SaaS vs One-time).",
      "Analyze friction points in the purchasing process."
    ]
  },
  {
    id: 'q604',
    airlLevel: 6,
    category: 'Organisation Structure',
    text: 'Is the sales or business development team established?',
    required: true,
    expectations: [
      "Hire at least one dedicated Sales/BD person.",
      "Implement a CRM system (HubSpot, Salesforce, etc.).",
      "Define the sales cycle stages.",
      "Set revenue targets for the next 2 quarters."
    ]
  },
  {
    id: 'q605',
    airlLevel: 6,
    category: 'Target Market Engagement',
    text: 'Are there active paid pilots or early adopter sales?',
    required: true,
    expectations: [
      "Converted LOIs into paid contracts.",
      "Deployment of units to customer sites.",
      "Regular feedback loops established with these early adopters.",
      "Testimonials or case studies secured from early wins."
    ]
  }
];
export const actionItems: ActionItem[] = [{
  id: 'a1',
  title: 'Submit AIRL 3 Evidence',
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
  airlLevel: 3,
  status: 'pending',
  deadline: '2023-10-30'
}, {
  id: 'r2',
  assessmentId: 'as2',
  reviewerId: 'rev1',
  startupName: 'SkyHealth Systems',
  projectName: 'MediDrone',
  airlLevel: 5,
  status: 'completed',
  deadline: '2023-10-15',
  submittedDate: '2023-10-14'
}];