import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- TYPES ---
export type UserRole = 'founder' | 'innovator';
export type VentureTrack = 'startup' | 'researcher' | 'innovator_residence';

// Innovator Profile (Page 10)
export interface InnovatorProfile {
    teamName: string;
    leadName: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    professionalStatus: string;
    currentRole: string;
    organization: string;
    city: string;
    country: string;
    isIncubated: boolean | null;
    incubatorName: string;
    hasGrants: boolean | null;
    grantDetails: string;
    primarySkill: string;
    yearsExperience: string;
    bio: string;
}

// Co-Founder Structure (Page 2)
export interface CoFounder {
    id: string;
    name: string;
    email: string;
    role: string;
    affiliation: string;
    skillArea: string;
    isFullTime: boolean;
}

// Founder Profile (Page 1)
export interface FounderProfile {
    fullName: string;
    email: string;
    phone: string;
    currentRole: string;
    affiliation: string;
    organization: string;
    city: string;
    country: string;
    educationLevel: string;
    college: string;
    discipline: string;
    yearsExperience: string;
    primaryStrength: string;
    linkedinUrl: string;
    githubUrl: string;
    scholarUrl: string;
    portfolioUrl: string;
    bio: string;
}

// Venture Profile (Pages 4-9)
export interface VentureProfile {
    track: VentureTrack | null;
    organizationName: string;
    registrationYear: string;
    legalEntity: string;
    website: string;
    instituteName: string;
    isDsirCertified: boolean;
    hasFunding: boolean;
    fundingDetails: string;
    incubatorName: string;
    vertical: string;
    techCategory: string[];
    currentStage: string;
    trlLevel: string;
    problemStatement: string;
    solutionDescription: string;
    techInnovation: string;
    keyRisks: string;
    targetUsers: string;
    marketValidation: string;
    teamHistory: string;
    motivation: string;
    supportNeeded: string;
    commitment: string;
}

// Uploads
export interface Uploads {
    pitchDeck: string | null;
    budgetDoc: string | null;
    demoVideo: string | null;
    otherDocs: string | null;
}

export interface Declarations {
    isAccurate: boolean;
    agreesToTerms: boolean;
    agreesToCommunication: boolean;
}

export interface ApplicationState {
    role: UserRole | null;
    currentStep: number;

    innovator: InnovatorProfile;
    founder: FounderProfile;
    coFounders: CoFounder[];
    venture: VentureProfile;
    uploads: Uploads;
    declarations: Declarations;

    // Actions
    setRole: (role: UserRole) => void;
    updateInnovator: (fields: Partial<InnovatorProfile>) => void;
    updateFounder: (fields: Partial<FounderProfile>) => void;
    addCoFounder: () => void;
    removeCoFounder: (id: string) => void;
    updateCoFounder: (id: string, fields: Partial<CoFounder>) => void;
    updateVenture: (fields: Partial<VentureProfile>) => void;
    updateUploads: (fields: Partial<Uploads>) => void;
    updateDeclarations: (fields: Partial<Declarations>) => void;
    resetForm: () => void;
}

const initialState = {
    role: 'founder' as UserRole,
    currentStep: 1,

    innovator: {
        teamName: '', leadName: '', email: '', phone: '', linkedinUrl: '', professionalStatus: '',
        currentRole: '', organization: '', city: '', country: 'India',
        isIncubated: null, incubatorName: '', hasGrants: null, grantDetails: '',
        primarySkill: '', yearsExperience: '', bio: ''
    },

    founder: {
        fullName: '', email: '', phone: '', currentRole: '', affiliation: '',
        organization: '', city: '', country: 'India', educationLevel: '', college: '',
        discipline: '', yearsExperience: '', primaryStrength: '', linkedinUrl: '',
        githubUrl: '', scholarUrl: '', portfolioUrl: '', bio: ''
    },

    coFounders: [] as CoFounder[],

    venture: {
        track: null,
        organizationName: '', registrationYear: '', legalEntity: '', website: '',
        instituteName: '', isDsirCertified: false,
        hasFunding: false, fundingDetails: '', incubatorName: '',
        vertical: '', techCategory: [],
        currentStage: '', trlLevel: '',
        problemStatement: '', solutionDescription: '', techInnovation: '', keyRisks: '',
        targetUsers: '', marketValidation: '',
        teamHistory: '',
        motivation: '', supportNeeded: '', commitment: ''
    },

    uploads: { pitchDeck: null, budgetDoc: null, demoVideo: null, otherDocs: null },

    declarations: {
        isAccurate: false,
        agreesToTerms: false,
        agreesToCommunication: false
    }
};

// --- STORE IMPLEMENTATION ---

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set) => ({
            ...initialState, // Use the initial state here

            setRole: (role) => set({ role }),

            updateInnovator: (fields) => set((state) => ({
                innovator: { ...state.innovator, ...fields }
            })),

            updateFounder: (fields) => set((state) => ({
                founder: { ...state.founder, ...fields }
            })),

            addCoFounder: () => set((state) => ({
                coFounders: [
                    ...state.coFounders,
                    { id: crypto.randomUUID(), name: '', email: '', role: '', affiliation: '', skillArea: '', isFullTime: true }
                ]
            })),

            removeCoFounder: (id) => set((state) => ({
                coFounders: state.coFounders.filter(c => c.id !== id)
            })),

            updateCoFounder: (id, fields) => set((state) => ({
                coFounders: state.coFounders.map(c => c.id === id ? { ...c, ...fields } : c)
            })),

            updateVenture: (fields) => set((state) => ({
                venture: { ...state.venture, ...fields }
            })),

            updateUploads: (fields) => set((state) => ({
                uploads: { ...state.uploads, ...fields }
            })),

            updateDeclarations: (fields) => set((state) => ({
                declarations: { ...state.declarations, ...fields }
            })),

            // --- 2. UPDATE RESET FORM TO CLEAR EVERYTHING ---
            resetForm: () => set({ ...initialState })
        }),
        {
            name: 'artpark-onboarding-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);