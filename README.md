# AI Travel Guide -- README

An AI-powered travel planning application built with **Next.js**,
**OpenAI**, **MongoDB**, and **OpenWeather**.\
Users can generate fully personalized, multi-day travel itineraries
based on their preferences, live weather, and trip duration. The app
streams the itinerary in real time, explains the planning logic, and
displays weather forecasts---creating an immersive, intelligent
trip-building experience.

------------------------------------------------------------------------

## **Features**

### ** AI-Generated Itineraries**

-   Uses OpenAI's `gpt-4o-mini` model.
-   Generates multi-day itineraries based on:
    -   Destination\
    -   Dates\
    -   Interests\
    -   Travelers\
    -   Budget\
    -   Live weather\
-   Streams the itinerary text in real time for a chat-like UX.

### ** Live Weather Integration**

-   Fetches city coordinates via OpenWeather Geocoding API.
-   Fetches 5--7 day weather forecasts.
-   Groups forecast by day (avg temperature, dominant description).
-   Renders a friendly weather widget with emojis.

### ** Reasoning Timeline (Public-Safe Explanation)**

-   Generates a short, human-readable "how we planned this" breakdown.
-   Each line is a bullet point representing one planning step.
-   Does *not* expose private chain-of-thought.

### ** Save & Retrieve Itineraries**

-   MongoDB + Mongoose to store:
    -   user inputs\
    -   generated plan text\
    -   timestamps\
-   Dedicated API routes for saving and fetching recent itineraries.

### ** Suggested Trips**

-   Server-side page showing curated travel suggestions.
-   Fallback built-in list if API call fails.

### ** Modern UI**

-   Built with:
    -   Next.js App Router\
    -   Tailwind CSS\
    -   React Hook Form\
    -   Lucide Icons\
-   Gradient theme, polished cards, icons inside inputs, animated
    streaming text.

------------------------------------------------------------------------

## **Tech Stack**

### **Frontend**

-   Next.js 14 (App Router)
-   React 19
-   TypeScript
-   Tailwind CSS
-   react-hook-form
-   react-markdown + remark-gfm

### **Backend**

-   Next.js API routes (Edge + Node runtimes)
-   OpenAI SDK
-   OpenWeather REST API
-   MongoDB / Mongoose

### **Streaming**

-   Custom `ReadableStream` wrapper for AI responses.
-   Real-time streaming UI with abort support.

------------------------------------------------------------------------

## **Folder Structure**

    travel-agent-backend-main/
    │
    ├── app/
    │   ├── page.tsx                → Home (Itinerary Builder)
    │   ├── trips/page.tsx          → Suggested Trips Page
    │   ├── layout.tsx              → Root layout + Navbar
    │   ├── globals.css             → Tailwind + global styles
    │   │
    │   ├── api/
    │   │   ├── itinerary/route.ts          → Generate AI itinerary (stream)
    │   │   ├── itinerary/save/route.ts     → Save itinerary to MongoDB
    │   │   ├── itineraries/route.ts        → Fetch recent itineraries
    │   │   ├── reasoning/route.ts          → Generate reasoning timeline
    │   │   ├── suggested/route.ts          → Suggested trips
    │   │   └── weather/route.ts            → Weather integration
    │
    ├── components/
    │   ├── StreamText.tsx          → Handles streaming OpenAI responses
    │   ├── ReasoningTimeline.tsx   → Timeline explanation component
    │   ├── WeatherWidget.tsx       → Weather forecast display
    │   └── MarkdownViewer.tsx      → Markdown rendering wrapper
    │
    ├── lib/
    │   └── db.ts                   → MongoDB connection helper
    │
    ├── models/
    │   └── Itinerary.ts            → Mongoose schema for itineraries
    │
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── package.json
    └── README.md (this file)

------------------------------------------------------------------------

## **Environment Variables**

Create a `.env.local` file:

``` env
OPENAI_API_KEY=your_openai_key
OPENWEATHER_API_KEY=your_openweather_key
MONGODB_URI=your_mongodb_uri
MONGODB_DB=ai-travel-guide
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

------------------------------------------------------------------------

## **Getting Started**

### **1. Install dependencies**

``` bash
npm install
```

### **2. Run development server**

``` bash
npm run dev
```

App will run at:

    http://localhost:3000

------------------------------------------------------------------------

## 📡 API Routes Summary

  ----------------------------------------------------------------------------------
  Route                   Method         Runtime            Description
  ----------------------- -------------- ------------------ ------------------------
  `/api/itinerary`        POST           Edge               Stream AI-generated
                                                            itinerary

  `/api/itinerary/save`   POST           Node               Save itinerary to
                                                            MongoDB

  `/api/itineraries`      GET            Node               Retrieve recent
                                                            itineraries

  `/api/reasoning`        POST           Edge               Generate public-safe
                                                            planning timeline

  `/api/weather`          GET            Edge               Fetch and group weather
                                                            forecast

  `/api/suggested`        GET            Edge               Return static suggested
                                                            trips
  ----------------------------------------------------------------------------------

------------------------------------------------------------------------

## **How It Works (High-Level)**

1.  User submits trip details.
2.  Backend fetches weather forecast via OpenWeather.
3.  Backend sends user input + weather context to OpenAI.
4.  OpenAI returns streaming markdown text.
5.  `StreamText.tsx` renders the itinerary in real-time.
6.  User can click "Explain how we planned this" to get a reasoning
    timeline.
7.  User can save the itinerary to MongoDB.
8.  User can explore a curated suggestions page.

------------------------------------------------------------------------

## **Key Highlights for Interviews**

-   Demonstrates mastery of **Next.js App Router** and mixed runtimes
    (Edge + Node).
-   Shows environmental configuration, streaming, state management, and
    form validation.
-   Uses modern UX: streaming text, icons, weather cards, collapsible
    sections.
-   Integrates multiple external APIs and combines structured +
    unstructured data.
-   Clean component architecture and well-separated concerns.

------------------------------------------------------------------------

## **License**

MIT License.
