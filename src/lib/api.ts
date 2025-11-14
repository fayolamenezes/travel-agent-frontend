import { API_BASE_URL } from "./apiBase";

export interface ItineraryRequestPayload {
  destination: string;
  startDate: string;
  endDate: string;
  interests?: string | string[];
  travelers?: number;
  budget?: string;
}

export interface ItinerarySavePayload extends ItineraryRequestPayload {
  planText: string;
}

export interface WeatherRequestPayload {
  city: string;
  startDate?: string;
  endDate?: string;
}

export type ReasoningRequestPayload = ItineraryRequestPayload;

async function request<TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<TResponse>;
}

// POST /api/itinerary  (generate itinerary)
export function generateItinerary(data: ItineraryRequestPayload) {
  return request<string>("/api/itinerary", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// POST /api/itinerary/save  (save itinerary)
export function saveItinerary(data: ItinerarySavePayload) {
  return request<{ ok: boolean; id?: string }>("/api/itinerary/save", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// GET /api/itineraries  (list itineraries)
export function getItineraries() {
  return request<unknown[]>("/api/itineraries");
}

// POST /api/weather  (if used as POST)
export function getWeather(data: WeatherRequestPayload) {
  return request<unknown>("/api/weather", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// POST /api/reasoning
export function getReasoning(data: ReasoningRequestPayload) {
  return request<string>("/api/reasoning", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// GET /api/suggested
export function getSuggestedTrips() {
  return request<unknown[]>("/api/suggested");
}
