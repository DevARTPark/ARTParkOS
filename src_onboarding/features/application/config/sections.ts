import { Users, LayoutDashboard, Rocket, FileText, Activity } from 'lucide-react';

export interface SectionConfig {
    id: string;
    label: string;
    icon: any;
}

export const SECTIONS: SectionConfig[] = [
    {
        id: 'team',
        label: 'Team Details',
        icon: Users
    },
    {
        id: 'track',
        label: 'Select Track',
        icon: LayoutDashboard
    },
    {
        id: 'venture',
        label: 'Venture Details',
        icon: Rocket
    },
    {
        id: 'market',
        label: 'Market & Tech',
        icon: Activity
    },
    {
        id: 'uploads',
        label: 'Evidence & Submit',
        icon: FileText
    }
];