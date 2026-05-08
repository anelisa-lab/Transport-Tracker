import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useFavourites } from "@/context/FavouritesContext";
import { useColors } from "@/hooks/useColors";
import { sampleRoutes, sampleStops } from "@/lib/sampleData";

const NOTIF_KEY = "@smart_transport/notif_prefs";

const ZONE_COLORS: Record<string, string> = {
  A: "#2563EB",
  B: "#7C3AED",
  C: "#059669",
  D: "#D97706",
};

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, signOut, updateDisplayName } = useAuth();
  const { favRoutes, favStops, toggleFavRoute, toggleFavStop } =
    useFavourites();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName ?? "");
  const [notifDeparture, setNotifDeparture] = useState(true);
  const [notifAlerts, setNotifAlerts] = useState(true);
  const inputRef = useRef<TextInput>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY).then((v) => {
      if (v) {
        const prefs = JSON.parse(v);
        setNotifDeparture(prefs.departure ?? true);
        setNotifAlerts(prefs.alerts ?? true);
      }
    });
  }, []);

  const saveNotifPref = async (key: "departure" | "alerts", val: boolean) => {
    const current = {
      departure: notifDeparture,
      alerts: notifAlerts,
      [key]: val,
    };
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(current));
  };

  const handleSaveName = async () => {
    if (nameInput.trim()) {
      await updateDisplayName(nameInput.trim());
    }
    setEditingName(false);
  };

  const initials = (user?.displayName ?? user?.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const favRouteObjs = sampleRoutes.filter((r) => favRoutes.includes(r.id));
  const favStopObjs = sampleStops.filter((s) => favStops.includes(s.id));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 34 : 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.pageHeader,
          {
            paddingTop: topPad + 16,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>
          Profile
        </Text>
      </View>

      <View style={styles.group}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View
            style={[styles.avatar, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.nameSection}>
            {editingName ? (
              <View style={styles.nameEditRow}>
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.nameInput,
                    {
                      color: colors.foreground,
                      borderColor: colors.primary,
                      backgroundColor: colors.muted,
                    },
                  ]}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                />
                <Pressable
                  style={[
                    styles.saveBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSaveName}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.nameRow}>
                <Text
                  style={[
                    styles.displayName,
                    { color: colors.foreground },
                  ]}
                >
                  {user?.displayName ?? "Passenger"}
                </Text>
                <Pressable
                  onPress={() => {
                    setNameInput(user?.displayName ?? "");
                    setEditingName(true);
                  }}
                  style={styles.editIcon}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={15}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </View>
            )}
            <Text style={[styles.email, { color: colors.mutedForeground }]}>
              {user?.email ?? ""}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.group}>
        <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>
          Notifications
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: "hidden" },
          ]}
        >
          <View style={styles.toggleRow}>
            <View
              style={[
                styles.toggleIcon,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <Ionicons name="time-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.toggleInfo}>
              <Text
                style={[styles.toggleLabel, { color: colors.foreground }]}
              >
                10-min Departure Alerts
              </Text>
              <Text
                style={[
                  styles.toggleSub,
                  { color: colors.mutedForeground },
                ]}
              >
                Notified before your next bus departs
              </Text>
            </View>
            <Switch
              value={notifDeparture}
              onValueChange={(v) => {
                setNotifDeparture(v);
                saveNotifPref("departure", v);
              }}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.rowDiv, { backgroundColor: colors.border }]} />
          <View style={styles.toggleRow}>
            <View
              style={[
                styles.toggleIcon,
                { backgroundColor: "#FBBF2415" },
              ]}
            >
              <Ionicons
                name="warning-outline"
                size={18}
                color="#FBBF24"
              />
            </View>
            <View style={styles.toggleInfo}>
              <Text
                style={[styles.toggleLabel, { color: colors.foreground }]}
              >
                Service Alerts
              </Text>
              <Text
                style={[
                  styles.toggleSub,
                  { color: colors.mutedForeground },
                ]}
              >
                Delays, cancellations &amp; disruptions
              </Text>
            </View>
            <Switch
              value={notifAlerts}
              onValueChange={(v) => {
                setNotifAlerts(v);
                saveNotifPref("alerts", v);
              }}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      <View style={styles.group}>
        <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>
          Favourite Routes
        </Text>
        {favRouteObjs.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="heart-outline"
              size={30}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.emptyTitle, { color: colors.mutedForeground }]}
            >
              No favourite routes yet
            </Text>
            <Text
              style={[styles.emptyHint, { color: colors.mutedForeground }]}
            >
              Tap the heart icon on any route to save it here
            </Text>
          </View>
        ) : (
          favRouteObjs.map((r) => (
            <View
              key={r.id}
              style={[
                styles.favRow,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[styles.favDot, { backgroundColor: r.color }]}
              >
                <Ionicons name="bus" size={13} color="#FFF" />
              </View>
              <View style={styles.favInfo}>
                <Text
                  style={[styles.favName, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {r.name.split("—")[1]?.trim() ?? r.name}
                </Text>
                <Text
                  style={[
                    styles.favSub,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {r.from} → {r.to} · R{r.fare.toFixed(2)}
                </Text>
              </View>
              <Pressable
                onPress={() => toggleFavRoute(r.id)}
                hitSlop={8}
              >
                <Ionicons name="heart" size={20} color="#EF4444" />
              </Pressable>
            </View>
          ))
        )}
      </View>

      <View style={styles.group}>
        <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>
          Favourite Stops
        </Text>
        {favStopObjs.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="location-outline"
              size={30}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.emptyTitle, { color: colors.mutedForeground }]}
            >
              No favourite stops yet
            </Text>
            <Text
              style={[styles.emptyHint, { color: colors.mutedForeground }]}
            >
              Tap the heart icon on any stop to save it here
            </Text>
          </View>
        ) : (
          favStopObjs.map((s) => (
            <View
              key={s.id}
              style={[
                styles.favRow,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.favZoneDot,
                  { backgroundColor: ZONE_COLORS[s.zone] ?? "#64748B" },
                ]}
              >
                <Text style={styles.favZoneText}>{s.zone}</Text>
              </View>
              <View style={styles.favInfo}>
                <Text
                  style={[styles.favName, { color: colors.foreground }]}
                >
                  {s.name}
                </Text>
                <Text
                  style={[
                    styles.favSub,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Zone {s.zone} · {s.routes.length} route
                  {s.routes.length !== 1 ? "s" : ""}
                </Text>
              </View>
              <Pressable
                onPress={() => toggleFavStop(s.id)}
                hitSlop={8}
              >
                <Ionicons name="heart" size={20} color="#EF4444" />
              </Pressable>
            </View>
          ))
        )}
      </View>

      <View style={styles.group}>
        <Pressable
          style={({ pressed }) => [
            styles.signOutBtn,
            {
              backgroundColor: "#EF444415",
              borderColor: "#EF444430",
              opacity: pressed ? 0.75 : 1,
            },
          ]}
          onPress={() =>
            Alert.alert(
              "Sign Out",
              "Are you sure you want to sign out?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Sign Out",
                  style: "destructive",
                  onPress: signOut,
                },
              ]
            )
          }
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={[styles.signOutText, { color: "#EF4444" }]}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  group: { paddingHorizontal: 16, paddingTop: 20, gap: 8 },
  groupLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  nameSection: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  displayName: { fontSize: 18, fontFamily: "Inter_700Bold" },
  editIcon: { padding: 2 },
  nameEditRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  nameInput: {
    flex: 1,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  saveBtn: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  email: { fontSize: 13, fontFamily: "Inter_400Regular" },
  rowDiv: { height: 1, marginHorizontal: 16 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  toggleInfo: { flex: 1 },
  toggleLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  toggleSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  favRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  favDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  favZoneDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  favZoneText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  favInfo: { flex: 1 },
  favName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  favSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  emptyCard: {
    alignItems: "center",
    padding: 28,
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
  emptyHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  signOutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
