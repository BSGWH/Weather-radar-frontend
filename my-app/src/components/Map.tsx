"use client";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, ImageOverlay, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  refreshKey: number;
  onLoad: () => void;
  onError: () => void;
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
  // CONUS bounds [southWest, northEast]
  const bounds: [[number, number], [number, number]] = [
    [24.396308, -124.848974],
    [49.384358, -66.885444],
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
        onLoad={onLoad}
        onError={onError}
      />
    </MapContainer>
  );
}
