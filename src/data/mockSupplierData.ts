// src/data/mockSupplierData.ts
import type { SupplierProfile, Listing } from "../pages/supplier/types";

/**
 * Seeder for demo/mock supplier data.
 * It will NOT overwrite existing data in localStorage.
 */

const PROFILE_KEY = "artpark_supplier_profile";
const LISTINGS_KEY = "artpark_supplier_listings";
const REVIEWS_KEY = "artpark_supplier_reviews";

/** Small SVG placeholders encoded as data URLs (lightweight) */
const svgPlaceholder = (label = "Image") =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='36' fill='#94a3b8'>${label}</text></svg>`
    )}`;

export function seedMockSupplierData(): void {
    // don't overwrite if present
    if (!localStorage.getItem(PROFILE_KEY)) {
        const profile: SupplierProfile = {
            id: "supplier_demo_001",
            name: "ProtoWorks Solutions",
            tagline: "Rapid prototyping • Precision manufacturing",
            about:
                "ProtoWorks Solutions provides rapid prototyping, small-batch manufacturing and testing services to hardware startups. We specialize in 3D printing, CNC machining and PCB assembly with fast turnarounds.",
            capabilities: ["3D printing", "CNC milling", "PCB assembly", "Laser cutting"],
            email: "hello@protoworks.example",
            phone: "+91 98765 43210",
            website: "https://protoworks.example",
            address: "Unit 402, Maker Hub, Bangalore, India",
            logoDataUrl: svgPlaceholder("ProtoWorks"),
            bannerDataUrl: svgPlaceholder("Banner"),
            published: true,
        };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        // console.info("Seeded supplier profile");
    }

    if (!localStorage.getItem(LISTINGS_KEY)) {
        const now = new Date().toISOString();
        const listings: Listing[] = [
            {
                id: "listing_1001",
                title: "SLA 3D Printing — High Detail (Grey Resin)",
                description:
                    "High-resolution SLA printing for small, detailed parts. Ideal for fit-checks and cosmetic prototypes.",
                price: 4500,
                currency: "INR",
                moq: 1,
                images: [svgPlaceholder("SLA Part 1")],
                specs: [
                    { key: "Material", value: "Standard Grey Resin" },
                    { key: "Layer Height", value: "25 µm" },
                    { key: "Max Volume", value: "192 x 120 x 200 mm" },
                ],
                published: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "listing_1002",
                title: "CNC Aluminium Milling — 3 axis",
                description:
                    "Precision CNC milling for aluminium parts. Suitable for mechanical brackets, housings and precision components.",
                price: 3200,
                currency: "INR",
                moq: 5,
                images: [svgPlaceholder("CNC Part")],
                specs: [
                    { key: "Material", value: "Aluminium 6061" },
                    { key: "Tolerance", value: "±0.1 mm" },
                    { key: "Max Work Area", value: "500 x 300 x 200 mm" },
                ],
                published: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "listing_1003",
                title: "Prototype PCB Assembly (Small Batch)",
                description:
                    "PCB assembly including SMT placement, reflow and inspection. Stencil & BOM support for low-volume runs.",
                price: 680,
                currency: "INR",
                moq: 10,
                images: [svgPlaceholder("PCB Assembly")],
                specs: [
                    { key: "Service", value: "SMT Assembly" },
                    { key: "Turnaround", value: "5–7 working days" },
                    { key: "Inspection", value: "AOI + Manual" },
                ],
                published: true,
                createdAt: now,
                updatedAt: now,
            },
        ];
        localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
        // console.info("Seeded supplier listings");
    }

    if (!localStorage.getItem(REVIEWS_KEY)) {
        const reviews = [
            {
                id: "rev_9001",
                listingId: "listing_1001",
                rating: 5,
                comment: "Excellent print quality and very quick turnaround. Highly recommended.",
                reviewer: "Nikhil (DeepTech Labs)",
                date: "2025-11-10",
            },
            {
                id: "rev_9002",
                listingId: "listing_1002",
                rating: 4,
                comment: "Good tolerances, delivered on time. Packaging could be improved.",
                reviewer: "Riya (Robotics Co.)",
                date: "2025-11-05",
            },
            {
                id: "rev_9003",
                listingId: "listing_1003",
                rating: 5,
                comment: "PCB assembly was flawless. Support helped resolve a BOM issue quickly.",
                reviewer: "Arjun (SensorTech)",
                date: "2025-10-28",
            },
        ];
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
        // console.info("Seeded supplier reviews");
    }
}

// optional helper: clear demo data
export function clearMockSupplierData(): void {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(LISTINGS_KEY);
    localStorage.removeItem(REVIEWS_KEY);
}
