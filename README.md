# Weather Radar UI

A real-time weather radar visualization application frontend built with Next.js and Leaflet. This application displays CONUS (Continental United States) weather radar data powered by MRMS NOAA.

## Features

- 🗺️ Interactive map with weather radar overlay
- 🔄 Real-time refresh capability with loading states
- ⏰ Last updated timestamp display
- 📱 Responsive design with zoom in and zoom out

## Tech Stack

- **Frontend Framework**: Next.js 15.3.4
- **UI Components**: shadcn/ui
- **Map Library**: React Leaflet
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- npm or yarn package manager
- Backend API serving radar images

## Installation

1. Clone the repository:

```bash
git clone https://github.com/BSGWH/Weather-radar-frontend.git
cd Weather-radar-frontend/my-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
touch .env.local
```

4. Configure your environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Components

### Home Component (`app/page.tsx`)

- Manages the main application state
- Handles refresh functionality
- Displays loading states and timestamps

### Map Component (`components/Map.tsx`)

- Renders the interactive Leaflet map
- Displays the radar image overlay
- Handles image loading/error events

## Deployment

### Vercel

```bash
npm run build
vercel deploy
```

### Environment Variables for Production

Ensure you set the following in your production environment:

- `NEXT_PUBLIC_API_URL`: https://weather-radar-backend.onrender.com
