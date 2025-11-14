import { FormEvent, useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import WeatherStrip from "@/components/WeatherStrip";
import ReasoningAccordion from "@/components/ReasoningAccordion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StreamText, { StreamBody } from "@/components/StreamText";
import heroImage from "@/assets/hero-beach.jpg";

type ItineraryPayload = {
  destination: string;
  startDate: string;
  endDate: string;
  interests: string;
  travelers: number;
  budget: string;
};

const INTEREST_PRESETS = [
  "Beaches",
  "Culture",
  "Food & wine",
  "Nightlife",
  "Adventure",
] as const;

export const Hero = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [budget, setBudget] = useState<string>("flexible");
  const [interestInput, setInterestInput] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [payload, setPayload] = useState<ItineraryPayload | null>(null);
  const [showResults, setShowResults] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (!destination || !startDate) {
      alert("Please fill in at least destination and start date.");
      return;
    }

    const finalEndDate = endDate || startDate;

    const allInterests = [
      ...selectedInterests,
      interestInput.trim(),
    ].filter(Boolean);

    const interestsString = allInterests.join(", ");

    const p: ItineraryPayload = {
      destination,
      startDate,
      endDate: finalEndDate,
      interests: interestsString,
      travelers: Number(travelers || 1),
      budget,
    };

    setPayload(p);
    setShowResults(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Tropical beach destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/10" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
        {/* Headline */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Your Next
            <br />
            <span className="text-orange-400">Adventure</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Tell us where, when, and how you like to travel. Our AI designs a
            personalized day-by-day itinerary in seconds.
          </p>
        </div>

        {/* Search / planner card */}
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="p-5 md:p-6 lg:p-7 shadow-xl bg-white/95 backdrop-blur">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 xl:grid-cols-[3fr,2fr] gap-6"
            >
              {/* LEFT COLUMN: destination, dates, travelers, budget */}
              <div className="space-y-5">
                {/* Destination */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Destination
                  </span>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <MapPin className="h-5 w-5 text-sky-600 shrink-0" />
                    <Input
                      placeholder="Dubai, Paris, Bali..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    City or region you&apos;d like to explore.
                  </p>
                </div>

                {/* Travel dates */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Travel dates
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <Calendar className="h-5 w-5 text-sky-600 shrink-0" />
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <Calendar className="h-5 w-5 text-sky-400 shrink-0" />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    End date is optional – we&apos;ll assume a short escape if
                    left blank.
                  </p>
                </div>

                {/* Travelers & Budget in one row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Travelers */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Travelers
                    </span>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <Users className="h-5 w-5 text-sky-600 shrink-0" />
                      <Input
                        type="number"
                        min={1}
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Budget
                    </span>
                    <Select
                      value={budget}
                      onValueChange={(v) => setBudget(v)}
                    >
                      <SelectTrigger className="w-full rounded-xl bg-slate-50 border border-slate-100 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-sky-600" />
                          <SelectValue placeholder="Select budget" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="budget">Budget-friendly</SelectItem>
                        <SelectItem value="mid-range">Mid-range</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: interests + CTA */}
              <div className="space-y-4 flex flex-col">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Interests
                  </span>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {INTEREST_PRESETS.map((interest) => {
                      const active = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-full px-3 py-1 text-[11px] font-medium border transition ${
                            active
                              ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom interests */}
                  <Input
                    placeholder="Add your own (e.g. street food, museums, hiking)"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    className="border border-slate-200 bg-slate-50 rounded-xl text-sm focus-visible:ring-sky-500 focus-visible:ring-offset-0"
                  />
                  <p className="text-[11px] text-slate-400">
                    Choose a few themes or type anything you love – AI will
                    craft days around it.
                  </p>
                </div>

                {/* CTA button pinned to bottom of column */}
                <div className="flex-1 flex items-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full justify-center rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:from-orange-500 hover:to-orange-600"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Plan Trip
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <span>
                Tip: More details = better itineraries. You can always refine
                and regenerate.
              </span>
            </div>
          </Card>

          {/* Stats row – keep existing feel */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                500+
              </div>
              <div className="text-white/80">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                50K+
              </div>
              <div className="text-white/80">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                4.9
              </div>
              <div className="text-white/80">Average rating</div>
            </div>
          </div>

          {/* AI Itinerary Result */}
        {showResults && payload && (
          <>
            <Card className="mt-10 p-6 md:p-8 bg-white/95 shadow-xl">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Your AI-crafted itinerary
                  </h2>
                  <p className="text-sm text-slate-600">
                    {payload.destination} · {payload.startDate} – {payload.endDate} ·{" "}
                    {payload.travelers} traveler
                    {payload.travelers > 1 ? "s" : ""} ·{" "}
                    {payload.budget === "flexible"
                      ? "Flexible budget"
                      : `${payload.budget} trip`}
                  </p>
                  {payload.interests && (
                    <p className="text-xs text-slate-500 mt-1">
                      Focused on: {payload.interests}
                    </p>
                  )}
                </div>
              </div>

              <StreamText<ItineraryPayload & StreamBody>
                endpoint="/api/itinerary"
                body={payload}
                autoRun
              />
            </Card>

            {/* Compact weather strip */}
            <WeatherStrip
              destination={payload.destination}
              startDate={payload.startDate}
              endDate={payload.endDate}
            />

            {/* AI reasoning accordion */}
            <ReasoningAccordion payload={payload} />
          </>
        )}

        </div>
      </div>
    </section>
  );
};
