import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function buildUrl(baseUrl: string, query: Record<string, string>) {
  const params = new URLSearchParams(query);
  return `${baseUrl}?${decodeURIComponent(params.toString())}`;
}
