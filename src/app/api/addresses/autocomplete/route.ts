import { NextRequest } from 'next/server';

interface MapplsSuggestedLocation {
  type?: string;
  placeAddress?: string;
  placeName?: string;
  eLoc?: string;
  distance?: number;
  orderIndex?: number;
}

interface MapplsResponse {
  suggestedLocations?: MapplsSuggestedLocation[];
  error?: string;
  error_description?: string;
}

export interface FormattedAddressSuggestion {
  id: string;
  mainText: string;
  secondaryText: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
}

// In-memory query cache for fast repeated responses
const cache = new Map<string, { timestamp: number; data: FormattedAddressSuggestion[] }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function parseMapplsLocation(
  item: MapplsSuggestedLocation,
  index: number
): FormattedAddressSuggestion | null {
  const placeName = (item.placeName || '').trim();
  const placeAddress = (item.placeAddress || '').trim();

  if (!placeName && !placeAddress) return null;

  const parts = placeAddress.split(',').map((p) => p.trim()).filter(Boolean);

  // Extract 6-digit PIN code
  let postcode = '';
  const lastPart = parts[parts.length - 1] || '';
  if (/^\d{6}$/.test(lastPart)) {
    postcode = lastPart;
    parts.pop();
  } else {
    const pinMatch = placeAddress.match(/\b\d{6}\b/);
    if (pinMatch) postcode = pinMatch[0];
  }

  // Extract state
  let state = 'Karnataka';
  if (parts.length > 0) {
    state = parts.pop() || 'Karnataka';
  }

  // Extract city/district
  let city = '';
  if (parts.length > 0) {
    city = (parts.pop() || '').replace(/\s+District$/i, '');
  } else {
    city = state;
  }

  const secondaryParts: string[] = [];
  if (city) secondaryParts.push(city);
  if (state && state !== city) secondaryParts.push(state);
  if (postcode) secondaryParts.push(postcode);

  return {
    id: `mappls-${item.eLoc || index}-${Date.now()}`,
    mainText: placeName || city || 'Locality',
    secondaryText: secondaryParts.join(', '),
    address1: placeName,
    city,
    state,
    postcode,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();

    if (!query || query.length < 2) {
      return Response.json({ success: true, suggestions: [] });
    }

    const cacheKey = query.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return Response.json({ success: true, suggestions: cached.data });
    }

    const key = process.env.MAPPLS_REST_KEY || 'tgaycqgfgafeycbzupyvlhvmijvclxytzvfr';

    // Mappls search endpoint with Karnataka geographic bias (15.3173, 75.7139)
    const mapplsUrl = `https://search.mappls.com/api/places/search/json?query=${encodeURIComponent(
      query
    )}&location=15.3173,75.7139&access_token=${key}`;

    const res = await fetch(mapplsUrl, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn('[Mappls API] Request returned status:', res.status);
      return Response.json({ success: false, suggestions: [] }, { status: res.status });
    }

    const data: MapplsResponse = await res.json();
    const locations = data.suggestedLocations || [];

    const parsed: FormattedAddressSuggestion[] = [];
    for (let i = 0; i < locations.length; i++) {
      const formatted = parseMapplsLocation(locations[i], i);
      if (formatted) {
        parsed.push(formatted);
      }
    }

    // Prioritize Karnataka results at the top
    parsed.sort((a, b) => {
      const aIsKarnataka = /karnataka/i.test(a.state);
      const bIsKarnataka = /karnataka/i.test(b.state);
      if (aIsKarnataka && !bIsKarnataka) return -1;
      if (!aIsKarnataka && bIsKarnataka) return 1;
      return 0;
    });

    cache.set(cacheKey, { timestamp: Date.now(), data: parsed });

    return Response.json({ success: true, suggestions: parsed });
  } catch (error) {
    console.error('[Mappls Autocomplete] Unexpected error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}

