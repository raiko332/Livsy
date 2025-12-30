// ENUM
export type PropertyType = "Villa" | "Apartment" | "House";
export type PropertyStatus = "Available" | "Sold" | "Reserved" | "Draft";
export type AreaUnit = "sqft" | "m2";

export interface Property {
  id?: string;

  // Basic Info
  title: string;
  type: PropertyType;
  status: PropertyStatus;

  // Price
  price: number;

  // Specification
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: AreaUnit;

  // Description
  description: string;

  // Media
  coverImage: string;
  gallery: string[];

  // Location
  location: Location;
}

export interface Location {
  city: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
  available: {
    label: "Available",
    bg: "bg-green-100",
    text: "text-green-600",
  },
  reserved: {
    label: "Reserved",
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  sold: {
    label: "Sold",
    bg: "bg-red-100",
    text: "text-red-600",
  },
};
