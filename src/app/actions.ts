"use server";

const svgCache = new Map<string, string>();

export const fetchSvg = async (url: string): Promise<string> => {
  if (svgCache.has(url)) {
    return svgCache.get(url)!;
  }

  const response = await fetch(url);
  const svgText = await response.text();
  svgCache.set(url, svgText);
  return svgText;
};
