"use client";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, ImageOverlay, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  refreshKey: number;
  opacity: number;
  onLoad: () => void;
  onError: () => void;
}

// Component to handle image overlay events
function RadarOverlay({
  imageUrl,
  bounds,
  opacity,
  onLoad,
  onError,
}: {
  imageUrl: string;
  bounds: [[number, number], [number, number]];
  opacity: number;
  onLoad: () => void;
  onError: (error?: any) => void;
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

    img.onerror = async () => {
      // console.error("Failed to load radar image");

      // Try to fetch to get the actual error response
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ detail: "Failed to load radar image" }));
          onError({ status: response.status, message: errorData.detail });
        } else {
          onError({ message: "Failed to load image" });
        }
      } catch (err) {
        onError({ message: "Network error" });
      }
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
    <ImageOverlay
      ref={overlayRef}
      url={imageUrl}
      bounds={bounds}
      opacity={opacity}
    />
  );
}

export default function Map({
  refreshKey,
  opacity,
  onLoad,
  onError,
}: MapProps) {
  // CONUS bounds [southWest, northEast]
  const bounds: [[number, number], [number, number]] = [
    [20.005001, -129.995],
    [54.995, -60.005002],
  ];

  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/radar/radar.png?ts=${refreshKey}`;

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
        opacity={opacity}
        onLoad={onLoad}
        onError={onError}
      />
    </MapContainer>
  );
}
