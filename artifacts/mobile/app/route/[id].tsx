import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFavourites } from "@/context/FavouritesContext";
import { useColors } from "@/hooks/useColors";
import { useVehicleSimulation } from "@/hooks/useVehicleSimulation";
import { sampleRoutes } from "@/lib/sampleData";

function capacityForRoute(routeId: string): number {
  const seed = routeId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 20 + (seed % 76);
}

function stopTime(
  departureTime: string,
  arrivalTime: string,
  index: number,
  total: number
): string {
  const [dh, dm] = departureTime.split(":").map(Number);
  const [ah, am] = arrivalTime.split(":").map(Number);
  const dMin = dh * 60 + dm;
  const aMin = ah * 60 + am;
  const diffMin = aMin - dMin;
  const t = total <= 1 ? 0 : index / (total - 1);
  const stopMin = Math.round(dMin + t * diffMin);
  const h = Math.floor(stopMin / 60) % 24;
  const m = stopMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const STATUS_CONFIG = {
  "on-time": { color: "#059669", label: "On Time" },
  delayed: { color: "#D97706", label: "Delayed" },
  cancelled: { color: "#DC2626", label: "Cancelled" },
} as const;

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { favRoutes, toggleFavRoute } = useFavourites();

  const route = sampleRoutes.find((r) => r.id === id);
  const vehicles = useVehicleSimulation(sampleRoutes);
  const vehicle = vehicles.find((v) => v.routeId === id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!route) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: topPad + 8 },
        ]}
      >
        <Pressable style={styles.backBtnDark} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.empty}>
          <Ionicons name="map-outline" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Route not found
          </Text>
        </View>
      </View>
    );
  }

  const status = STATUS_CONFIG[route.status];
  const isFav = favRoutes.includes(route.id);
  const capacity = capacityForRoute(route.id);
  const capColor =
    capacity < 40 ? "#059669" : capacity < 75 ? "#D97706" : "#DC2626";
  const capLabel = capacity < 40 ? "Low" : capacity < 75 ? "Moderate" : "High";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: route.color }]}>
        <View style={styles.headerRow}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </Pressable>
          <Pressable
            style={styles.headerBtn}
            onPress={() => toggleFavRoute(route.id)}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={22}
              color="#FFF"
            />
          </Pressable>
        </View>

        <View style={styles.headerContent}>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: "rgba(0,0,0,0.2)" },
            ]}
          >
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={styles.statusPillText}>{status.label}</Text>
          </View>
          <Text style={styles.routeNumber}>
            {route.name.split("—")[0].trim()}
          </Text>
          <Text style={styles.routeLabel}>
            {route.name.split("—")[1]?.trim() ?? route.name}
          </Text>
          <Text style={styles.routeDirection}>
            {route.from} → {route.to}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.timingRow,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.timingItem}>
          <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.timingLabel, { color: colors.mutedForeground }]}>
            Departs
          </Text>
          <Text style={[styles.timingValue, { color: colors.foreground }]}>
            {route.departureTime}
          </Text>
        </View>
        <View style={[styles.timingDiv, { backgroundColor: colors.border }]} />
        <View style={styles.timingItem}>
          <Ionicons name="flag-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.timingLabel, { color: colors.mutedForeground }]}>
            Arrives
          </Text>
          <Text style={[styles.timingValue, { color: colors.foreground }]}>
            {route.arrivalTime}
          </Text>
        </View>
        <View style={[styles.timingDiv, { backgroundColor: colors.border }]} />
        <View style={styles.timingItem}>
          <Ionicons name="card-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.timingLabel, { color: colors.mutedForeground }]}>
            Fare
          </Text>
          <Text style={[styles.timingValue, { color: colors.primary }]}>
            R{route.fare.toFixed(2)}
          </Text>
        </View>
      </View>

      {vehicle && (
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
              borderColor: route.color + "40",
            },
          ]}
        >
          <View style={styles.etaHeaderRow}>
            <View
              style={[
                styles.livePill,
                { backgroundColor: route.color + "20" },
              ]}
            >
              <View style={[styles.liveDot, { backgroundColor: route.color }]} />
              <Text style={[styles.liveText, { color: route.color }]}>LIVE</Text>
            </View>
            <Text style={[styles.etaValue, { color: route.color }]}>
              {vehicle.etaMinutes} min
            </Text>
          </View>
          <Text style={[styles.etaDesc, { color: colors.mutedForeground }]}>
            Estimated arrival at terminal
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(vehicle.progress * 100)}%` as `${number}%`,
                  backgroundColor: route.color,
                },
              ]}
            />
          </View>
          <View style={styles.progressEnds}>
            <Text style={[styles.progressEnd, { color: colors.mutedForeground }]}>
              {route.from}
            </Text>
            <Text style={[styles.progressEnd, { color: colors.mutedForeground }]}>
              {route.to}
            </Text>
          </View>
        </View>
      )}

      <View
        style={[
          styles.section,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.capHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Capacity
          </Text>
          <View
            style={[styles.capBadge, { backgroundColor: capColor + "20" }]}
          >
            <Text style={[styles.capBadgeText, { color: capColor }]}>
              {capLabel}
            </Text>
          </View>
        </View>
        <View style={[styles.capTrack, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.capFill,
              {
                width: `${capacity}%` as `${number}%`,
                backgroundColor: capColor,
              },
            ]}
          />
        </View>
        <Text style={[styles.capPercent, { color: colors.mutedForeground }]}>
          {capacity}% of seats occupied
        </Text>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.foreground, marginBottom: 16 },
          ]}
        >
          Stop Sequence
        </Text>
        {route.stops.map((stop, i) => {
          const isFirst = i === 0;
          const isLast = i === route.stops.length - 1;
          const t = stopTime(
            route.departureTime,
            route.arrivalTime,
            i,
            route.stops.length
          );
          return (
            <View key={stop} style={styles.stopRow}>
              <View style={styles.stopTimeline}>
                <View
                  style={[
                    styles.stopDot,
                    {
                      backgroundColor:
                        isFirst || isLast ? route.color : colors.card,
                      borderColor:
                        isFirst || isLast ? route.color : colors.border,
                    },
                  ]}
                />
                {!isLast && (
                  <View
                    style={[styles.stopLine, { backgroundColor: colors.border }]}
                  />
                )}
              </View>
              <View style={styles.stopContent}>
                <Text
                  style={[
                    styles.stopName,
                    {
                      color: colors.foreground,
                      fontFamily:
                        isFirst || isLast
                          ? "Inter_600SemiBold"
                          : "Inter_500Medium",
                    },
                  ]}
                >
                  {stop}
                </Text>
                <Text
                  style={[styles.stopTime, { color: colors.mutedForeground }]}
                >
                  {t}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  headerContent: { gap: 4 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusPillText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  routeNumber: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.75)",
  },
  routeLabel: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  routeDirection: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  timingRow: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  timingItem: { flex: 1, alignItems: "center", gap: 4 },
  timingLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  timingValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  timingDiv: { width: 1, marginVertical: 4 },
  section: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  etaHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  etaValue: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  etaDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 10,
  },
  progressTrack: { height: 7, borderRadius: 4, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: "100%", borderRadius: 4 },
  progressEnds: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressEnd: { fontSize: 11, fontFamily: "Inter_400Regular" },
  capHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  capBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  capBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  capTrack: { height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 6 },
  capFill: { height: "100%", borderRadius: 4 },
  capPercent: { fontSize: 12, fontFamily: "Inter_400Regular" },
  stopRow: {
    flexDirection: "row",
    gap: 12,
  },
  stopTimeline: {
    alignItems: "center",
    width: 18,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginTop: 3,
  },
  stopLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    marginTop: 2,
  },
  stopContent: { flex: 1, paddingBottom: 20 },
  stopName: { fontSize: 14, marginBottom: 2 },
  stopTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  backBtnDark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginBottom: 16,
  },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
