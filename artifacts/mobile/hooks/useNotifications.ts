import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { Route } from "@/lib/sampleData";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function requestPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

function nextDepartureDate(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

async function scheduleRouteNotifications(routes: Route[]) {
  if (Platform.OS === "web") return;

  const granted = await requestPermission();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const route of routes) {
    const departure = nextDepartureDate(route.departureTime);
    const notify = new Date(departure.getTime() - 10 * 60 * 1000);
    if (notify.getTime() <= Date.now()) continue;

    const shortName = route.name.split("—")[1]?.trim() ?? route.name;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚌 Departing in 10 minutes",
        body: `${shortName} leaves ${route.from} at ${route.departureTime}`,
        data: { routeId: route.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notify,
      },
    });
  }
}

export function useNotifications(routes: Route[]) {
  const scheduledRef = useRef(false);

  useEffect(() => {
    if (Platform.OS === "web") return;
    if (scheduledRef.current) return;
    scheduledRef.current = true;
    scheduleRouteNotifications(routes);
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = Notifications.addNotificationReceivedListener(() => {});
    return () => sub.remove();
  }, []);
}
