export interface BookingRequest {
    id: string;
    startupName: string;
    founderName: string;
    equipmentId: string;
    equipmentName: string;
    date: string;
    duration: number; // hours
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    purpose: string;
}

export interface LabAsset {
    id: string;
    name: string;
    category: string;
    status: 'active' | 'maintenance' | 'offline';
    hourlyRate: number;
    specifications: string[];
}

export const currentLabOwner = {
    id: "lo-1",
    name: "Dr. Anjali Deshpande",
    role: "Lab Director",
    labName: "ARTPark Robotics Test Lab",
    email: "director@artpark-labs.in",
    phone: "+91-80-1234-5678",
    location: "Bangalore, India",
    description: "State-of-the-art robotics testing facility with advanced equipment for comprehensive product validation.",
    accreditations: ["NABL", "ISO 17025"]
};

export const labAssets: LabAsset[] = [
    {
        id: "eq-1",
        name: "Thermal Vacuum Chamber",
        category: "Environmental Testing",
        status: "active",
        hourlyRate: 1500,
        specifications: ["-40°C to 120°C", "10^-6 mbar vacuum"]
    },
    {
        id: "eq-2",
        name: "6-Axis Vibration Shaker",
        category: "Durability Testing",
        status: "maintenance",
        hourlyRate: 2000,
        specifications: ["30kN Force", "100g Acceleration"]
    },
    {
        id: "eq-3",
        name: "Anechoic Chamber",
        category: "EMC/EMI Testing",
        status: "active",
        hourlyRate: 5000,
        specifications: ["10MHz - 40GHz", "3m Test Range"]
    }
];

export const bookingRequests: BookingRequest[] = [
    {
        id: "bk-1",
        startupName: "AgriDrone Tech",
        founderName: "Rahul Verma",
        equipmentId: "eq-1",
        equipmentName: "Thermal Vacuum Chamber",
        date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
        duration: 4,
        status: 'pending',
        purpose: "Testing drone battery performance under vacuum conditions."
    },
    {
        id: "bk-2",
        startupName: "MediBot",
        founderName: "Priya Sharma",
        equipmentId: "eq-3",
        equipmentName: "Anechoic Chamber",
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        duration: 2,
        status: 'completed',
        purpose: "EMI interference check for medical sensors."
    },
    {
        id: "bk-3",
        startupName: "UrbanAir Mobility",
        founderName: "Arjun K",
        equipmentId: "eq-2",
        equipmentName: "6-Axis Vibration Shaker",
        date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
        duration: 6,
        status: 'approved',
        purpose: "Structural integrity test for wing assembly."
    }
];