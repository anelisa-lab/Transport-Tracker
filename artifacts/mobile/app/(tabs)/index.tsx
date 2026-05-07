import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useCountdown, useNextRoute } from "@/hooks/useCountdown";
import { useVehicleSimulation, VehicleState } from "@/hooks/useVehicleSimulation";
import { Route, sampleAlerts, sampleRoutes } from "@/lib/sampleData";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.statIconBadge, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

function AlertBadge({ type }: { type: "info" | "warning" | "critical" }) {
  const colors = useColors();
  const config = {
    info: { color: colors.info, label: "Info" },
    warning: { color: colors.warning, label: "Warning" },
    critical: { color: colors.destructive, label: "Critical" },
  }[type];
  return (
    <View
      style={[
        styles.alertTypeBadge,
        { backgroundColor: config.color + "20", borderRadius: 6 },
      ]}
    >
      <Text style={[styles.alertTypeBadgeText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

function StatusBadge({ status }: { status: Route["status"] }) {
  const colors = useColors();
  const cfg = {
    "on-time": { color: colors.accent, label: "On Time" },
    delayed: { color: colors.warning, label: "Delayed" },
    cancelled: { color: colors.destructive, label: "Cancelled" },
  }[status];
  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: cfg.color + "20", borderRadius: 6 },
      ]}
    >
      <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

function NextDepartureCard({ route }: { route: Route }) {
  const colors = useColors();
  const { label, isImminent, isPast, hours, minutes, seconds } = useCountdown(
    route.departureTime
  );

  const ringColor = isPast
    ? colors.mutedForeground
    : isImminent
      ? colors.destructive
      : colors.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.nextCard,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: isImminent ? colors.destructive + "60" : colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
      onPress={() => router.push("/(tabs)/routes")}
    >
      {/* Countdown ring */}
      <View
        style={[
          styles.countdownRing,
          {
            borderColor: ringColor,
            backgroundColor: ringColor + "12",
          },
        ]}
      >
        {isImminent && !isPast ? (
          <>
            <Text style={[styles.countdownSeconds, { color: ringColor }]}>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </Text>
            <Text style={[styles.countdownUnit, { color: ringColor }]}>left</Text>
          </>
        ) : hours > 0 ? (
          <>
            <Text style={[styles.countdownHours, { color: ringColor }]}>
              {hours}h
            </Text>
            <Text style={[styles.countdownUnit, { color: ringColor }]}>
              {minutes}m
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.countdownHours, { color: ringColor }]}>
              {minutes}m
            </Text>
            <Text style={[styles.countdownUnit, { color: ringColor }]}>
              {String(seconds).padStart(2, "0")}s
            </Text>
          </>
        )}
      </View>

      <View style={styles.nextCardInfo}>
        <Text style={[styles.nextCardName, { color: colors.foreground }]}>
          {route.name}
        </Text>
        <Text style={[styles.nextCardRoute, { color: colors.mutedForeground }]}>
          {route.from} → {route.to}
        </Text>
        <View style={styles.nextCardMeta}>
          <Ionicons
            name="time-outline"
            size={13}
            color={colors.mutedForeground}
          />
          <Text style={[styles.nextCardTime, { color: colors.primary }]}>
            {route.departureTime} → {route.arrivalTime}
          </Text>
        </View>
      </View>

      <View style={styles.nextCardRight}>
        <StatusBadge status={route.status} />
        <View style={styles.nextCardArrow}>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.mutedForeground}
          />
        </View>
      </View>
    </Pressable>
  );
}

