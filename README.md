# TravelAgent --- AI-Powered Travel Planning Experience

*A modern, animated, React + TypeScript travel planner built for a
fullstack interview assignment.*

```
## Overview

**TravelAgent** is a fully responsive, animated travel-planning
experience.\
Users can enter their destination, dates, budget, and interests --- and
instantly receive:

-   A **custom AI-generated itinerary**
-   A **weather summary** for their exact travel dates
-   A **reasoning accordion** explaining *why* the system suggested that
    plan
-   Beautiful animated sections:
    -   Featured Deals
    -   Popular Destinations
    -   Travel Categories
    -   Testimonials
    -   Footer with newsletter + social links

This project demonstrates:

-   Advanced UI/UX\
-   GSAP scroll animations\
-   API integration\
-   Proper React component architecture\
-   Clean CSS design tokens\
-   Production-quality TypeScript code

## Features

### 1. Smart Trip Planner (Core Feature)

The planner (in the Hero section):

-   Collects destination, dates, travelers, budget, interests
-   Sends a structured request to the backend
-   Displays:
    -   AI itinerary
    -   WeatherStrip (filtered to user's travel dates)
    -   ReasoningAccordion (why the itinerary makes sense)
-   Streams itinerary text for an "AI assistant" feeling

### 2. Advanced UI/UX + Animation System

-   GSAP ScrollTrigger used for:
    -   Featured Deals pinned scrollytelling stack
    -   Horizontal animated category cards
    -   Smooth fade + transform effects
-   shadcn/ui + Tailwind CSS
-   Animated shadows, gradients, hover effects
-   Clean information hierarchy

### 3. Neon Background System

Full-screen animated background layer:

-   Faint low-opacity dotted grid\
-   Falling neon light streaks\
-   Uses CSS gradients + JavaScript-generated random neon lines\
-   Colors are linked to the Featured Deals color palette

### 4. Marketing Sections

-   **Destinations:** responsive image cards with star ratings\
-   **Featured Deals:** stacked animated cards\
-   **Categories:** 5 types of trips with scroll animations\
-   **Testimonials:** subtle motion + glassy cards\
-   **Footer:** newsletter, company info, and quick links

## Project Structure

    src/
     ├─ components/
     │   ├─ Header.tsx
     │   ├─ Hero.tsx
     │   ├─ Destinations.tsx
     │   ├─ FeaturedDeals.tsx
     │   ├─ Categories.tsx
     │   ├─ Testimonials.tsx
     │   ├─ WeatherStrip.tsx
     │   ├─ ReasoningAccordion.tsx
     │   └─ Footer.tsx
     │
     ├─ lib/
     │   ├─ api.ts
     │   └─ apiBase.ts
     │
     ├─ pages/
     │   └─ Index.tsx
     │
     ├─ App.tsx
     ├─ main.tsx
     └─ styles/index.css

## Tech Stack

### Frontend

-   React 19\
-   TypeScript\
-   React Router\
-   Vite\
-   Tailwind CSS\
-   shadcn/ui\
-   lucide-react icons

### Animations

-   GSAP\
-   ScrollTrigger plugin

### Extra UX Libraries

-   Sonner\
-   shadcn Toaster\
-   Radix Tooltip Provider\
-   Streaming text library

## Key Architectural Concepts

### 1. **Design Tokens**

All colors, gradients, shadows, radii, and animations are defined in
`index.css`.

### 2. **API Helper Layer**

Typed API functions stored in `/lib`.

### 3. **GSAP Lifecycle Safety**

All GSAP animations have cleanup & reinit logic.

## Setup & Development

### Install

    npm install

### Run Dev Server

    npm run dev

### Build

    npm run build

### Preview

    npm run preview

## 🔧 Environment Variables

Create `.env`:

    VITE_API_BASE_URL=http://localhost:3000

------------------------------------------------------------------------
