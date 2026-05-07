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
import { sampleAlerts, sampleRoutes } from "@/lib/sampleData";

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
    <View style={[styles.statCard, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}>
      <View style={[styles.statIconBadge, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

interface AlertBadgeProps {
  type: "info" | "warning" | "critical";
}

function AlertBadge({ type }: AlertBadgeProps) {
  const colors = useColors();
  const config = {
    info: { color: colors.info, label: "Info" },
    warning: { color: colors.warning, label: "Warning" },
    critical: { color: colors.destructive, label: "Critical" },
  }[type];
  return (
    <View style={[styles.alertTypeBadge, { backgroundColor: config.color + "20", borderRadius: 6 }]}>
      <Text style={[styles.alertTypeBadgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const firstName = user?.displayName?.split(" ")[0] ?? "Student";
  const activeAlerts = sampleAlerts.filter((a) => a.isActive);
  const nextRoute = sampleRoutes[0];

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 34 : 24 }]}
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
            style={({ pressed }) => [styles.signOutBtn, { opacity: pressed ? 0.7 : 1 }]}
            onPress={signOut}
          >
            <Ionicons name="log-out-outline" size={22} color="rgba(255,255,255,0.85)" />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="bus-outline" label="Routes" value={String(sampleRoutes.length)} color="#60A5FA" />
          <StatCard icon="location-outline" label="Stops" value="6" color="#34D399" />
          <StatCard icon="warning-outline" label="Alerts" value={String(activeAlerts.length)} color="#FBBF24" />
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Next Departure</Text>
        <Pressable
          style={({ pressed }) => [
            styles.nextRouteCard,
            { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={() => router.push("/(tabs)/routes")}
        >
          <View style={[styles.routeBadge, { backgroundColor: colors.primary + "15", borderRadius: 8 }]}>
            <Ionicons name="navigate" size={22} color={colors.primary} />
          </View>
          <View style={styles.routeInfo}>
            <Text style={[styles.routeName, { color: colors.foreground }]}>{nextRoute.name}</Text>
            <Text style={[styles.routeDetail, { color: colors.mutedForeground }]}>
              {nextRoute.from} → {nextRoute.to}
            </Text>
            <Text style={[styles.routeTime, { color: colors.primary }]}>
              Departs {nextRoute.departureTime}
            </Text>
          </View>
          <View style={[styles.onTimeBadge, { backgroundColor: colors.accent + "20", borderRadius: 6 }]}>
            <Text style={[styles.onTimeText, { color: colors.accent }]}>On Time</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Alerts</Text>
          <Pressable onPress={() => router.push("/(tabs)/alerts")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>

        {activeAlerts.slice(0, 3).map((alert) => (
          <View
            key={alert.id}
            style={[styles.alertCard, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}
          >
            <AlertBadge type={alert.type} />
            <Text style={[styles.alertTitle, { color: colors.foreground }]}>{alert.title}</Text>
            <Text style={[styles.alertMessage, { color: colors.mutedForeground }]} numberOfLines={2}>
              {alert.message}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {[
            { icon: "map-outline" as const, label: "Plan Route", route: "/(tabs)/routes" as const },
            { icon: "location-outline" as const, label: "Find Stop", route: "/(tabs)/stops" as const },
            { icon: "card-outline" as const, label: "Fare Calc", route: "/(tabs)/fare" as const },
          ].map((action) => (
            <Pressable
              key={action.label}
              style={({ pressed }) => [
                styles.quickAction,
                { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={() => router.push(action.route)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + "15", borderRadius: colors.radius - 4 }]}>
                <Ionicons name={action.icon} size={22} color={colors.primary} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.foreground }]}>{action.label}</Text>
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
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
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
  statCard: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
  },
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
  section: { padding: 20, paddingBottom: 0 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  nextRouteCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderWidth: 1,
  },
  routeBadge: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  routeInfo: { flex: 1 },
  routeName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  routeDetail: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 2 },
  routeTime: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  onTimeBadge: { paddingHorizontal: 8, paddingVertical: 4 },
  onTimeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  alertCard: { padding: 14, marginBottom: 10, borderWidth: 1 },
  alertTypeBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  alertTypeBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  alertTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  alertMessage: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  quickActions: { flexDirection: "row", gap: 12 },
  quickAction: { flex: 1, padding: 14, alignItems: "center", gap: 8, borderWidth: 1 },
  quickActionIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  quickActionLabel: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },
});
