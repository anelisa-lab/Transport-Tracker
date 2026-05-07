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
}

export interface Stop {
  id: string;
  name: string;
  routes: string[];
  zone: string;
  facilities: string[];
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
  studentPrice: number;
}

export const sampleRoutes: Route[] = [
  {
    id: "r1",
    name: "Route 12 - City Express",
    from: "Central Station",
    to: "University Campus",
    departureTime: "07:30",
    arrivalTime: "08:05",
    stops: ["Central Station", "Market Square", "City Park", "University Campus"],
    fare: 2.5,
    status: "on-time",
  },
  {
    id: "r2",
    name: "Route 7 - Suburbs Loop",
    from: "Riverside",
    to: "Shopping Mall",
    departureTime: "08:15",
    arrivalTime: "09:00",
    stops: ["Riverside", "Oak Avenue", "Pine Street", "Shopping Mall"],
    fare: 3.0,
    status: "on-time",
  },
  {
    id: "r3",
    name: "Route 23 - Night Owl",
    from: "City Center",
    to: "Northern Heights",
    departureTime: "22:00",
    arrivalTime: "22:45",
    stops: ["City Center", "Hospital Road", "Northern Heights"],
    fare: 3.5,
    status: "delayed",
  },
  {
    id: "r4",
    name: "Route 5 - Campus Connect",
    from: "Student Hub",
    to: "Research Park",
    departureTime: "09:00",
    arrivalTime: "09:25",
    stops: ["Student Hub", "Library Gate", "Science Block", "Research Park"],
    fare: 1.5,
    status: "on-time",
  },
];

export const sampleStops: Stop[] = [
  {
    id: "s1",
    name: "Central Station",
    routes: ["Route 12", "Route 5", "Route 18"],
    zone: "A",
    facilities: ["Shelter", "Bench", "Real-time display"],
  },
  {
    id: "s2",
    name: "University Campus",
    routes: ["Route 12", "Route 4", "Route 7"],
    zone: "B",
    facilities: ["Shelter", "Bike rack"],
  },
  {
    id: "s3",
    name: "Market Square",
    routes: ["Route 12", "Route 23", "Route 9"],
    zone: "A",
    facilities: ["Shelter", "Bench", "Ticket machine"],
  },
  {
    id: "s4",
    name: "Riverside",
    routes: ["Route 7", "Route 15"],
    zone: "C",
    facilities: ["Shelter"],
  },
  {
    id: "s5",
    name: "Shopping Mall",
    routes: ["Route 7", "Route 11", "Route 2"],
    zone: "B",
    facilities: ["Shelter", "Bench", "Ticket machine", "Real-time display"],
  },
  {
    id: "s6",
    name: "Hospital Road",
    routes: ["Route 23", "Route 6"],
    zone: "B",
    facilities: ["Shelter", "Bench"],
  },
];

export const sampleAlerts: Alert[] = [
  {
    id: "a1",
    title: "Route 23 Delay",
    message: "Route 23 Night Owl is running approximately 15 minutes late due to roadworks on Northern Heights Road.",
    type: "warning",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "a2",
    title: "Service Update",
    message: "From Monday, Route 12 will have additional departures at 07:00 and 07:15 to serve increased student demand.",
    type: "info",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "a3",
    title: "Platform Closure",
    message: "Central Station Platform 4 is closed for maintenance until Sunday. Please use Platform 2 for all Route 12 departures.",
    type: "critical",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "a4",
    title: "Fare Increase Notice",
    message: "Student concession fares will be updated on 1st June. New rates will be published on the website.",
    type: "info",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
];

export const sampleFareRules: FareRule[] = [
  { id: "f1", fromZone: "A", toZone: "A", price: 1.5, studentPrice: 0.75 },
  { id: "f2", fromZone: "A", toZone: "B", price: 2.5, studentPrice: 1.25 },
  { id: "f3", fromZone: "A", toZone: "C", price: 3.5, studentPrice: 1.75 },
  { id: "f4", fromZone: "A", toZone: "D", price: 4.5, studentPrice: 2.25 },
  { id: "f5", fromZone: "B", toZone: "B", price: 1.5, studentPrice: 0.75 },
  { id: "f6", fromZone: "B", toZone: "C", price: 2.5, studentPrice: 1.25 },
  { id: "f7", fromZone: "B", toZone: "D", price: 3.5, studentPrice: 1.75 },
  { id: "f8", fromZone: "C", toZone: "C", price: 1.5, studentPrice: 0.75 },
  { id: "f9", fromZone: "C", toZone: "D", price: 2.5, studentPrice: 1.25 },
  { id: "f10", fromZone: "D", toZone: "D", price: 1.5, studentPrice: 0.75 },
];

export const zones = ["A", "B", "C", "D"];

export const zoneLabels: Record<string, string> = {
  A: "Zone A — City Center",
  B: "Zone B — Inner Suburbs",
  C: "Zone C — Outer Suburbs",
  D: "Zone D — Rural",
};
