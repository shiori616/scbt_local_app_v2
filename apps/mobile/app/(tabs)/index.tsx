import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 24,
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "600" }}>
        Home
      </Text>

      <Link href="/logs/new" asChild>
        <Pressable
          style={{
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>
            Create new log
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
