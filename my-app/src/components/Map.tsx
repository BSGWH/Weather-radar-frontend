"use client";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, ImageOverlay, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  refreshKey: number;
  onLoad: () => void;
  onError: () => void;
}

interface RadarBounds {
  min_lat: number;
  max_lat: number;
  min_lon: number;
  max_lon: number;
}

// Component to handle image overlay events
function RadarOverlay({
  imageUrl,
  bounds,
  onLoad,
  onError,
}: {
  imageUrl: string;
  bounds: [[number, number], [number, number]];
  onLoad: () => void;
  onError: () => void;
}) {
  const map = useMap();
  const overlayRef = useRef<L.ImageOverlay | null>(null);

  useEffect(() => {
    // Create a new image element to detect load/error events
    const img = new Image();

    img.onload = () => {
      console.log("Radar image loaded successfully");
      onLoad();
    };

    img.onerror = () => {
      console.error("Failed to load radar image");
      onError();
    };

    // Start loading the image
    img.src = imageUrl;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, onLoad, onError]);

  return (
    <ImageOverlay ref={overlayRef} url={imageUrl} bounds={bounds} opacity={1} />
  );
}

export default function Map({ refreshKey, onLoad, onError }: MapProps) {
  const [bounds, setBounds] = useState<
    [[number, number], [number, number]] | null
  >(null);
  const [boundsError, setBoundsError] = useState(false);

  // Fallback CONUS bounds in case the API fails
  const fallbackBounds: [[number, number], [number, number]] = [
    [24.396308, -124.848974],
    [49.384358, -66.885444],
  ];

  useEffect(() => {
    // Fetch the actual bounds from the API
    const fetchBounds = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/radar/bounds`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bounds");
        }

        const data: RadarBounds = await response.json();

        // Convert API bounds format to Leaflet format [southWest, northEast]
        const leafletBounds: [[number, number], [number, number]] = [
          [data.min_lat, data.min_lon],
          [data.max_lat, data.max_lon],
        ];

        setBounds(leafletBounds);
        setBoundsError(false);
      } catch (error) {
        console.error("Failed to fetch radar bounds, using fallback:", error);
        setBounds(fallbackBounds);
        setBoundsError(true);
      }
    };

    fetchBounds();
  }, [refreshKey]); // Re-fetch bounds when refresh occurs

  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/radar/radar.png?ts=${refreshKey}`;

  // Don't render the map until we have bounds
  if (!bounds) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-gray-500">Loading map bounds...</div>
      </div>
    );
  }

  return (
    <MapContainer
      key={refreshKey}
      bounds={bounds}
      className="h-full w-full"
      zoom={4}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <RadarOverlay
        imageUrl={imageUrl}
        bounds={bounds}
        onLoad={onLoad}
        onError={onError}
      />
      {boundsError && (
        <div className="leaflet-top leaflet-right">
          <div
            className="leaflet-control leaflet-bar"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "8px",
              marginTop: "10px",
              marginRight: "10px",
            }}
          >
            <small className="text-yellow-600">Using fallback bounds</small>
          </div>
        </div>
      )}
    </MapContainer>
  );
}
