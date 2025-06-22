"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2Icon, RefreshCwIcon, ClockIcon } from "lucide-react";
import { toast } from "sonner";
// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

function ButtonLoading() {
  return (
    <Button size="sm" disabled>
      <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
      Please wait
    </Button>
  );
}

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [loading, setLoading] = useState(true); // Start with loading true
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [opacity, setOpacity] = useState(1);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey(Date.now());
  };

  const handleLoad = useCallback(() => {
    setLoading(false);
    setLastUpdated(new Date());
  }, []);

  const handleError = useCallback((err?: any) => {
    setLoading(false);
    if (err?.status === 429) {
      toast("Too many requests. Please wait a minute before trying again.");
    } else {
      toast("Failed to load radar image. Please try again.");
    }
  }, []);

  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weather Radar</CardTitle>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ClockIcon className="h-4 w-4" />
                  <span>Last updated: {formatTimestamp(lastUpdated)}</span>
                </div>
              )}
              {loading ? (
                <ButtonLoading />
              ) : (
                <Button
                  onClick={handleRefresh}
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                >
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="opacity-slider" className="min-w-[80px]">
                Opacity:
              </Label>
              <div className="flex items-center gap-3 w-64">
                <Slider
                  id="opacity-slider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[opacity]}
                  onValueChange={handleOpacityChange}
                  className="flex-1"
                />
              </div>
              <span className="min-w-[40px] text-sm text-muted-foreground">
                {Math.round(opacity * 100)}%
              </span>
            </div>
            <div className="h-[600px] w-full">
              <Map
                refreshKey={refreshKey}
                opacity={opacity}
                onLoad={handleLoad}
                onError={handleError}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Powered by{" "}
            <a
              href="https://mrms.ncep.noaa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              MRMS NOAA
            </a>
          </div>
          <div>Created by Weihao</div>
        </CardFooter>
      </Card>
    </div>
  );
}
