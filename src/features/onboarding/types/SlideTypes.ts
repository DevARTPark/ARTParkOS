import type { ApplicationState } from '../../../store/useApplicationStore';

export type SlideType =
    | 'intro'    // Welcome screen
    | 'form'     // Grouped text inputs (Name, Email, etc.)
    | 'option'   // Card selection (Track, Vertical)
    | 'essay'    // Long text areas (Problem, Solution)
    | 'list'     // Dynamic list (Co-founders)
    | 'upload'   // File upload zone
    | 'info'    // Transition/Success screens
    | 'review'
    | 'consent';

export interface InputConfig {
    label: string;
    field: string; // Path to store key (e.g., 'founder.fullName')
    type?: string; // 'text', 'email', 'number', 'tel', 'date'
    placeholder?: string;
    required?: boolean;
}

export interface OptionConfig {
    id: string;
    label: string;
    icon?: any; // React Node or Lucide icon name
    description?: string;
}

export interface SlideConfig {
    id: string;
    sectionId: string; // 'team', 'venture', 'market', 'uploads'
    type: SlideType;
    title: string;
    subtitle?: string;

    // Logic: Should this slide be shown?
    // We pass the entire store state so we can check 'venture.track' or anything else
    condition?: (data: ApplicationState) => boolean;

    // Props specific to certain slide types
    props?: {
        inputs?: InputConfig[];       // For 'form'
        options?: OptionConfig[];     // For 'option'
        multiSelect?: boolean;        // For 'option'
        questions?: {                 // For 'essay'
            label: string;
            field: string;
            placeholder?: string;
            minChars?: number
        }[];
        files?: {                     // For 'upload'
            key: string;
            label: string;
            accept: string
        }[];
        items?: {
            id: string;
            label: string;
        }[];
    };
}