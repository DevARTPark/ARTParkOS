import type { SlideConfig } from '../types/SlideTypes';
import { User, Briefcase, Award, Zap } from 'lucide-react';

export const INNOVATOR_FLOW: SlideConfig[] = [
    // --- SECTION 1: IDENTITY ---
    {
        id: 'intro',
        sectionId: 'team',
        type: 'intro',
        title: 'Innovator Track',
        subtitle: 'Find your team and solve big problems.',
    },
    {
        id: 'identity',
        sectionId: 'team',
        type: 'form',
        title: 'Personal Details',
        subtitle: 'Tell us a bit about yourself.',
        props: {
            inputs: [
                // FIX: Changed 'innovator.fullName' to 'innovator.leadName' to match Store
                { label: 'Full Name', field: 'innovator.leadName', required: true },
                { label: 'Email Address', field: 'innovator.email', type: 'email', required: true },
                { label: 'Phone Number', field: 'innovator.phone', type: 'tel', required: true },
                { label: 'LinkedIn Profile', field: 'innovator.linkedinUrl' },
            ]
        }
    },

    // --- SECTION 2: PROFESSIONAL STATUS ---
    {
        id: 'status',
        sectionId: 'team',
        type: 'option',
        title: 'Current Status',
        subtitle: 'Which describes you best?',
        props: {
            options: [
                { id: 'Student', label: 'Student', icon: User },
                { id: 'Working Professional', label: 'Working Professional', icon: Briefcase },
                { id: 'Researcher', label: 'Researcher', icon: Zap },
                { id: 'Entrepreneur', label: 'Entrepreneur', icon: Award },
                { id: 'Independent', label: 'Independent / Freelancer', icon: User },
            ]
        }
    },
    {
        id: 'role_details',
        sectionId: 'team',
        type: 'form',
        title: 'Role Details',
        subtitle: 'Where are you currently working or studying?',
        props: {
            inputs: [
                { label: 'Current Designation / Role', field: 'innovator.currentRole', required: true },
                { label: 'Organization / College Name', field: 'innovator.organization', required: true },
            ]
        }
    },

    // --- SECTION 3: SKILLS & LOCATION ---
    {
        id: 'location',
        sectionId: 'team',
        type: 'form',
        title: 'Location',
        subtitle: 'Where are you based?',
        props: {
            inputs: [
                { label: 'City', field: 'innovator.city', required: true },
                { label: 'Country', field: 'innovator.country', placeholder: 'India' },
            ]
        }
    },
    {
        id: 'skills',
        sectionId: 'team',
        type: 'option',
        title: 'Primary Skillset',
        subtitle: 'What is your core superpower?',
        props: {
            options: [
                { id: 'Robotics', label: 'Robotics / Hardware', icon: Zap },
                { id: 'AI/ML', label: 'AI / Machine Learning', icon: Zap },
                { id: 'Design', label: 'Product Design', icon: Briefcase },
                { id: 'Business', label: 'Business / Operations', icon: Briefcase },
            ]
        }
    },
    {
        id: 'experience',
        sectionId: 'team',
        type: 'form',
        title: 'Experience',
        subtitle: 'How many years of relevant experience do you have?',
        props: {
            inputs: [
                { label: 'Years of Experience', field: 'innovator.yearsExperience', type: 'number' },
                { label: 'Highest Education', field: 'innovator.educationLevel' },
            ]
        }
    },

    // --- SECTION 4: BIO ---
    {
        id: 'bio',
        sectionId: 'team',
        type: 'essay',
        title: 'Your Story',
        subtitle: 'Briefly describe your technical background and interests.',
        props: {
            questions: [
                { label: 'Bio (Max 150 words)', field: 'innovator.bio', minChars: 50 }
            ]
        }
    },

    // --- SECTION 5: EVIDENCE ---
    {
        id: 'uploads',
        sectionId: 'uploads',
        type: 'upload',
        title: 'Resume / Portfolio',
        subtitle: 'Upload your CV or Portfolio.',
        props: {
            files: [
                { key: 'pitchDeck', label: 'Resume (PDF)', accept: '.pdf' },
            ]
        }
    },

    {
        id: 'final_review',
        sectionId: 'uploads',
        type: 'review',
        title: 'Review Application',
        subtitle: 'Verify your details.',
    },

    // --- SECTION 6: DECLARATIONS ---
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