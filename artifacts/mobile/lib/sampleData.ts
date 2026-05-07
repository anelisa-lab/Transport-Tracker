export interface Coord {
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  stops: string[];
  fare: number;
  status: "on-time" | "delayed" | "cancelled";
  color: string;
  path: Coord[];
}

export interface Stop {
  id: string;
  name: string;
  routes: string[];
  zone: string;
  facilities: string[];
  latitude: number;
  longitude: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical";
  createdAt: string;
  isActive: boolean;
}

export interface FareRule {
  id: string;
  fromZone: string;
  toZone: string;
  price: number;
}

export const sampleRoutes: Route[] = [
  {
    id: "r1",
    name: "Route 10 — Pinetown Express",
    from: "Pinetown",
    to: "Durban Station",
    departureTime: "06:30",
    arrivalTime: "07:20",
    stops: ["Pinetown", "Westville", "UKZN Howard College", "Durban Station"],
    fare: 25.00,
    status: "on-time",
    color: "#2563EB",
    path: [
      { latitude: -29.8174, longitude: 30.8558 },
      { latitude: -29.8240, longitude: 30.8820 },
      { latitude: -29.8389, longitude: 30.9317 },
      { latitude: -29.8510, longitude: 30.9560 },
      { latitude: -29.8672, longitude: 30.9800 },
      { latitude: -29.8650, longitude: 30.9980 },
      { latitude: -29.8610, longitude: 31.0120 },
      { latitude: -29.8579, longitude: 31.0292 },
    ],
  },
  {
    id: "r2",
    name: "Route 7 — Umhlanga Connect",
    from: "Durban Station",
    to: "Gateway (Umhlanga)",
    departureTime: "07:00",
    arrivalTime: "07:50",
    stops: ["Durban Station", "Berea", "Gateway (Umhlanga)"],
    fare: 28.00,
    status: "on-time",
    color: "#7C3AED",
    path: [
      { latitude: -29.8579, longitude: 31.0292 },
      { latitude: -29.8500, longitude: 31.0210 },
      { latitude: -29.8432, longitude: 31.0050 },
      { latitude: -29.8310, longitude: 31.0200 },
      { latitude: -29.8100, longitude: 31.0400 },
      { latitude: -29.7900, longitude: 31.0550 },
      { latitude: -29.7680, longitude: 31.0680 },
      { latitude: -29.7348, longitude: 31.0758 },
    ],
  },
  {
    id: "r3",
    name: "Route 3 — UKZN Shuttle",
    from: "Chatsworth",
    to: "UKZN Howard College",
    departureTime: "07:15",
    arrivalTime: "07:55",
    stops: ["Chatsworth", "Musgrave Centre", "UKZN Howard College"],
    fare: 22.00,
    status: "on-time",
    color: "#059669",
    path: [
      { latitude: -29.9000, longitude: 30.9069 },
      { latitude: -29.8850, longitude: 30.9200 },
      { latitude: -29.8720, longitude: 30.9420 },
      { latitude: -29.8614, longitude: 30.9888 },
      { latitude: -29.8640, longitude: 30.9840 },
      { latitude: -29.8672, longitude: 30.9800 },
    ],
  },
  {
    id: "r4",
    name: "Route 15 — Berea Circuit",
    from: "Durban Station",
    to: "UKZN Howard College",
    departureTime: "07:30",
    arrivalTime: "08:15",
    stops: ["Durban Station", "Berea", "Musgrave Centre", "UKZN Howard College"],
    fare: 18.00,
    status: "delayed",
    color: "#D97706",
    path: [
      { latitude: -29.8579, longitude: 31.0292 },
      { latitude: -29.8520, longitude: 31.0180 },
      { latitude: -29.8432, longitude: 31.0050 },
      { latitude: -29.8520, longitude: 30.9960 },
      { latitude: -29.8614, longitude: 30.9888 },
      { latitude: -29.8650, longitude: 30.9840 },
      { latitude: -29.8672, longitude: 30.9800 },
    ],
  },
  {
    id: "r5",
    name: "Route 22 — Amanzimtoti Link",
    from: "Amanzimtoti",
    to: "Durban Station",
    departureTime: "06:45",
    arrivalTime: "07:40",
    stops: ["Amanzimtoti", "Chatsworth", "Durban Station"],
    fare: 35.00,
    status: "on-time",
    color: "#DC2626",
    path: [
      { latitude: -29.9714, longitude: 30.9003 },
      { latitude: -29.9500, longitude: 30.9020 },
      { latitude: -29.9200, longitude: 30.9050 },
      { latitude: -29.9000, longitude: 30.9069 },
      { latitude: -29.8820, longitude: 30.9200 },
      { latitude: -29.8700, longitude: 30.9500 },
      { latitude: -29.8620, longitude: 30.9800 },
      { latitude: -29.8590, longitude: 31.0100 },
      { latitude: -29.8579, longitude: 31.0292 },
    ],
  },
];

