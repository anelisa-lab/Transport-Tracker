import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { Stop } from "@/lib/sampleData";

export default function StopsMap(_props: { stops: Stop[] }) {
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.muted }]}>
      <Ionicons name="map-outline" size={48} color={colors.mutedForeground} />
      <Text style={[styles.title, { color: colors.foreground }]}>Map view</Text>
      <Text style={[styles.sub, { color: colors.mutedForeground }]}>
        Available on iOS and Android via Expo Go
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    margin: 16,
    borderRadius: 12,
  },
  title: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  sub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
