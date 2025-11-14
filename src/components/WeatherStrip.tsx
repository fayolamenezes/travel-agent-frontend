import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/apiBase";

type DailyWeather = {
  date: string;
  temp: number;
  description: string;
};

type WeatherApiResponse = {
  daily?: DailyWeather[];
};

type WeatherStripProps = {
  destination: string;
  startDate?: string;
  endDate?: string;
};

function iconFor(desc: string) {
  const d = desc.toLowerCase();
  if (d.includes("thunder")) return "⛈️";
  if (d.includes("storm")) return "🌩️";
  if (d.includes("snow")) return "❄️";
  if (d.includes("rain") || d.includes("drizzle")) return "🌧️";
  if (d.includes("cloud")) return "☁️";
  if (d.includes("mist") || d.includes("fog") || d.includes("haze")) {
    return "🌫️";
  }
  if (d.includes("clear")) return "☀️";
  return "🌤️";
}

function inRange(dateStr: string, start?: string, end?: string) {
  if (!start || !end) return false;
  const d = new Date(dateStr);
  return d >= new Date(start) && d <= new Date(end);
}

export default function WeatherStrip({
  destination,
  startDate,
  endDate,
}: WeatherStripProps) {
  const [data, setData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      if (!destination) return;
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/api/weather?destination=${encodeURIComponent(
            destination
          )}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Weather request failed");
        }

        const json: WeatherApiResponse = await res.json();
        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : String(err);
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [destination]);

  const daily = useMemo<DailyWeather[]>(() => {
    if (!data?.daily) return [];
    const all = data.daily;
    const tripDays =
      startDate && endDate
        ? all.filter((d) => inRange(d.date, startDate, endDate))
        : all;

    return tripDays.slice(0, 4);
  }, [data, startDate, endDate]);

  if (!destination) return null;

  return (
    <Card className="mt-4 p-4 bg-sky-50/80 border-sky-100">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-sky-900 uppercase">
            Weather snapshot
          </p>
          <p className="text-xs text-sky-800/80">
            {destination}
            {startDate && endDate
              ? ` · ${startDate} – ${endDate}`
              : " · upcoming days"}
          </p>
        </div>
        {loading && (
          <p className="text-xs text-sky-700">Loading forecast…</p>
        )}
        {error && (
          <p className="text-xs text-red-500">Weather unavailable</p>
        )}
      </div>

      {!loading && !error && daily.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {daily.map((d) => (
            <div
              key={d.date}
              className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-xs shadow-sm"
            >
              <span className="text-lg">{iconFor(d.description)}</span>
              <div className="leading-tight">
                <div className="font-medium text-sky-900">{d.date}</div>
                <div className="text-sky-800">
                  {d.temp}°C · {d.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && daily.length === 0 && (
        <p className="text-xs text-sky-800">
          No forecast data available for these dates yet.
        </p>
      )}
    </Card>
  );
}