export const sampleStops: Stop[] = [
  {
    id: "s1",
    name: "Durban Station",
    routes: ["Route 10", "Route 7", "Route 22"],
    zone: "A",
    facilities: ["Shelter", "Bench", "Real-time display", "Ticket machine"],
    latitude: -29.8579,
    longitude: 31.0292,
  },
  {
    id: "s2",
    name: "UKZN Howard College",
    routes: ["Route 10", "Route 3", "Route 15"],
    zone: "A",
    facilities: ["Shelter", "Bench", "Bike rack"],
    latitude: -29.8672,
    longitude: 30.9800,
  },
  {
    id: "s3",
    name: "Gateway (Umhlanga)",
    routes: ["Route 7"],
    zone: "D",
    facilities: ["Shelter", "Bench", "Ticket machine", "Real-time display"],
    latitude: -29.7348,
    longitude: 31.0758,
  },
  {
    id: "s4",
    name: "Chatsworth",
    routes: ["Route 3", "Route 22"],
    zone: "C",
    facilities: ["Shelter", "Bench"],
    latitude: -29.9000,
    longitude: 30.9069,
  },
  {
    id: "s5",
    name: "Berea",
    routes: ["Route 7", "Route 15"],
    zone: "B",
    facilities: ["Shelter", "Real-time display"],
    latitude: -29.8432,
    longitude: 31.0050,
  },
  {
    id: "s6",
    name: "Musgrave Centre",
    routes: ["Route 3", "Route 15"],
    zone: "B",
    facilities: ["Shelter", "Bench", "Ticket machine"],
    latitude: -29.8614,
    longitude: 30.9888,
  },
  {
    id: "s7",
    name: "Westville",
    routes: ["Route 10"],
    zone: "C",
    facilities: ["Shelter", "Bike rack"],
    latitude: -29.8389,
    longitude: 30.9317,
  },
  {
    id: "s8",
    name: "Pinetown",
    routes: ["Route 10"],
    zone: "C",
    facilities: ["Shelter", "Bench"],
    latitude: -29.8174,
    longitude: 30.8558,
  },
  {
    id: "s9",
    name: "Amanzimtoti",
    routes: ["Route 22"],
    zone: "D",
    facilities: ["Shelter"],
    latitude: -29.9714,
    longitude: 30.9003,
  },
];

export const sampleAlerts: Alert[] = [
  {
    id: "a1",
    title: "Route 15 Running Late",
    message: "Route 15 Berea Circuit is running approximately 15 minutes late due to congestion on NMR Avenue near the Durban CBD.",
    type: "warning",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "a2",
    title: "Additional Morning Trips",
    message: "From Monday, Route 10 Pinetown Express will have an extra departure at 06:00 to accommodate morning peak demand.",
    type: "info",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "a3",
    title: "Durban Station Bay 3 Closed",
    message: "Bay 3 at Durban Station is closed for refurbishment until Friday. Route 7 and Route 22 will depart from Bay 1.",
    type: "critical",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "a4",
    title: "New Weekend Services",
    message: "Weekend services on Route 7 Umhlanga Connect now run from 07:00 to 21:00. Check the routes tab for the full schedule.",
    type: "info",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
];

export const sampleFareRules: FareRule[] = [
  { id: "f1", fromZone: "A", toZone: "A", price: 15.00 },
  { id: "f2", fromZone: "A", toZone: "B", price: 23.00 },
  { id: "f3", fromZone: "A", toZone: "C", price: 32.00 },
  { id: "f4", fromZone: "A", toZone: "D", price: 45.00 },
  { id: "f5", fromZone: "B", toZone: "B", price: 15.00 },
  { id: "f6", fromZone: "B", toZone: "C", price: 23.00 },
  { id: "f7", fromZone: "B", toZone: "D", price: 35.00 },
  { id: "f8", fromZone: "C", toZone: "C", price: 15.00 },
  { id: "f9", fromZone: "C", toZone: "D", price: 25.00 },
  { id: "f10", fromZone: "D", toZone: "D", price: 15.00 },
];

export const zones = ["A", "B", "C", "D"];

export const zoneLabels: Record<string, string> = {
  A: "Zone A — Durban CBD",
  B: "Zone B — Inner Suburbs",
  C: "Zone C — Outer Suburbs",
  D: "Zone D — Greater Durban",
};
