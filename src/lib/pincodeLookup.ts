/**
 * India Post PIN Code Lookup Service
 * Uses the official public India Post Postal PIN Code API (100% Free, no API key needed).
 * API: https://api.postalpincode.in/pincode/${pincode}
 */

export interface PincodeDetails {
  pincode: string;
  city: string;
  district: string;
  state: string;
  postOffices: string[];
}

// In-memory cache to avoid repeated network calls for the same pincode
const pincodeCache = new Map<string, PincodeDetails>();

/**
 * Standardize historical / alternate district and city spellings in Karnataka
 */
const CITY_NAME_NORMALIZATION: Record<string, string> = {
  belgaum: 'Belagavi',
  bangalore: 'Bengaluru',
  'bangalore urban': 'Bengaluru',
  'bangalore rural': 'Bengaluru Rural',
  mysore: 'Mysuru',
  gulbarga: 'Kalaburagi',
  bijapur: 'Vijayapura',
  hubli: 'Hubballi',
  'hubli-dharwad': 'Hubballi',
  dharwad: 'Dharwad',
  mangalore: 'Mangaluru',
  'dakshina kannada': 'Mangaluru',
  shimoga: 'Shivamogga',
  bellary: 'Ballari',
  tumkur: 'Tumakuru',
  chikmagalur: 'Chikkamagaluru',
  hospet: 'Hosapete',
};

export function normalizeCityName(cityName: string): string {
  const cleaned = cityName.trim().toLowerCase();
  return CITY_NAME_NORMALIZATION[cleaned] || cityName.trim();
}

/**
 * Lookup Indian city and state from a 6-digit postal PIN code
 */
export async function lookupPincode(pincode: string): Promise<PincodeDetails | null> {
  const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
  if (cleanPin.length !== 6) return null;

  if (pincodeCache.has(cleanPin)) {
    return pincodeCache.get(cleanPin)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const result = data[0];
    if (result.Status !== 'Success' || !Array.isArray(result.PostOffice) || result.PostOffice.length === 0) {
      return null;
    }

    const firstPO = result.PostOffice[0];
    const rawDistrict = firstPO.District || firstPO.Block || firstPO.Division || '';
    const city = normalizeCityName(rawDistrict);
    const state = firstPO.State || 'Karnataka';

    const postOffices = result.PostOffice
      .map((po: { Name?: string }) => po.Name || '')
      .filter(Boolean);

    const details: PincodeDetails = {
      pincode: cleanPin,
      city,
      district: rawDistrict,
      state,
      postOffices,
    };

    pincodeCache.set(cleanPin, details);
    return details;
  } catch (error) {
    console.warn('[PincodeLookup] Error looking up PIN code:', error);
    return null;
  }
}

