import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { useColors } from "@/hooks/useColors";
import { Stop } from "@/lib/sampleData";

const ZONE_COLORS: Record<string, string> = {
  A: "#2563EB",
  B: "#7C3AED",
  C: "#059669",
  D: "#D97706",
};

const GAUTENG_REGION = {
  latitude: -26.0274,
  longitude: 28.0878,
  latitudeDelta: 0.85,
  longitudeDelta: 0.85,
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
    <View
      style={[
        styles.facilityChip,
        { backgroundColor: colors.muted, borderRadius: 6, borderColor: colors.border },
      ]}
    >
      <Ionicons
        name={icons[label] ?? "checkmark-circle-outline"}
        size={12}
        color={colors.mutedForeground}
      />
      <Text style={[styles.facilityText, { color: colors.mutedForeground }]}>
        {label}
      </Text>
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

export default function StopsMap({ stops }: { stops: Stop[] }) {
  const colors = useColors();
  const mapRef = useRef<MapView>(null);
  const [selected, setSelected] = useState<Stop | null>(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={GAUTENG_REGION}
        showsUserLocation={false}
        showsCompass
        showsScale
      >
        {stops.map((stop) => {
          const zoneColor = ZONE_COLORS[stop.zone] ?? "#2563EB";
          const isSelected = selected?.id === stop.id;
          return (
            <Marker
              key={stop.id}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              onPress={() => setSelected(isSelected ? null : stop)}
            >
              <View
                style={[
                  styles.markerOuter,
                  {
                    backgroundColor: isSelected ? zoneColor : "#FFFFFF",
                    borderColor: zoneColor,
                    transform: [{ scale: isSelected ? 1.2 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name="bus"
                  size={14}
                  color={isSelected ? "#FFFFFF" : zoneColor}
                />
              </View>
              <View style={[styles.markerTail, { backgroundColor: zoneColor }]} />
            </Marker>
          );
        })}
      </MapView>

      {/* Selected stop info card */}
      {selected && (
        <View
          style={[
            styles.calloutCard,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.calloutHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.calloutName, { color: colors.foreground }]}>
                {selected.name}
              </Text>
              <Text style={[styles.calloutRoutes, { color: colors.mutedForeground }]}>
                {selected.routes.join(" · ")}
              </Text>
            </View>
            <View style={styles.calloutRight}>
              <ZoneBadge zone={selected.zone} />
              <Pressable onPress={() => setSelected(null)} style={styles.calloutClose}>
                <Ionicons name="close" size={16} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>
          <View style={styles.calloutFacilities}>
            {selected.facilities.map((f) => (
              <FacilityChip key={f} label={f} />
            ))}
          </View>
        </View>
      )}

      {/* Zone legend */}
      <View
        style={[
          styles.legend,
          {
            backgroundColor: colors.card,
            borderRadius: colors.radius - 4,
            borderColor: colors.border,
          },
        ]}
      >
        {Object.entries(ZONE_COLORS).map(([zone, color]) => (
          <View key={zone} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>
              {zone}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  markerOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  markerTail: {
    width: 4,
    height: 8,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: -2,
  },
  calloutCard: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  calloutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  calloutName: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 3 },
  calloutRoutes: { fontSize: 12, fontFamily: "Inter_400Regular" },
  calloutRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  calloutClose: { padding: 2 },
  calloutFacilities: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  zoneBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  zoneText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  legend: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 10,
    gap: 6,
    borderWidth: 1,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  facilityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  facilityText: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
