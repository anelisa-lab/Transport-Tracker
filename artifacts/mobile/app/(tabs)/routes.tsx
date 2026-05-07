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
import { Route, sampleRoutes } from "@/lib/sampleData";

function StatusBadge({ status }: { status: Route["status"] }) {
  const colors = useColors();
  const config = {
    "on-time": { color: colors.accent, label: "On Time" },
    delayed: { color: colors.warning, label: "Delayed" },
    cancelled: { color: colors.destructive, label: "Cancelled" },
  }[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: config.color + "20", borderRadius: 6 }]}>
      <View style={[styles.statusDot, { backgroundColor: config.color }]} />
      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

function RouteCard({ route }: { route: Route }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.routeCard,
        { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border, opacity: pressed ? 0.95 : 1 },
      ]}
      onPress={() => setExpanded((v) => !v)}
    >
      <View style={styles.cardTop}>
        <View style={[styles.routeNumberBadge, { backgroundColor: colors.primary, borderRadius: 8 }]}>
          <Ionicons name="bus" size={16} color="#FFFFFF" />
        </View>
        <View style={styles.routeMain}>
          <Text style={[styles.routeName, { color: colors.foreground }]}>{route.name}</Text>
          <Text style={[styles.routePath, { color: colors.mutedForeground }]}>
            {route.from} → {route.to}
          </Text>
        </View>
        <StatusBadge status={route.status} />
      </View>

      <View style={[styles.timingRow, { borderTopColor: colors.border }]}>
        <View style={styles.timingItem}>
          <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.timingLabel, { color: colors.mutedForeground }]}>Departs</Text>
          <Text style={[styles.timingValue, { color: colors.foreground }]}>{route.departureTime}</Text>
        </View>
        <View style={[styles.timingDivider, { backgroundColor: colors.border }]} />
        <View style={styles.timingItem}>
          <Ionicons name="flag-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.timingLabel, { color: colors.mutedForeground }]}>Arrives</Text>
          <Text style={[styles.timingValue, { color: colors.foreground }]}>{route.arrivalTime}</Text>
        </View>
        <View style={[styles.timingDivider, { backgroundColor: colors.border }]} />
        <View style={styles.timingItem}>
          <Ionicons name="card-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.timingLabel, { color: colors.mutedForeground }]}>Fare</Text>
          <Text style={[styles.timingValue, { color: colors.primary }]}>${route.fare.toFixed(2)}</Text>
        </View>
      </View>

      {expanded && (
        <View style={[styles.stopsSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.stopsTitle, { color: colors.mutedForeground }]}>Stops</Text>
          {route.stops.map((stop, i) => (
            <View key={stop} style={styles.stopRow}>
              <View style={[styles.stopDot, { backgroundColor: i === 0 || i === route.stops.length - 1 ? colors.primary : colors.border }]} />
              {i < route.stops.length - 1 && (
                <View style={[styles.stopLine, { backgroundColor: colors.border }]} />
              )}
              <Text style={[styles.stopName, { color: colors.foreground }]}>{stop}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.expandHint}>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.mutedForeground}
        />
      </View>
    </Pressable>
  );
}

export default function RoutesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const filtered = sampleRoutes.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.to.toLowerCase().includes(search.toLowerCase())
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Route Planner</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.muted, borderRadius: colors.radius - 4, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search routes or stops..."
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
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RouteCard route={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : 24 },
        ]}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="map-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No routes found</Text>
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
    paddingBottom: 16,
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
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  list: { padding: 16, gap: 12 },
  routeCard: { padding: 0, borderWidth: 1, overflow: "hidden" },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  routeNumberBadge: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  routeMain: { flex: 1 },
  routeName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  routePath: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  timingRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  timingItem: { flex: 1, alignItems: "center", gap: 2 },
  timingLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textTransform: "uppercase", letterSpacing: 0.3 },
  timingValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  timingDivider: { width: 1, marginVertical: 4 },
  stopsSection: { borderTopWidth: 1, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 },
  stopsTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  stopRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16, gap: 12, position: "relative" },
  stopDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  stopLine: { position: "absolute", left: 4, top: 14, width: 2, height: 20 },
  stopName: { fontSize: 13, fontFamily: "Inter_500Medium" },
  expandHint: { alignItems: "center", paddingVertical: 6 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
