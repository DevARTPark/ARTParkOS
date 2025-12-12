export type SupplierProfile = {
    id?: string;
    name: string;
    tagline?: string;
    about?: string;
    capabilities?: string[]; // tags
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    logoDataUrl?: string;
    bannerDataUrl?: string;
    published?: boolean;
};

export type Listing = {
    id: string;
    title: string;
    description?: string;
    price?: number;
    currency?: string;
    moq?: number;
    images?: string[]; // data URLs
    specs?: { key: string; value: string }[];
    published?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
