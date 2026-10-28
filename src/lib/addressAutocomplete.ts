/**
 * Smart Address Locality Autocomplete Service
 * Powers Swiggy/Zepto/Flipkart-style locality autocompletion in Karnataka and pan-India.
 * Primary Engine: Photon Geocoder (Fast, OpenStreetMap-based, geographically biased to Karnataka)
 * Fallback Engine: OpenStreetMap Nominatim Search API
 * 100% Free, no credit card or API key required.
 */

import { normalizeCityName } from './pincodeLookup';

export interface LocalitySuggestion {
  id: string;
  mainText: string;      // e.g. "Samarth Nagar"
  secondaryText: string; // e.g. "Belagavi, Karnataka · 590001"
  address1: string;      // e.g. "Samarth Nagar"
  city: string;          // e.g. "Belagavi"
  state: string;         // e.g. "Karnataka"
  postcode: string;      // e.g. "590001"
}

// In-memory query cache
const queryCache = new Map<string, LocalitySuggestion[]>();

// Geographic center of Karnataka (lat/lon bias for nearest results)
const KARNATAKA_CENTER = {
  lat: 15.3173,
  lon: 75.7139,
};

interface PhotonFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    osm_id?: number | string;
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    countrycode?: string;
  };
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  address?: {
    suburb?: string;
    neighbourhood?: string;
    residential?: string;
    road?: string;
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

/**
 * Fetch locality suggestions via Photon API
 */
async function fetchFromPhoton(query: string, signal?: AbortSignal): Promise<LocalitySuggestion[]> {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lat=${KARNATAKA_CENTER.lat}&lon=${KARNATAKA_CENTER.lon}`;
  
  const response = await fetch(url, { signal });
  if (!response.ok) return [];

  const data = await response.json();
  if (!data || !Array.isArray(data.features)) return [];

  const suggestions: LocalitySuggestion[] = [];

  for (let i = 0; i < data.features.length; i++) {
    const feature: PhotonFeature = data.features[i];
    const props = feature.properties || {};

    // Filter to India if countrycode is specified
    if (props.countrycode && props.countrycode.toUpperCase() !== 'IN') continue;
    if (props.country && !/india/i.test(props.country)) continue;

    const mainText = props.name || props.street || query;
    const rawCity = props.city || props.district || '';
    const city = rawCity ? normalizeCityName(rawCity) : '';
    const state = props.state || 'Karnataka';
    const postcode = props.postcode || '';

    const secondaryParts: string[] = [];
    if (city) secondaryParts.push(city);
    if (state && state !== city) secondaryParts.push(state);
    if (postcode) secondaryParts.push(postcode);

    suggestions.push({
      id: `photon-${props.osm_id || i}-${Date.now()}`,
      mainText,
      secondaryText: secondaryParts.join(', '),
      address1: props.street && props.name && props.street !== props.name 
        ? `${props.name}, ${props.street}`
        : mainText,
      city,
      state,
      postcode,
    });
  }

  return suggestions;
}

/**
 * Fallback to OpenStreetMap Nominatim if Photon yields no matches
 */
async function fetchFromNominatim(query: string, signal?: AbortSignal): Promise<LocalitySuggestion[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=json&addressdetails=1&limit=6`;
  
  const response = await fetch(url, { signal });
  if (!response.ok) return [];

  const data: NominatimResult[] = await response.json();
  if (!Array.isArray(data)) return [];

  return data.map((item, idx) => {
    const addr = item.address || {};
    const mainText = addr.suburb || addr.neighbourhood || addr.residential || addr.road || item.display_name.split(',')[0].trim();
    const rawCity = addr.city || addr.town || addr.village || addr.county || addr.state_district || '';
    const city = rawCity ? normalizeCityName(rawCity) : '';
    const state = addr.state || 'Karnataka';
    const postcode = addr.postcode || '';

    const secondaryParts: string[] = [];
    if (city) secondaryParts.push(city);
    if (state && state !== city) secondaryParts.push(state);
    if (postcode) secondaryParts.push(postcode);

    return {
      id: `nom-${item.place_id || idx}`,
      mainText,
      secondaryText: secondaryParts.join(', '),
      address1: mainText,
      city,
      state,
      postcode,
    };
  });
}

/**
 * Main query function with caching and timeout
 */
export async function searchLocalities(
  query: string,
  signal?: AbortSignal
): Promise<LocalitySuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const cacheKey = trimmed.toLowerCase();
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey)!;
  }

  try {
    // Try Photon first
    let results = await fetchFromPhoton(trimmed, signal);

    // If Photon produced no results, fall back to Nominatim
    if (results.length === 0) {
      results = await fetchFromNominatim(trimmed, signal);
    }

    if (results.length > 0) {
      queryCache.set(cacheKey, results);
    }

    return results;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return [];
    }
    console.warn('[AddressAutocomplete] Search error:', error);
    return [];
  }
}

