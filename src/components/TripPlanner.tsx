import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";

import StreamText, { StreamBody } from "@/components/StreamText";
import WeatherWidget from "@/components/WeatherWidget";
import ReasoningTimeline from "@/components/ReasoningTimeline";
import { API_BASE_URL } from "@/lib/apiBase";

type FormValues = {
  destination: string;
  startDate: string;
  endDate: string;
  interests: string;
  travelers: string;
  budget: string;
};

export type ItineraryPayload = {
  destination: string;
  startDate: string;
  endDate: string;
  interests: string;
  travelers: number;
  budget: string;
};

export function TripPlanner() {
  const { register, handleSubmit, watch, reset } = useForm<FormValues>();
  const [payload, setPayload] = useState<ItineraryPayload | null>(null);
  const [latestPlan, setLatestPlan] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function onSubmit(values: FormValues) {
    const p: ItineraryPayload = {
      destination: values.destination,
      startDate: values.startDate,
      endDate: values.endDate,
      interests: values.interests,
      travelers: Number(values.travelers || 1),
      budget: values.budget,
    };
    setPayload(p);
  }

  async function save() {
    if (!latestPlan || !payload) {
      alert("Generate a plan first, then save.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/itinerary/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, planText: latestPlan }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save itinerary");
      }

      alert("Saved successfully (if DB is configured).");
      reset();
      setPayload(null);
      setLatestPlan("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      alert(`Save failed: ${message}`);
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-green-700">Loading planner…</p>
      </div>
    );
  }

  const destination = watch("destination");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* LEFT PANEL – form + weather */}
      <section className="rounded-2xl border border-green-200 bg-white p-6 shadow-md">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-green-900">
            Plan Your Trip
          </h2>
          <p className="text-sm text-green-800/70 mt-1">
            Fill in the details to get a personalized, AI-powered itinerary.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-green-900 mb-1">
              Destination
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-green-600" />
              <input
                {...register("destination", { required: true })}
                placeholder="e.g., Paris, Kyoto"
                className="w-full rounded-md border border-green-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">
                Start date
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-green-600" />
                <input
                  type="date"
                  {...register("startDate", { required: true })}
                  className="w-full rounded-md border border-green-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">
                End date
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-green-600" />
                <input
                  type="date"
                  {...register("endDate", { required: true })}
                  className="w-full rounded-md border border-green-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Travelers + Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">
                Travelers
              </label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-green-600" />
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  {...register("travelers")}
                  className="w-full rounded-md border border-green-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">
                Budget
              </label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-green-600" />
                <select
                  {...register("budget")}
                  className="w-full rounded-md border border-green-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Flexible</option>
                  <option value="budget">Budget</option>
                  <option value="mid-range">Mid-range</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-green-900 mb-1">
              Interests
            </label>
            <input
              {...register("interests")}
              placeholder="Food, culture, adventure, nightlife"
              className="w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <p className="mt-2 text-xs text-green-700/80 italic">
              Tip: Leave empty to let AI balance your trip.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
            >
              Build itinerary
            </button>
            <button
              type="button"
              onClick={save}
              className="text-xs text-green-700 underline"
            >
              Save itinerary
            </button>
          </div>
        </form>

        {destination && (
          <div className="mt-6 border-t border-green-100 pt-4">
            <WeatherWidget
              destination={destination}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )}
      </section>

      {/* RIGHT PANEL – streamed itinerary */}
      <section className="rounded-2xl border border-green-200 bg-white p-6 shadow-md">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-green-900">
            Generated Itinerary
          </h2>
        </div>

        {payload ? (
          <StreamText<ItineraryPayload & StreamBody>
            endpoint="/api/itinerary"
            body={payload}
            onComplete={setLatestPlan}
          />
        ) : (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            Fill out the form and click{" "}
            <strong>Build itinerary / Generate Itinerary</strong> to begin.
          </div>
        )}
      </section>

      {payload && (
        <div className="md:col-span-2">
          <ReasoningTimeline payload={payload} />
        </div>
      )}
    </div>
  );
}
