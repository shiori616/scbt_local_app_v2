import { View, Text } from "react-native";

export default function GuideScreen() {
  return (
    <View style={{ flex: 1, paddingTop: 80, paddingHorizontal: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>ガイド</Text>
    </View>
  );
}
