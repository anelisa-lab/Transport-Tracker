import { useEffect, useState } from "react";

import { Coord, Route } from "@/lib/sampleData";

export interface VehicleState {
  routeId: string;
  routeName: string;
  shortName: string;
  color: string;
  position: Coord;
  progress: number;
  etaMinutes: number;
  status: Route["status"];
}

function getJourneyMinutes(route: Route): number {
  const [dh, dm] = route.departureTime.split(":").map(Number);
  const [ah, am] = route.arrivalTime.split(":").map(Number);
  return ah * 60 + am - (dh * 60 + dm);
}

function interpolate(path: Coord[], progress: number): Coord {
  if (path.length === 0) return { latitude: 0, longitude: 0 };
  if (path.length === 1) return path[0];
  const p = Math.max(0, Math.min(1, progress));
  const n = path.length - 1;
  const f = p * n;
  const i = Math.min(Math.floor(f), n - 1);
  const t = f - i;
  return {
    latitude: path[i].latitude + (path[i + 1].latitude - path[i].latitude) * t,
    longitude: path[i].longitude + (path[i + 1].longitude - path[i].longitude) * t,
  };
}

function compute(routes: Route[]): VehicleState[] {
  const nowSec = Date.now() / 1000;
  return routes
    .filter((r) => r.path.length > 0)
    .map((r) => {
      const journeyMin = getJourneyMinutes(r);
      const cycleSec = Math.max(journeyMin * 60, 1);
      const progress = (nowSec % cycleSec) / cycleSec;
      const etaMinutes = Math.max(0, Math.round((1 - progress) * journeyMin));
      return {
        routeId: r.id,
        routeName: r.name,
        shortName: r.name.split("—")[1]?.trim() ?? r.name,
        color: r.color,
        position: interpolate(r.path, progress),
        progress,
        etaMinutes,
        status: r.status,
      };
    });
}

export function useVehicleSimulation(routes: Route[]): VehicleState[] {
  const [vehicles, setVehicles] = useState<VehicleState[]>(() =>
    compute(routes)
  );

  useEffect(() => {
    setVehicles(compute(routes));
    const id = setInterval(() => setVehicles(compute(routes)), 3000);
    return () => clearInterval(id);
  }, []);

  return vehicles;
}
