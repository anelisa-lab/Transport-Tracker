import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Stop, sampleStops } from "@/lib/sampleData";

const ZONE_COLORS: Record<string, string> = {
  A: "#2563EB",
  B: "#7C3AED",
  C: "#059669",
  D: "#D97706",
};

function ZoneBadge({ zone }: { zone: string }) {
  const color = ZONE_COLORS[zone] ?? "#64748B";
  return (
    <View style={[styles.zoneBadge, { backgroundColor: color }]}>
      <Text style={styles.zoneText}>Zone {zone}</Text>
    </View>
  );
}

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
    <View style={[styles.facilityChip, { backgroundColor: colors.muted, borderRadius: 6, borderColor: colors.border }]}>
      <Ionicons name={icons[label] ?? "checkmark-circle-outline"} size={12} color={colors.mutedForeground} />
      <Text style={[styles.facilityText, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function StopCard({ stop }: { stop: Stop }) {
  const colors = useColors();
  return (
    <View style={[styles.stopCard, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}>
      <View style={styles.stopHeader}>
        <View style={[styles.stopIconBadge, { backgroundColor: colors.primary + "15", borderRadius: 10 }]}>
          <Ionicons name="location" size={20} color={colors.primary} />
        </View>
        <View style={styles.stopInfo}>
          <Text style={[styles.stopName, { color: colors.foreground }]}>{stop.name}</Text>
          <Text style={[styles.routeCount, { color: colors.mutedForeground }]}>
            {stop.routes.length} route{stop.routes.length !== 1 ? "s" : ""} served
          </Text>
        </View>
        <ZoneBadge zone={stop.zone} />
      </View>

      <View style={[styles.routesList, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Routes</Text>
        <View style={styles.routeTags}>
          {stop.routes.map((route) => (
            <View key={route} style={[styles.routeTag, { backgroundColor: colors.secondary, borderRadius: 6 }]}>
              <Text style={[styles.routeTagText, { color: colors.primary }]}>{route}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.facilitiesList, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Facilities</Text>
        <View style={styles.facilitiesRow}>
          {stop.facilities.map((f) => (
            <FacilityChip key={f} label={f} />
          ))}
        </View>
      </View>
    </View>
  );
}

export default function StopsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const filtered = sampleStops.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.routes.some((r) => r.toLowerCase().includes(search.toLowerCase()));
    const matchZone = !selectedZone || s.zone === selectedZone;
    return matchSearch && matchZone;
  });

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Stops</Text>

        <View style={[styles.searchBar, { backgroundColor: colors.muted, borderRadius: colors.radius - 4, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search stops or routes..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        <View style={styles.zoneFilters}>
          <Pressable
            style={({ pressed }) => [
              styles.zoneFilter,
              { borderRadius: colors.radius - 6, backgroundColor: !selectedZone ? colors.primary : colors.muted, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => setSelectedZone(null)}
          >
            <Text style={[styles.zoneFilterText, { color: !selectedZone ? "#FFFFFF" : colors.mutedForeground }]}>All</Text>
          </Pressable>
          {["A", "B", "C", "D"].map((zone) => (
            <Pressable
              key={zone}
              style={({ pressed }) => [
                styles.zoneFilter,
                {
                  borderRadius: colors.radius - 6,
                  backgroundColor: selectedZone === zone ? ZONE_COLORS[zone] : colors.muted,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() => setSelectedZone(selectedZone === zone ? null : zone)}
            >
              <Text style={[styles.zoneFilterText, { color: selectedZone === zone ? "#FFFFFF" : colors.mutedForeground }]}>
                Zone {zone}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StopCard stop={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : 24 },
        ]}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="location-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No stops found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5, marginBottom: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  zoneFilters: { flexDirection: "row", gap: 8 },
  zoneFilter: { paddingHorizontal: 12, paddingVertical: 6 },
  zoneFilterText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  list: { padding: 16, gap: 12 },
  stopCard: { borderWidth: 1, overflow: "hidden" },
  stopHeader: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  stopIconBadge: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  stopInfo: { flex: 1 },
  stopName: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  routeCount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  zoneBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  zoneText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  routesList: { borderTopWidth: 1, padding: 12 },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  routeTags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  routeTag: { paddingHorizontal: 10, paddingVertical: 4 },
  routeTagText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  facilitiesList: { borderTopWidth: 1, padding: 12 },
  facilitiesRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  facilityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  facilityText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
