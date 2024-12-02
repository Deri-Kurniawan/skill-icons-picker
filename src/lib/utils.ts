import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildUrl(baseUrl: string, query: Record<string, string>) {
  const url = new URL(baseUrl);
  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return decodeURIComponent(url.toString());
}