function UpcomingRow({ route }: { route: Route }) {
  const colors = useColors();
  const { label, isImminent, isPast } = useCountdown(route.departureTime);

  const countdownColor = isPast
    ? colors.mutedForeground
    : isImminent
      ? colors.destructive
      : colors.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.upcomingRow,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius - 2,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      onPress={() => router.push("/(tabs)/routes")}
    >
      <View
        style={[
          styles.upcomingDot,
          {
            backgroundColor: isImminent
              ? colors.destructive
              : isPast
                ? colors.mutedForeground
                : colors.primary,
          },
        ]}
      />
      <View style={styles.upcomingInfo}>
        <Text
          style={[styles.upcomingName, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {route.name.split("—")[1]?.trim() ?? route.name}
        </Text>
        <Text
          style={[styles.upcomingRoute, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {route.from} → {route.to}
        </Text>
      </View>
      <View style={styles.upcomingRight}>
        <Text
          style={[
            styles.upcomingCountdown,
            { color: countdownColor },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[styles.upcomingTime, { color: colors.mutedForeground }]}
        >
          {route.departureTime}
        </Text>
      </View>
    </Pressable>
  );
}

function LiveVehicleRow({ v }: { v: VehicleState }) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.vehicleRow,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius - 2,
          borderColor: v.color + "40",
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      onPress={() => router.push("/(tabs)/stops")}
    >
      <View style={[styles.vehicleDot, { backgroundColor: v.color }]}>
        <Ionicons name="bus" size={11} color="#FFF" />
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={[styles.vehicleName, { color: colors.foreground }]} numberOfLines={1}>
          {v.shortName}
        </Text>
        <View style={[styles.vehicleTrack, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.vehicleFill,
              {
                width: `${Math.round(v.progress * 100)}%` as `${number}%`,
                backgroundColor: v.color,
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.vehicleEtaBox}>
        <Text style={[styles.vehicleEta, { color: v.color }]}>{v.etaMinutes}m</Text>
        <Text style={[styles.vehicleEtaLabel, { color: colors.mutedForeground }]}>to terminal</Text>
      </View>
      {v.status === "delayed" && (
        <View style={[styles.delayedBadge, { backgroundColor: "#D97706" + "20" }]}>
          <Text style={[styles.delayedText, { color: "#D97706" }]}>Delayed</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const firstName = user?.displayName?.split(" ")[0] ?? "Passenger";
  const activeAlerts = sampleAlerts.filter((a) => a.isActive);
  const nextRoute = useNextRoute(sampleRoutes);
  const vehicles = useVehicleSimulation(sampleRoutes);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const sortedRoutes = [...sampleRoutes].sort((a, b) => {
    const toSecs = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      const now = new Date();
      const target = new Date(now);
      target.setHours(h, m, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      return target.getTime() - now.getTime();
    };
    return toSecs(a.departureTime) - toSecs(b.departureTime);
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Platform.OS === "web" ? 34 : 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#1A3A6B", "#2563EB"]}
        style={[styles.headerGradient, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{firstName}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.signOutBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={signOut}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color="rgba(255,255,255,0.85)"
            />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="bus-outline"
            label="Routes"
            value={String(sampleRoutes.length)}
            color="#60A5FA"
          />
          <StatCard
            icon="location-outline"
            label="Stops"
            value="9"
            color="#34D399"
          />
          <StatCard
            icon="warning-outline"
            label="Alerts"
            value={String(activeAlerts.length)}
            color="#FBBF24"
          />
        </View>
      </LinearGradient>

      {/* Next departure with live countdown */}
      {nextRoute && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Next Departure
          </Text>
          <NextDepartureCard route={nextRoute} />
        </View>
      )}

      {/* All upcoming routes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            All Departures
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/routes")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              See all
            </Text>
          </Pressable>
        </View>
        <View style={styles.upcomingList}>
          {sortedRoutes.map((route) => (
            <UpcomingRow key={route.id} route={route} />
          ))}
        </View>
      </View>

      {/* Live Vehicles */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Live Vehicles
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/stops")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>View map</Text>
          </Pressable>
        </View>
        <View style={styles.upcomingList}>
          {vehicles.map((v) => (
            <LiveVehicleRow key={v.routeId} v={v} />
          ))}
        </View>
      </View>

      {/* Alerts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Recent Alerts
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/alerts")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              See all
            </Text>
          </Pressable>
        </View>

        {activeAlerts.slice(0, 2).map((alert) => (
          <View
            key={alert.id}
            style={[
              styles.alertCard,
              {
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                borderColor: colors.border,
              },
            ]}
          >
            <AlertBadge type={alert.type} />
            <Text style={[styles.alertTitle, { color: colors.foreground }]}>
              {alert.title}
            </Text>
            <Text
              style={[styles.alertMessage, { color: colors.mutedForeground }]}
              numberOfLines={2}
            >
              {alert.message}
            </Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          {[
            {
              icon: "map-outline" as const,
              label: "Plan Route",
              route: "/(tabs)/routes" as const,
            },
            {
              icon: "location-outline" as const,
              label: "Find Stop",
              route: "/(tabs)/stops" as const,
            },
            {
              icon: "card-outline" as const,
              label: "Fare Calc",
              route: "/(tabs)/fare" as const,
            },
          ].map((action) => (
            <Pressable
              key={action.label}
              style={({ pressed }) => [
                styles.quickAction,
                {
                  backgroundColor: colors.card,
                  borderRadius: colors.radius,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() => router.push(action.route)}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor: colors.primary + "15",
                    borderRadius: colors.radius - 4,
                  },
                ]}
              >
                <Ionicons name={action.icon} size={22} color={colors.primary} />
              </View>
              <Text
                style={[
                  styles.quickActionLabel,
                  { color: colors.foreground },
                ]}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1 },
  headerGradient: { paddingHorizontal: 20, paddingBottom: 32 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  signOutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, padding: 12, alignItems: "center", borderWidth: 1 },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  lastSection: { paddingBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },

  // Next departure card
  nextCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderWidth: 1.5,
  },
  countdownRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  countdownSeconds: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  countdownHours: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    lineHeight: 18,
  },
  countdownUnit: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    lineHeight: 13,
  },
  nextCardInfo: { flex: 1 },
  nextCardName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  nextCardRoute: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 4 },
  nextCardMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  nextCardTime: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  nextCardRight: { alignItems: "flex-end", gap: 8 },
  nextCardArrow: { marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  // Upcoming list
  upcomingList: { gap: 8 },
  upcomingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
  },
  upcomingDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  upcomingInfo: { flex: 1 },
  upcomingName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  upcomingRoute: { fontSize: 11, fontFamily: "Inter_400Regular" },
  upcomingRight: { alignItems: "flex-end", gap: 2 },
  upcomingCountdown: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  upcomingTime: { fontSize: 11, fontFamily: "Inter_400Regular" },

  // Live vehicles
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1.5,
  },
  vehicleDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  vehicleInfo: { flex: 1, gap: 5 },
  vehicleName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  vehicleTrack: { height: 5, borderRadius: 3, overflow: "hidden" },
  vehicleFill: { height: "100%", borderRadius: 3 },
  vehicleEtaBox: { alignItems: "flex-end" },
  vehicleEta: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  vehicleEtaLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  delayedBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  delayedText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },

  // Alerts
  alertCard: { padding: 14, marginBottom: 10, borderWidth: 1 },
  alertTypeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  alertTypeBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  alertTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  alertMessage: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },

  // Quick actions
  quickActions: { flexDirection: "row", gap: 12 },
  quickAction: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
});
