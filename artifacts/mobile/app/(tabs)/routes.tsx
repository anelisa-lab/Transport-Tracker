import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFavourites } from "@/context/FavouritesContext";
import { useColors } from "@/hooks/useColors";
import { Route, sampleRoutes, sampleStops } from "@/lib/sampleData";

function StatusBadge({ status }: { status: Route["status"] }) {
  const colors = useColors();
  const config = {
    "on-time": { color: colors.accent, label: "On Time" },
    delayed: { color: colors.warning, label: "Delayed" },
    cancelled: { color: colors.destructive, label: "Cancelled" },
  }[status];
  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: config.color + "20", borderRadius: 6 },
      ]}
    >
      <View style={[styles.statusDot, { backgroundColor: config.color }]} />
      <Text style={[styles.statusText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

function RouteCard({
  route,
  isFav,
  onToggleFav,
}: {
  route: Route;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.routeCard,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.cardTop,
          { opacity: pressed ? 0.92 : 1 },
        ]}
        onPress={() => router.push(`/route/${route.id}`)}
      >
        <View
          style={[
            styles.routeNumberBadge,
            { backgroundColor: route.color, borderRadius: 8 },
          ]}
        >
          <Ionicons name="bus" size={16} color="#FFFFFF" />
        </View>
        <View style={styles.routeMain}>
          <Text style={[styles.routeName, { color: colors.foreground }]}>
            {route.name}
          </Text>
          <Text style={[styles.routePath, { color: colors.mutedForeground }]}>
            {route.from} → {route.to}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <StatusBadge status={route.status} />
          <Pressable
            onPress={onToggleFav}
            hitSlop={8}
            style={styles.heartBtn}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={20}
              color={isFav ? "#EF4444" : colors.mutedForeground}
            />
          </Pressable>
        </View>
      </Pressable>

      <View style={[styles.timingRow, { borderTopColor: colors.border }]}>
        <View style={styles.timingItem}>
          <Ionicons
            name="time-outline"
            size={14}
            color={colors.mutedForeground}
          />
          <Text
            style={[styles.timingLabel, { color: colors.mutedForeground }]}
          >
            Departs
          </Text>
          <Text style={[styles.timingValue, { color: colors.foreground }]}>
            {route.departureTime}
          </Text>
        </View>
        <View
          style={[styles.timingDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.timingItem}>
          <Ionicons
            name="flag-outline"
            size={14}
            color={colors.mutedForeground}
          />
          <Text
            style={[styles.timingLabel, { color: colors.mutedForeground }]}
          >
            Arrives
          </Text>
          <Text style={[styles.timingValue, { color: colors.foreground }]}>
            {route.arrivalTime}
          </Text>
        </View>
        <View
          style={[styles.timingDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.timingItem}>
          <Ionicons
            name="card-outline"
            size={14}
            color={colors.mutedForeground}
          />
          <Text
            style={[styles.timingLabel, { color: colors.mutedForeground }]}
          >
            Fare
          </Text>
          <Text style={[styles.timingValue, { color: colors.primary }]}>
            R{route.fare.toFixed(2)}
          </Text>
        </View>
      </View>

      <Pressable
        style={[styles.expandRow, { borderTopColor: colors.border }]}
        onPress={() => setExpanded((v) => !v)}
      >
        <Text style={[styles.expandLabel, { color: colors.mutedForeground }]}>
          {expanded ? "Hide stops" : `${route.stops.length} stops`}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={14}
          color={colors.mutedForeground}
        />
      </Pressable>

      {expanded && (
        <View style={[styles.stopsSection, { borderTopColor: colors.border }]}>
          {route.stops.map((stop, i) => (
            <View key={stop} style={styles.stopRow}>
              <View
                style={[
                  styles.stopDot,
                  {
                    backgroundColor:
                      i === 0 || i === route.stops.length - 1
                        ? route.color
                        : colors.border,
                  },
                ]}
              />
              {i < route.stops.length - 1 && (
                <View
                  style={[
                    styles.stopLine,
                    { backgroundColor: colors.border },
                  ]}
                />
              )}
              <Text style={[styles.stopName, { color: colors.foreground }]}>
                {stop}
              </Text>
            </View>
          ))}
          <Pressable
            style={[
              styles.detailBtn,
              { backgroundColor: route.color + "15", borderColor: route.color + "40" },
            ]}
            onPress={() => router.push(`/route/${route.id}`)}
          >
            <Text style={[styles.detailBtnText, { color: route.color }]}>
              View full details
            </Text>
            <Ionicons name="arrow-forward" size={14} color={route.color} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

function StopPickerModal({
  visible,
  title,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  selected: string | null;
  onSelect: (name: string) => void;
  onClose: () => void;
}) {
  const colors = useColors();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose} />
      <View
        style={[
          styles.modalSheet,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}
      >
        <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
        <Text style={[styles.modalTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        <FlatList
          data={sampleStops}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.modalItem,
                {
                  backgroundColor:
                    selected === item.name
                      ? colors.primary + "15"
                      : "transparent",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() => {
                onSelect(item.name);
                onClose();
              }}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={
                  selected === item.name
                    ? colors.primary
                    : colors.mutedForeground
                }
              />
              <View style={styles.modalItemInfo}>
                <Text
                  style={[
                    styles.modalItemName,
                    {
                      color:
                        selected === item.name
                          ? colors.primary
                          : colors.foreground,
                    },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.modalItemSub,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Zone {item.zone} ·{" "}
                  {item.routes.length} route
                  {item.routes.length !== 1 ? "s" : ""}
                </Text>
              </View>
              {selected === item.name && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.primary}
                />
              )}
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

export default function RoutesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { favRoutes, toggleFavRoute } = useFavourites();
  const [mode, setMode] = useState<"browse" | "planner">("browse");
  const [search, setSearch] = useState("");
  const [fromStop, setFromStop] = useState<string | null>(null);
  const [toStop, setToStop] = useState<string | null>(null);
  const [fromModal, setFromModal] = useState(false);
  const [toModal, setToModal] = useState(false);

  const filtered =
    mode === "browse"
      ? sampleRoutes.filter(
          (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.from.toLowerCase().includes(search.toLowerCase()) ||
            r.to.toLowerCase().includes(search.toLowerCase())
        )
      : sampleRoutes.filter((r) => {
          if (!fromStop && !toStop) return true;
          const hasFrom = fromStop
            ? r.stops.some(
                (s) => s.toLowerCase() === fromStop.toLowerCase()
              )
            : true;
          const hasTo = toStop
            ? r.stops.some((s) => s.toLowerCase() === toStop.toLowerCase())
            : true;
          return hasFrom && hasTo;
        });

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Routes
          </Text>
          <View
            style={[
              styles.modeToggle,
              {
                backgroundColor: colors.muted,
                borderRadius: colors.radius - 4,
                borderColor: colors.border,
              },
            ]}
          >
            {(["browse", "planner"] as const).map((m) => (
              <Pressable
                key={m}
                style={[
                  styles.modeBtn,
                  {
                    backgroundColor:
                      mode === m ? colors.primary : "transparent",
                    borderRadius: colors.radius - 6,
                  },
                ]}
                onPress={() => setMode(m)}
              >
                <Ionicons
                  name={m === "browse" ? "list-outline" : "git-branch-outline"}
                  size={14}
                  color={mode === m ? "#FFFFFF" : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.modeBtnText,
                    {
                      color: mode === m ? "#FFFFFF" : colors.mutedForeground,
                    },
                  ]}
                >
                  {m === "browse" ? "Browse" : "Plan Trip"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {mode === "browse" ? (
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.muted,
                borderRadius: colors.radius - 4,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={colors.mutedForeground}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Search routes or stops..."
              placeholderTextColor={colors.mutedForeground}
              value={search}
              onChangeText={setSearch}
            />
            {!!search && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.plannerInputs}>
            <Pressable
              style={[
                styles.stopPicker,
                {
                  backgroundColor: colors.muted,
                  borderColor: fromStop
                    ? colors.primary
                    : colors.border,
                  borderRadius: colors.radius - 4,
                },
              ]}
              onPress={() => setFromModal(true)}
            >
              <Ionicons
                name="radio-button-on-outline"
                size={16}
                color={fromStop ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.stopPickerText,
                  {
                    color: fromStop
                      ? colors.foreground
                      : colors.mutedForeground,
                  },
                ]}
                numberOfLines={1}
              >
                {fromStop ?? "From stop…"}
              </Text>
              {fromStop && (
                <Pressable onPress={() => setFromStop(null)} hitSlop={8}>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              )}
            </Pressable>

            <View style={styles.plannerDividerRow}>
              <View
                style={[
                  styles.plannerDividerLine,
                  { backgroundColor: colors.border },
                ]}
              />
              <View
                style={[
                  styles.plannerSwapBtn,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons
                  name="swap-vertical"
                  size={16}
                  color={colors.mutedForeground}
                />
              </View>
              <View
                style={[
                  styles.plannerDividerLine,
                  { backgroundColor: colors.border },
                ]}
              />
            </View>

            <Pressable
              style={[
                styles.stopPicker,
                {
                  backgroundColor: colors.muted,
                  borderColor: toStop
                    ? colors.primary
                    : colors.border,
                  borderRadius: colors.radius - 4,
                },
              ]}
              onPress={() => setToModal(true)}
            >
              <Ionicons
                name="location-outline"
                size={16}
                color={toStop ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.stopPickerText,
                  {
                    color: toStop
                      ? colors.foreground
                      : colors.mutedForeground,
                  },
                ]}
                numberOfLines={1}
              >
                {toStop ?? "To stop…"}
              </Text>
              {toStop && (
                <Pressable onPress={() => setToStop(null)} hitSlop={8}>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              )}
            </Pressable>
          </View>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RouteCard
            route={item}
            isFav={favRoutes.includes(item.id)}
            onToggleFav={() => toggleFavRoute(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : 24 },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name={mode === "planner" ? "git-branch-outline" : "map-outline"}
              size={48}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              {mode === "planner" && (fromStop || toStop)
                ? "No routes connect those stops"
                : "No routes found"}
            </Text>
          </View>
        }
      />

      <StopPickerModal
        visible={fromModal}
        title="Select departure stop"
        selected={fromStop}
        onSelect={setFromStop}
        onClose={() => setFromModal(false)}
      />
      <StopPickerModal
        visible={toModal}
        title="Select destination stop"
        selected={toStop}
        onSelect={setToStop}
        onClose={() => setToModal(false)}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  modeToggle: { flexDirection: "row", padding: 3, borderWidth: 1 },
  modeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modeBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  plannerInputs: { gap: 0 },
  stopPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1.5,
  },
  stopPickerText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  plannerDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
    height: 24,
  },
  plannerDividerLine: { flex: 1, height: 1 },
  plannerSwapBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { padding: 16, gap: 12 },
  routeCard: { borderWidth: 1, overflow: "hidden" },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  routeNumberBadge: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  routeMain: { flex: 1 },
  routeName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  routePath: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  heartBtn: { padding: 2 },
  timingRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  timingItem: { flex: 1, alignItems: "center", gap: 2 },
  timingLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  timingValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  timingDivider: { width: 1, marginVertical: 4 },
  expandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  expandLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  stopsSection: {
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  stopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
    position: "relative",
  },
  stopDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  stopLine: {
    position: "absolute",
    left: 4,
    top: 14,
    width: 2,
    height: 20,
  },
  stopName: { fontSize: 13, fontFamily: "Inter_500Medium" },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  detailBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 20,
    paddingVertical: 14,
    letterSpacing: -0.3,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalItemInfo: { flex: 1 },
  modalItemName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  modalItemSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
});
