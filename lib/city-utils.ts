import type { Tournament } from "@/lib/database.types";

// Static mapping of city names to ISO 3166-1 alpha-2 country codes
export const CITY_COUNTRY_MAP: Record<string, string> = {
  "Buenos Aires": "AR",
  "Córdoba": "AR",
  "Rosario": "AR",
  "Mendoza": "AR",
  "Mar del Plata": "AR",
  "Corrientes": "AR",
  "Madrid": "ES",
  "Barcelona": "ES",
};

export const COUNTRY_LABELS: Record<string, { es: string; en: string }> = {
  AR: { es: "Argentina", en: "Argentina" },
  ES: { es: "España", en: "Spain" },
};

// Country display order
const COUNTRY_ORDER = ["AR", "ES"];

export function getCountryForCity(city: string): string {
  return CITY_COUNTRY_MAP[city] ?? "AR";
}

/** Extract unique cities from tournaments, sorted by count descending */
export function extractCities(tournaments: Tournament[]): string[] {
  const counts = new Map<string, number>();
  for (const t of tournaments) {
    counts.set(t.city, (counts.get(t.city) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([city]) => city);
}

/** Group cities by country code, maintaining COUNTRY_ORDER */
export function groupCitiesByCountry(
  cities: string[]
): { country: string; cities: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const city of cities) {
    const country = getCountryForCity(city);
    if (!groups.has(country)) groups.set(country, []);
    groups.get(country)!.push(city);
  }
  return COUNTRY_ORDER.filter((c) => groups.has(c)).map((country) => ({
    country,
    cities: groups.get(country)!,
  }));
}
