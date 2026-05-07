import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Alert, sampleAlerts } from "@/lib/sampleData";

type FilterType = "all" | "info" | "warning" | "critical";

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function AlertCard({ alert }: { alert: Alert }) {
  const colors = useColors();

  const config = {
    info: {
      color: colors.info,
      bg: colors.info + "12",
      icon: "information-circle" as const,
      label: "Info",
    },
    warning: {
      color: colors.warning,
      bg: colors.warning + "12",
      icon: "warning" as const,
      label: "Warning",
    },
    critical: {
      color: colors.destructive,
      bg: colors.destructive + "12",
      icon: "alert-circle" as const,
      label: "Critical",
    },
  }[alert.type];

  return (
    <View style={[styles.alertCard, { backgroundColor: colors.card, borderRadius: colors.radius, borderLeftColor: config.color, borderColor: colors.border }]}>
      <View style={styles.alertHeader}>
        <View style={[styles.alertIconBadge, { backgroundColor: config.bg, borderRadius: 8 }]}>
          <Ionicons name={config.icon} size={18} color={config.color} />
        </View>
        <View style={styles.alertHeaderText}>
          <Text style={[styles.alertTitle, { color: colors.foreground }]}>{alert.title}</Text>
          <View style={styles.alertMeta}>
            <View style={[styles.typePill, { backgroundColor: config.bg, borderRadius: 4 }]}>
              <Text style={[styles.typeText, { color: config.color }]}>{config.label}</Text>
            </View>
            <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
              {timeAgo(alert.createdAt)}
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.alertMessage, { color: colors.mutedForeground }]}>
        {alert.message}
      </Text>
    </View>
  );
}

export default function AlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = sampleAlerts.filter(
    (a) => a.isActive && (filter === "all" || a.type === filter)
  );

  const counts = {
    all: sampleAlerts.filter((a) => a.isActive).length,
    info: sampleAlerts.filter((a) => a.isActive && a.type === "info").length,
    warning: sampleAlerts.filter((a) => a.isActive && a.type === "warning").length,
    critical: sampleAlerts.filter((a) => a.isActive && a.type === "critical").length,
  };

  const filterTabs: { key: FilterType; label: string; color: string }[] = [
    { key: "all", label: "All", color: colors.primary },
    { key: "critical", label: "Critical", color: colors.destructive },
    { key: "warning", label: "Warning", color: colors.warning },
    { key: "info", label: "Info", color: colors.info },
  ];

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>Alerts</Text>
          {counts.critical > 0 && (
            <View style={[styles.criticalBadge, { backgroundColor: colors.destructive }]}>
              <Text style={styles.criticalBadgeText}>{counts.critical}</Text>
            </View>
          )}
        </View>

        <View style={styles.filterRow}>
          {filterTabs.map((tab) => (
            <Pressable
              key={tab.key}
              style={({ pressed }) => [
                styles.filterTab,
                {
                  borderRadius: colors.radius - 6,
                  backgroundColor: filter === tab.key ? tab.color : colors.muted,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() => setFilter(tab.key)}
            >
              <Text style={[styles.filterTabText, { color: filter === tab.key ? "#FFFFFF" : colors.mutedForeground }]}>
                {tab.label}
              </Text>
              {counts[tab.key] > 0 && (
                <View style={[styles.filterCount, { backgroundColor: filter === tab.key ? "rgba(255,255,255,0.3)" : tab.color + "30", borderRadius: 10 }]}>
                  <Text style={[styles.filterCountText, { color: filter === tab.key ? "#FFFFFF" : tab.color }]}>
                    {counts[tab.key]}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlertCard alert={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : 24 },
        ]}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle-outline" size={48} color={colors.accent} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>All clear</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No active alerts in this category</Text>
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
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  criticalBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  criticalBadgeText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  filterRow: { flexDirection: "row", gap: 8 },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterTabText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  filterCount: { minWidth: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  filterCountText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  list: { padding: 16, gap: 12 },
  alertCard: {
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
    gap: 10,
  },
  alertHeader: { flexDirection: "row", gap: 12 },
  alertIconBadge: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  alertHeaderText: { flex: 1 },
  alertTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  alertMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  typePill: { paddingHorizontal: 6, paddingVertical: 2 },
  typeText: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.4 },
  timeText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  alertMessage: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
