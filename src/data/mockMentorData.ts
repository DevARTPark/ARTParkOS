export interface MentorProfile {
    id: string;
    name: string;
    title: string;
    affiliation: string;
    bio: string;
    expertise: string[];
    email: string;
    phone: string;
    linkedin?: string;
    photoUrl?: string;
    totalSessions: number;
    totalHours: number;
    rating: number;
}

export interface MentorSession {
    id: string;
    founderName: string;
    startupName: string;
    topic: string;
    date: string; // ISO string
    time: string;
    duration: number; // minutes
    status: 'upcoming' | 'completed' | 'cancelled';
    meetingLink?: string;
    notes?: string;
    documents?: string[]; // Array of file names
}

export interface DaySchedule {
    day: string;
    enabled: boolean;
    slots: { id: string; time: string; available: boolean }[];
}

// --- Mock Data ---

export const currentMentor: MentorProfile = {
    id: "m-1",
    name: "Dr. Ramesh Gupta",
    title: "Professor, Dept of CSA",
    affiliation: "Indian Institute of Science (IISc)",
    bio: "Specializing in AI/ML architectures. I volunteer my time to help deep-tech startups scale their algorithms and validate their technical roadmaps.",
    expertise: ["AI/ML", "Robotics", "Deep Tech", "System Design"],
    email: "ramesh.gupta@iisc.ac.in",
    phone: "+91-9876543210",
    totalSessions: 42,
    totalHours: 56,
    rating: 4.9
};

export const mentorSessions: MentorSession[] = [
    {
        id: "s-1",
        founderName: "Priya Sharma",
        startupName: "AgriSense",
        topic: "Sensor Calibration Logic",
        date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
        time: "10:00 AM",
        duration: 60,
        status: 'upcoming',
        meetingLink: "https://meet.google.com/abc-defg-hij"
    },
    {
        id: "s-2",
        founderName: "Rahul Verma",
        startupName: "DroneLogistics",
        topic: "Path Planning Algorithms",
        date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 days ago
        time: "02:00 PM",
        duration: 45,
        status: 'completed',
        notes: "Discussed A* vs Dijkstra for their specific drone payload constraints.",
        meetingLink: "https://meet.google.com/xyz-uvw-rst"
    },
    {
        id: "s-3",
        founderName: "Amit Kumar",
        startupName: "MediBot",
        topic: "Compliance & Safety",
        date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
        time: "11:00 AM",
        duration: 30,
        status: 'upcoming',
        meetingLink: "https://meet.google.com/lmn-opq-rst"
    }
];

const generateSlots = () => [
    { id: "t1", time: "09:00 AM", available: false },
    { id: "t2", time: "10:00 AM", available: true },
    { id: "t3", time: "11:00 AM", available: true },
    { id: "t4", time: "02:00 PM", available: false },
    { id: "t5", time: "03:00 PM", available: false },
    { id: "t6", time: "04:00 PM", available: true },
];

export const defaultSchedule: DaySchedule[] = [
    { day: "Monday", enabled: true, slots: generateSlots() },
    { day: "Tuesday", enabled: true, slots: generateSlots() },
    { day: "Wednesday", enabled: true, slots: generateSlots() },
    { day: "Thursday", enabled: false, slots: generateSlots() },
    { day: "Friday", enabled: true, slots: generateSlots() },
];