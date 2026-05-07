import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { FareRule, sampleFareRules, zoneLabels, zones } from "@/lib/sampleData";

function getFare(from: string, to: string, rules: FareRule[]): FareRule | null {
  const key1 = rules.find((r) => r.fromZone === from && r.toZone === to);
  const key2 = rules.find((r) => r.fromZone === to && r.toZone === from);
  return key1 ?? key2 ?? null;
}

function ZonePicker({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: string | null;
  onSelect: (z: string) => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.pickerGroup}>
      <Text style={[styles.pickerLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={styles.zoneGrid}>
        {zones.map((zone) => (
          <Pressable
            key={zone}
            style={({ pressed }) => [
              styles.zoneBtn,
              {
                borderRadius: colors.radius - 4,
                backgroundColor: selected === zone ? colors.primary : colors.card,
                borderColor: selected === zone ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(zone);
            }}
          >
            <Text style={[styles.zoneBtnLetter, { color: selected === zone ? "#FFFFFF" : colors.foreground }]}>
              {zone}
            </Text>
            <Text style={[styles.zoneBtnLabel, { color: selected === zone ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]} numberOfLines={1}>
              {zone === "A" ? "City" : zone === "B" ? "Suburbs" : zone === "C" ? "Outer" : "Rural"}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function FareScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [fromZone, setFromZone] = useState<string | null>(null);
  const [toZone, setToZone] = useState<string | null>(null);
  const [isStudent, setIsStudent] = useState(true);
  const [result, setResult] = useState<FareRule | null | "not-found">(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const calculate = () => {
    if (!fromZone || !toZone) return;
    const fare = getFare(fromZone, toZone, sampleFareRules);
    setResult(fare ?? "not-found");
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const canCalculate = fromZone && toZone;

  const displayFare =
    result && result !== "not-found"
      ? isStudent
        ? result.studentPrice
        : result.price
      : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Fare Calculator</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Select your origin and destination zones
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 34 : 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}>
          <ZonePicker label="From Zone" selected={fromZone} onSelect={setFromZone} />

          <View style={[styles.swapRow]}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Pressable
              style={({ pressed }) => [
                styles.swapBtn,
                { backgroundColor: colors.muted, borderRadius: 20, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => {
                const tmp = fromZone;
                setFromZone(toZone);
                setToZone(tmp);
                setResult(null);
                Haptics.selectionAsync();
              }}
            >
              <Ionicons name="swap-vertical" size={18} color={colors.primary} />
            </Pressable>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <ZonePicker label="To Zone" selected={toZone} onSelect={setToZone} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}>
          <Text style={[styles.fareTypeLabel, { color: colors.foreground }]}>Passenger Type</Text>
          <View style={styles.typeToggle}>
            {[
              { label: "Student", value: true, icon: "school-outline" as const },
              { label: "Adult", value: false, icon: "person-outline" as const },
            ].map((opt) => (
              <Pressable
                key={opt.label}
                style={({ pressed }) => [
                  styles.typeOption,
                  {
                    borderRadius: colors.radius - 4,
                    backgroundColor: isStudent === opt.value ? colors.primary : colors.muted,
                    borderColor: isStudent === opt.value ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={() => { setIsStudent(opt.value); setResult(null); }}
              >
                <Ionicons name={opt.icon} size={18} color={isStudent === opt.value ? "#FFFFFF" : colors.mutedForeground} />
                <Text style={[styles.typeOptionText, { color: isStudent === opt.value ? "#FFFFFF" : colors.mutedForeground }]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.calculateBtn,
            {
              backgroundColor: canCalculate ? colors.primary : colors.muted,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          onPress={calculate}
          disabled={!canCalculate}
        >
          <Ionicons name="calculator-outline" size={20} color={canCalculate ? "#FFFFFF" : colors.mutedForeground} />
          <Text style={[styles.calculateBtnText, { color: canCalculate ? "#FFFFFF" : colors.mutedForeground }]}>
            Calculate Fare
          </Text>
        </Pressable>

        {result !== null && (
          <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
            {result === "not-found" ? (
              <View style={[styles.resultCard, { backgroundColor: colors.destructive + "10", borderRadius: colors.radius, borderColor: colors.destructive + "40" }]}>
                <Ionicons name="alert-circle-outline" size={32} color={colors.destructive} />
                <Text style={[styles.resultNotFound, { color: colors.destructive }]}>No fare found for this route</Text>
              </View>
            ) : (
              <View style={[styles.resultCard, { backgroundColor: colors.primary + "08", borderRadius: colors.radius, borderColor: colors.primary + "30" }]}>
                <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
                  {isStudent ? "Student" : "Adult"} Fare
                </Text>
                <Text style={[styles.resultFare, { color: colors.primary }]}>
                  ${displayFare?.toFixed(2)}
                </Text>
                <Text style={[styles.resultRoute, { color: colors.mutedForeground }]}>
                  {zoneLabels[fromZone!]} → {zoneLabels[toZone!]}
                </Text>
                {isStudent && (
                  <View style={[styles.savingsBadge, { backgroundColor: colors.accent + "20", borderRadius: 8 }]}>
                    <Ionicons name="school-outline" size={14} color={colors.accent} />
                    <Text style={[styles.savingsText, { color: colors.accent }]}>
                      You save ${(result.price - result.studentPrice).toFixed(2)} with student concession
                    </Text>
                  </View>
                )}
              </View>
            )}
          </Animated.View>
        )}

        <View style={[styles.fareTable, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}>
          <Text style={[styles.fareTableTitle, { color: colors.foreground }]}>Fare Guide</Text>
          <View style={[styles.fareTableHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.fareTableHeaderText, { color: colors.mutedForeground, flex: 2 }]}>Route</Text>
            <Text style={[styles.fareTableHeaderText, { color: colors.mutedForeground }]}>Adult</Text>
            <Text style={[styles.fareTableHeaderText, { color: colors.mutedForeground }]}>Student</Text>
          </View>
          {sampleFareRules.map((rule) => (
            <View key={rule.id} style={[styles.fareTableRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.fareTableCell, { color: colors.foreground, flex: 2 }]}>
                Zone {rule.fromZone} → Zone {rule.toZone}
              </Text>
              <Text style={[styles.fareTableCell, { color: colors.foreground }]}>${rule.price.toFixed(2)}</Text>
              <Text style={[styles.fareTableCell, { color: colors.accent }]}>${rule.studentPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  title: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
  content: { padding: 16, gap: 14 },
  card: { padding: 16, borderWidth: 1 },
  pickerGroup: { marginBottom: 4 },
  pickerLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  zoneGrid: { flexDirection: "row", gap: 8 },
  zoneBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1.5,
    gap: 2,
  },
  zoneBtnLetter: { fontSize: 20, fontFamily: "Inter_700Bold" },
  zoneBtnLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  swapRow: { flexDirection: "row", alignItems: "center", marginVertical: 12, gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  swapBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  fareTypeLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 12 },
  typeToggle: { flexDirection: "row", gap: 10 },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1.5,
  },
  typeOptionText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  calculateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
  },
  calculateBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  resultCard: {
    padding: 20,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  resultLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  resultFare: { fontSize: 48, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  resultRoute: { fontSize: 12, fontFamily: "Inter_400Regular" },
  resultNotFound: { fontSize: 16, fontFamily: "Inter_500Medium" },
  savingsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  savingsText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  fareTable: { padding: 16, borderWidth: 1 },
  fareTableTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 12 },
  fareTableHeader: { flexDirection: "row", paddingBottom: 8, marginBottom: 4, borderBottomWidth: 1 },
  fareTableHeaderText: { flex: 1, fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.3 },
  fareTableRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1 },
  fareTableCell: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
});
