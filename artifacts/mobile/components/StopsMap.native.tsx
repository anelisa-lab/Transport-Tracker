import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";

import { useColors } from "@/hooks/useColors";
import { useVehicleSimulation, VehicleState } from "@/hooks/useVehicleSimulation";
import { Route, Stop } from "@/lib/sampleData";

const ZONE_COLORS: Record<string, string> = {
  A: "#2563EB",
  B: "#7C3AED",
  C: "#059669",
  D: "#D97706",
};

const DURBAN_REGION = {
  latitude: -29.8700,
  longitude: 30.9800,
  latitudeDelta: 0.42,
  longitudeDelta: 0.42,
};

function FacilityChip({ label }: { label: string }) {
  const colors = useColors();
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Shelter: "umbrella-outline",
    Bench: "bed-outline",
    "Real-time display": "tv-outline",
    "Ticket machine": "card-outline",
    "Bike rack": "bicycle-outline",
  };
  return (
    <View style={[styles.chip, { backgroundColor: colors.muted, borderColor: colors.border }]}>
      <Ionicons name={icons[label] ?? "checkmark-circle-outline"} size={11} color={colors.mutedForeground} />
      <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function ZoneBadge({ zone }: { zone: string }) {
  const color = ZONE_COLORS[zone] ?? "#64748B";
  return (
    <View style={[styles.zoneBadge, { backgroundColor: color }]}>
      <Text style={styles.zoneText}>Zone {zone}</Text>
    </View>
  );
}

type Selection =
  | { kind: "stop"; stop: Stop }
  | { kind: "vehicle"; vehicle: VehicleState }
  | null;

export default function StopsMap({ stops, routes }: { stops: Stop[]; routes: Route[] }) {
  const colors = useColors();
  const mapRef = useRef<MapView>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const vehicles = useVehicleSimulation(routes);

  const dismiss = () => setSelection(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={DURBAN_REGION}
        showsUserLocation={false}
        showsCompass
        showsScale
      >
        {/* Route polylines */}
        {routes.map((route) => (
          <Polyline
            key={route.id}
            coordinates={route.path}
            strokeColor={route.color}
            strokeWidth={3}
            lineDashPattern={[1]}
          />
        ))}

        {/* Stop markers */}
        {stops.map((stop) => {
          const zoneColor = ZONE_COLORS[stop.zone] ?? "#2563EB";
          const isSelected =
            selection?.kind === "stop" && selection.stop.id === stop.id;
          return (
            <Marker
              key={stop.id}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              onPress={() =>
                setSelection(isSelected ? null : { kind: "stop", stop })
              }
              zIndex={1}
            >
              <View
                style={[
                  styles.stopMarker,
                  {
                    backgroundColor: isSelected ? zoneColor : "#FFFFFF",
                    borderColor: zoneColor,
                    transform: [{ scale: isSelected ? 1.25 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name="location"
                  size={13}
                  color={isSelected ? "#FFFFFF" : zoneColor}
                />
              </View>
              <View style={[styles.markerTail, { backgroundColor: zoneColor }]} />
            </Marker>
          );
        })}

        {/* Live vehicle markers */}
        {vehicles.map((v) => {
          const isSelected =
            selection?.kind === "vehicle" && selection.vehicle.routeId === v.routeId;
          return (
            <Marker
              key={`vehicle-${v.routeId}`}
              coordinate={v.position}
              onPress={() =>
                setSelection(isSelected ? null : { kind: "vehicle", vehicle: v })
              }
              zIndex={10}
            >
              <View
                style={[
                  styles.vehicleMarker,
                  {
                    backgroundColor: v.color,
                    borderColor: isSelected ? "#FFFFFF" : v.color,
                    transform: [{ scale: isSelected ? 1.3 : 1 }],
                  },
                ]}
              >
                <Ionicons name="bus" size={14} color="#FFFFFF" />
              </View>
              {isSelected && (
                <View style={[styles.etaBubble, { backgroundColor: v.color }]}>
                  <Text style={styles.etaBubbleText}>{v.etaMinutes}m</Text>
                </View>
              )}
            </Marker>
          );
        })}
      </MapView>

      {/* Bottom callout card */}
      {selection?.kind === "stop" && (
        <View style={[styles.callout, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={styles.calloutHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.calloutTitle, { color: colors.foreground }]}>
                {selection.stop.name}
              </Text>
              <Text style={[styles.calloutSub, { color: colors.mutedForeground }]}>
                {selection.stop.routes.join(" · ")}
              </Text>
            </View>
            <ZoneBadge zone={selection.stop.zone} />
            <Pressable onPress={dismiss} style={styles.closeBtn}>
              <Ionicons name="close" size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
          <View style={styles.chipRow}>
            {selection.stop.facilities.map((f) => (
              <FacilityChip key={f} label={f} />
            ))}
          </View>
        </View>
      )}

      {selection?.kind === "vehicle" && (
        <View style={[styles.callout, { backgroundColor: colors.card, borderColor: selection.vehicle.color + "60", borderRadius: colors.radius }]}>
          <View style={styles.calloutHeader}>
            <View
              style={[styles.vehicleCalloutIcon, { backgroundColor: selection.vehicle.color + "20" }]}
            >
              <Ionicons name="bus" size={20} color={selection.vehicle.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.calloutTitle, { color: colors.foreground }]}>
                {selection.vehicle.shortName}
              </Text>
              <Text style={[styles.calloutSub, { color: colors.mutedForeground }]}>
                Live vehicle · {selection.vehicle.status === "delayed" ? "Delayed" : "On time"}
              </Text>
            </View>
            <View style={styles.etaPill}>
              <Text style={[styles.etaLabel, { color: colors.mutedForeground }]}>ETA</Text>
              <Text style={[styles.etaValue, { color: selection.vehicle.color }]}>
                {selection.vehicle.etaMinutes}m
              </Text>
            </View>
            <Pressable onPress={dismiss} style={styles.closeBtn}>
              <Ionicons name="close" size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
          <View style={[styles.progressBarTrack, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.round(selection.vehicle.progress * 100)}%` as `${number}%`,
                  backgroundColor: selection.vehicle.color,
                },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
              {routes.find((r) => r.id === selection.vehicle.routeId)?.from}
            </Text>
            <Text style={[styles.progressLabelRight, { color: colors.mutedForeground }]}>
              {routes.find((r) => r.id === selection.vehicle.routeId)?.to}
            </Text>
          </View>
        </View>
      )}

      {/* Legend */}
      <View style={[styles.legend, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius - 4 }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#64748B" }]} />
          <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Stop</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="bus" size={10} color={colors.primary} />
          <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Live</Text>
        </View>
        {Object.entries(ZONE_COLORS).map(([zone, color]) => (
          <View key={zone} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>{zone}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  stopMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  markerTail: { width: 3, height: 7, borderRadius: 2, alignSelf: "center", marginTop: -2 },

  vehicleMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  etaBubble: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 2,
  },
  etaBubbleText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },

  callout: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    padding: 14,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  calloutTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 2 },
  calloutSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  closeBtn: { padding: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  chipText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  zoneBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  zoneText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#FFFFFF" },

  vehicleCalloutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  etaPill: { alignItems: "center" },
  etaLabel: { fontSize: 10, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.4 },
  etaValue: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },

  progressBarTrack: { height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  progressBarFill: { height: "100%", borderRadius: 3 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  progressLabelRight: { fontSize: 10, fontFamily: "Inter_400Regular" },

  legend: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 10,
    gap: 6,
    borderWidth: 1,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
});
