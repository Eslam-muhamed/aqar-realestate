import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string): string {
    if (currency === "SAR") {
        return `SAR ${price.toLocaleString()}`;
    }
    if (currency === "AED") {
        return `AED ${price.toLocaleString()}`;
    }
    return `${currency} ${price.toLocaleString()}`;
}

export function formatArea(area: number): string {
    return `${area.toLocaleString()} m²`;
}

export function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 2592000)} months ago`;
}

export function slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}
