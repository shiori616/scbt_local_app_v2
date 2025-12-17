import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ThemeScheme = "light" | "dark";

export default function TabLayout() {
  const rawScheme = useColorScheme();
  const scheme: ThemeScheme = rawScheme === "dark" ? "dark" : "light";
  const c: (typeof Colors)[ThemeScheme] = Colors[scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.tint,
        tabBarInactiveTintColor: c.icon,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          borderTopWidth: 1,
          height: 78,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="guide"
        options={{
          title: "ガイド",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="book-open-variant-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "記録",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="note-plus"
              size={30}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          title: "レポート",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="mypage"
        options={{
          title: "マイページ",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 既存 explore はタブに表示しない */}
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
