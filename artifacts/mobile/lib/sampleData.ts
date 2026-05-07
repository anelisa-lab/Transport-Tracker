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
    name: "Route 12 — Soweto Express",
    from: "Soweto Bus Terminal",
    to: "University of Johannesburg",
    departureTime: "07:00",
    arrivalTime: "07:45",
    stops: ["Soweto Bus Terminal", "Dobsonville", "Florida Park", "University of Johannesburg"],
    fare: 18.50,
    status: "on-time",
  },
  {
    id: "r2",
    name: "Route 7 — Sandton Loop",
    from: "Park Station",
    to: "Sandton City",
    departureTime: "07:30",
    arrivalTime: "08:10",
    stops: ["Park Station", "Braamfontein", "Rosebank", "Sandton City"],
    fare: 23.00,
    status: "on-time",
  },
  {
    id: "r3",
    name: "Route 23 — Tshwane Shuttle",
    from: "Johannesburg CBD",
    to: "Hatfield, Pretoria",
    departureTime: "08:00",
    arrivalTime: "09:10",
    stops: ["Johannesburg CBD", "Midrand", "Centurion", "Hatfield, Pretoria"],
    fare: 42.00,
    status: "delayed",
  },
  {
    id: "r4",
    name: "Route 5 — Wits Campus Connect",
    from: "Auckland Park",
    to: "Wits University",
    departureTime: "07:15",
    arrivalTime: "07:35",
    stops: ["Auckland Park", "Brixton", "Melville", "Wits University"],
    fare: 14.00,
    status: "on-time",
  },
  {
    id: "r5",
    name: "Route 18 — East Rand Link",
    from: "Kempton Park",
    to: "UJ East Campus",
    departureTime: "06:45",
    arrivalTime: "07:30",
    stops: ["Kempton Park", "Boksburg", "Germiston", "UJ East Campus"],
    fare: 32.00,
    status: "on-time",
  },
];

export const sampleStops: Stop[] = [
  {
    id: "s1",
    name: "Park Station",
    routes: ["Route 7", "Route 12", "Route 23"],
    zone: "A",
    facilities: ["Shelter", "Bench", "Real-time display", "Ticket machine"],
  },
  {
    id: "s2",
    name: "Wits University",
    routes: ["Route 5", "Route 12", "Route 9"],
    zone: "A",
    facilities: ["Shelter", "Bench", "Bike rack"],
  },
  {
    id: "s3",
    name: "Sandton City",
    routes: ["Route 7", "Route 11", "Route 15"],
    zone: "B",
    facilities: ["Shelter", "Bench", "Ticket machine", "Real-time display"],
  },
  {
    id: "s4",
    name: "Soweto Bus Terminal",
    routes: ["Route 12", "Route 3", "Route 6"],
    zone: "C",
    facilities: ["Shelter", "Bench"],
  },
  {
    id: "s5",
    name: "Rosebank",
    routes: ["Route 7", "Route 4"],
    zone: "B",
    facilities: ["Shelter", "Real-time display"],
  },
  {
    id: "s6",
    name: "Hatfield, Pretoria",
    routes: ["Route 23", "Route 19"],
    zone: "D",
    facilities: ["Shelter", "Bench", "Ticket machine"],
  },
  {
    id: "s7",
    name: "Braamfontein",
    routes: ["Route 7", "Route 5", "Route 8"],
    zone: "A",
    facilities: ["Shelter", "Bike rack"],
  },
  {
    id: "s8",
    name: "Midrand",
    routes: ["Route 23", "Route 16"],
    zone: "C",
    facilities: ["Shelter"],
  },
];

export const sampleAlerts: Alert[] = [
  {
    id: "a1",
    title: "Route 23 Delay",
    message: "Route 23 Tshwane Shuttle is running approximately 20 minutes late due to roadworks on the N1 between Midrand and Centurion.",
    type: "warning",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "a2",
    title: "Additional Morning Departures",
    message: "From Monday, Route 12 Soweto Express will have additional departures at 06:30 and 06:45 to accommodate increased student demand.",
    type: "info",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "a3",
    title: "Park Station Bay 4 Closed",
    message: "Park Station Bay 4 is closed for maintenance until Sunday. All Route 7 and Route 23 departures will use Bay 2.",
    type: "critical",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "a4",
    title: "Student Card Renewals",
    message: "Student concession cards expire at end of June. Renew at any major terminal or via the university transport office.",
    type: "info",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
];

export const sampleFareRules: FareRule[] = [
  { id: "f1", fromZone: "A", toZone: "A", price: 15.00, studentPrice: 7.50 },
  { id: "f2", fromZone: "A", toZone: "B", price: 23.00, studentPrice: 11.50 },
  { id: "f3", fromZone: "A", toZone: "C", price: 32.00, studentPrice: 16.00 },
  { id: "f4", fromZone: "A", toZone: "D", price: 45.00, studentPrice: 22.50 },
  { id: "f5", fromZone: "B", toZone: "B", price: 15.00, studentPrice: 7.50 },
  { id: "f6", fromZone: "B", toZone: "C", price: 23.00, studentPrice: 11.50 },
  { id: "f7", fromZone: "B", toZone: "D", price: 35.00, studentPrice: 17.50 },
  { id: "f8", fromZone: "C", toZone: "C", price: 15.00, studentPrice: 7.50 },
  { id: "f9", fromZone: "C", toZone: "D", price: 25.00, studentPrice: 12.50 },
  { id: "f10", fromZone: "D", toZone: "D", price: 15.00, studentPrice: 7.50 },
];

export const zones = ["A", "B", "C", "D"];

export const zoneLabels: Record<string, string> = {
  A: "Zone A — Johannesburg CBD",
  B: "Zone B — Inner Suburbs",
  C: "Zone C — Outer Suburbs",
  D: "Zone D — Greater Gauteng",
};
