import type { SlideConfig } from '../types/SlideTypes';
import {
    Building2, GraduationCap, Lightbulb,
    Activity, Tractor, Zap, Cpu, Radio, Globe, ShieldCheck, Clock, Briefcase
} from 'lucide-react';

export const APPLICATION_FLOW: SlideConfig[] = [

    // --- SECTION 1: TEAM DETAILS (Common for all) ---
    {
        id: 'intro',
        sectionId: 'team',
        type: 'intro',
        title: 'Welcome, Founder',
        subtitle: 'Let\'s start by building your professional profile.',
    },
    {
        id: 'identity',
        sectionId: 'team',
        type: 'form',
        title: 'Lead Founder Details',
        subtitle: 'This information will be used for all official communication.',
        props: {
            inputs: [
                { label: 'Full Name', field: 'founder.fullName', required: true },
                { label: 'Email Address', field: 'founder.email', type: 'email', required: true },
                { label: 'Phone Number', field: 'founder.phone', type: 'tel', required: true },
                { label: 'Current Role', field: 'founder.currentRole', placeholder: 'e.g. CEO / Researcher' },
                // NEW: Added City and Country (PDF Section A.7)
                { label: 'City', field: 'founder.city', required: true },
                { label: 'Country', field: 'founder.country', placeholder: 'India' },
            ]
        }
    },
    {
        id: 'background',
        sectionId: 'team',
        type: 'form',
        title: 'Background & Experience',
        subtitle: 'Tell us about your educational and professional journey.',
        props: {
            inputs: [
                { label: 'Education Level', field: 'founder.educationLevel', placeholder: 'e.g. PhD, Masters' },
                { label: 'College / University', field: 'founder.college' },
                // NEW: Added Discipline (PDF Section B.10)
                { label: 'Field / Discipline', field: 'founder.discipline', placeholder: 'e.g. Computer Science' },
                { label: 'Years of Experience', field: 'founder.yearsExperience', type: 'number' },
                { label: 'Primary Strength', field: 'founder.primaryStrength', placeholder: 'e.g. AI, Robotics, Business' },
            ]
        }
    },
    {
        id: 'links',
        sectionId: 'team',
        type: 'form',
        title: 'Proof of Work',
        subtitle: 'Where can we see your previous work?',
        props: {
            inputs: [
                { label: 'LinkedIn Profile', field: 'founder.linkedinUrl', required: true },
                { label: 'GitHub / Portfolio', field: 'founder.portfolioUrl' },
                // NEW: Added Scholar (PDF Section C.15)
                { label: 'Google Scholar / Publications', field: 'founder.scholarUrl' },
            ]
        }
    },
    {
        id: 'bio',
        sectionId: 'team',
        type: 'essay',
        title: 'Professional Bio',
        subtitle: 'Briefly describe your technical or professional background.',
        props: {
            questions: [
                { label: 'Short Bio (Max 150 words)', field: 'founder.bio', minChars: 50 }
            ]
        }
    },
    {
        id: 'co_founders',
        sectionId: 'team',
        type: 'list',
        title: 'Co-Founders',
        subtitle: 'Are you building this alone or with a team?',
    },
    // NEW SLIDE: Team History (PDF Section E)
    {
        id: 'team_structure',
        sectionId: 'team',
        type: 'essay',
        title: 'Team Structure',
        subtitle: 'History and Equity',
        // Only show this slide if there are co-founders
        condition: (data) => data.coFounders.length > 0,
        props: {
            questions: [
                {
                    label: 'How long have the founders known each other and in what capacity?',
                    field: 'venture.teamHistory', // Ensure this field is added to store type
                    minChars: 20
                }
            ]
        }
    },

    // --- SECTION 2: TRACK SELECTION (The Fork) ---
    {
        id: 'track_selection',
        sectionId: 'track',
        type: 'option',
        title: 'Select your Track',
        subtitle: 'Choose the path that best describes your current stage.',
        props: {
            options: [
                {
                    id: 'startup',
                    label: 'Pre-Series A Startup',
                    description: 'Incorporated company (Pvt Ltd / LLP) looking to scale.',
                    icon: Building2
                },
                {
                    id: 'researcher',
                    label: 'Academic Researcher',
                    description: 'Faculty/Student translating lab IP to market.',
                    icon: GraduationCap
                },
                {
                    id: 'innovator_residence',
                    label: 'Innovator-in-Residence',
                    description: 'Individual/Team with an idea, looking to build a prototype.',
                    icon: Lightbulb
                }
            ]
        }
    },

    // --- SECTION 3: VENTURE DETAILS (Dynamic Branching) ---

    // Branch A: STARTUP Only
    {
        id: 'startup_details',
        sectionId: 'venture',
        type: 'form',
        title: 'Company Details',
        subtitle: 'Tell us about your registered entity.',
        condition: (data) => data.venture.track === 'startup',
        props: {
            inputs: [
                { label: 'Registered Startup Name', field: 'venture.organizationName', required: true },
                { label: 'Incorporation Year', field: 'venture.registrationYear', type: 'number' },
                { label: 'Legal Entity Type', field: 'venture.legalEntity', placeholder: 'Pvt Ltd, LLP' },
                { label: 'Website URL', field: 'venture.website' },
            ]
        }
    },
    {
        id: 'startup_funding',
        sectionId: 'venture',
        type: 'essay',
        title: 'Funding Status',
        subtitle: 'Have you raised any external capital?',
        condition: (data) => data.venture.track === 'startup',
        props: {
            questions: [
                { label: 'Funding Details (Investors, Amounts)', field: 'venture.fundingDetails', placeholder: 'Seed, Angel, Grants...' }
            ]
        }
    },

    // Branch B: RESEARCHER Only
    {
        id: 'researcher_details',
        sectionId: 'venture',
        type: 'form',
        title: 'Institute Details',
        subtitle: 'Tell us about your academic affiliation.',
        condition: (data) => data.venture.track === 'researcher',
        props: {
            inputs: [
                { label: 'Project / Team Name', field: 'venture.organizationName', required: true },
                { label: 'Institute Name', field: 'venture.instituteName', required: true },
                { label: 'Is DSIR Certified? (Yes/No)', field: 'venture.isDsirCertified' }, // Can be toggle in future
            ]
        }
    },

    // Branch C: INNOVATOR-IN-RESIDENCE Only
    {
        id: 'innovator_details',
        sectionId: 'venture',
        type: 'form',
        title: 'Project Details',
        subtitle: 'What are you calling your initiative?',
        condition: (data) => data.venture.track === 'innovator_residence',
        props: {
            inputs: [
                { label: 'Proposed Project / Team Name', field: 'venture.organizationName', required: true },
                { label: 'Current Location', field: 'innovator.city', placeholder: 'Where will you be working from?' },
            ]
        }
    },

    // [NEW] Branch C Extension: Motivation (PDF Section I)
    {
        id: 'iir_motivation',
        sectionId: 'venture',
        type: 'essay',
        title: 'Motivation & Needs',
        subtitle: 'Why ARTPARK and what do you need?',
        condition: (data) => data.venture.track === 'innovator_residence',
        props: {
            questions: [
                {
                    label: 'Why do you want to pursue this at ARTPARK? (Max 300 chars)',
                    field: 'venture.motivation',
                    minChars: 20,
                    placeholder: 'Explain your fit with the ecosystem...'
                },
                {
                    label: 'Support Needed (Technical, Mentorship, Manpower)',
                    field: 'venture.supportNeeded',
                    placeholder: 'What specific resources will help you succeed?'
                }
            ]
        }
    },

    // [NEW] Branch C Extension: Commitment (PDF Section I.30)
    {
        id: 'iir_commitment',
        sectionId: 'venture',
        type: 'option',
        title: 'Time Commitment',
        subtitle: 'Are you willing to engage full-time?',
        condition: (data) => data.venture.track === 'innovator_residence',
        props: {
            options: [
                { id: 'Yes, Full-time', label: 'Yes, Full-time', icon: Clock },
                { id: 'Near Full-time', label: 'Near Full-time', icon: Clock },
                { id: 'Part-time', label: 'Part-time / Depends', icon: Briefcase },
            ]
        }
    },

    // --- COMMON QUESTIONS (All Tracks) ---
    {
        id: 'vertical',
        sectionId: 'venture',
        type: 'option',
        title: 'Primary Vertical',
        subtitle: 'Which industry does your solution impact?',
        props: {
            options: [
                { id: 'mobility', label: 'Mobility & Transport', icon: Tractor },
                { id: 'healthcare', label: 'Healthcare & MedTech', icon: Activity },
                { id: 'industrial', label: 'Industrial Automation', icon: Zap },
                { id: 'agriculture', label: 'Agriculture', icon: Tractor },
                { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
                { id: 'other', label: 'Other', icon: Globe },
            ]
        }
    },
    {
        id: 'tech_category',
        sectionId: 'venture',
        type: 'option',
        title: 'Core Technology',
        subtitle: 'Select up to two technology focus areas.',
        props: {
            multiSelect: true,
            options: [
                { id: 'robotics', label: 'Robotics / Hardware', icon: Cpu },
                { id: 'ai_ml', label: 'AI / Machine Learning', icon: Cpu },
                { id: 'autonomous', label: 'Autonomous Systems', icon: Radio },
                { id: 'connectivity', label: '5G / Connectivity', icon: Radio },
                { id: 'ar_vr', label: 'AR / VR', icon: Globe },
                { id: 'cybersecurity', label: 'Cybersecurity', icon: ShieldCheck },
            ]
        }
    },
    {
        id: 'problem_solution',
        sectionId: 'venture',
        type: 'essay',
        title: 'The Pitch',
        subtitle: 'Describe the core problem and your proposed solution.',
        props: {
            questions: [
                { label: 'Problem Statement (Who is affected?)', field: 'venture.problemStatement', minChars: 50 },
                { label: 'Proposed Solution (How does it work?)', field: 'venture.solutionDescription', minChars: 50 },
            ]
        }
    },
    {
        id: 'innovation',
        sectionId: 'venture',
        type: 'essay',
        title: 'Innovation & Risks',
        subtitle: 'What makes this unique and what are the challenges?',
        props: {
            questions: [
                { label: 'Technical Differentiator / USP', field: 'venture.techInnovation' },
                { label: 'Key Technical or Market Risks', field: 'venture.keyRisks' },
            ]
        }
    },
    {
        id: 'trl_level',
        sectionId: 'market',
        type: 'option',
        title: 'Current Maturity (TRL)',
        subtitle: 'Select the Technology Readiness Level.',
        props: {
            options: [
                { id: 'trl_1_2', label: 'TRL 1-2', description: 'Basic Principles / Concept' },
                { id: 'trl_3_4', label: 'TRL 3-4', description: 'Proof of Concept / Lab Validation' },
                { id: 'trl_5_6', label: 'TRL 5-6', description: 'Prototype / Simulated Environment' },
                { id: 'trl_7_9', label: 'TRL 7-9', description: 'Operational / Market Ready' },
            ]
        }
    },
    {
        id: 'market_validation',
        sectionId: 'market',
        type: 'essay',
        title: 'Market & Validation',
        subtitle: 'Who are your customers and have you validated the need?',
        props: {
            questions: [
                { label: 'Target Audience / Beneficiaries', field: 'venture.targetUsers' },
                { label: 'Validation (Pilots, POs, Customer Interviews)', field: 'venture.marketValidation' },
            ]
        }
    },

    // --- SECTION 4: UPLOADS & DECLARATIONS ---
    {
        id: 'uploads',
        sectionId: 'uploads',
        type: 'upload',
        title: 'Evidence',
        subtitle: 'Upload your supporting documents.',
        props: {
            files: [
                { key: 'pitchDeck', label: 'Pitch Deck (PDF)', accept: '.pdf' },
                { key: 'budgetDoc', label: '1-Year Budget Plan', accept: '.pdf,.xlsx' },
                { key: 'demoVideo', label: 'Demo Video (Link/MP4)', accept: 'video/*' },
                // NEW: Added Supporting Material (PDF Section H.25)
                { key: 'otherDocs', label: 'Supporting Material (Zip/PDF)', accept: '.zip,.pdf,.rar' },
            ]
        }
    },
    // [NEW] REVIEW SLIDE
    {
        id: 'final_review',
        sectionId: 'uploads',
        type: 'review',
        title: 'Review Application',
        subtitle: 'Verify your details before final submission.',
    },
    // [NEW] SECTION K: Declarations
    {
        id: 'declarations',
        sectionId: 'uploads',
        type: 'consent',
        title: 'Declarations & Consent',
        subtitle: 'Final confirmation before submission.',
        props: {
            items: [
                {
                    id: 'isAccurate',
                    label: 'I confirm that the information provided in this application is accurate and true to the best of my knowledge.'
                },
                {
                    id: 'agreesToTerms',
                    label: 'I understand that support (Innovator-in-Residence or otherwise) does not guarantee future funding or incubation beyond the program scope.'
                },
                {
                    id: 'agreesToCommunication',
                    label: 'I agree to receive official communication from ARTPARK regarding this application and future programs.'
                }
            ]
        }
    }
];