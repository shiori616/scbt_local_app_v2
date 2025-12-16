import { View, Button } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={{ padding: 24 }}>
      <Link href="/_test" asChild>
        <Button title="Go to test screen" />
      </Link>
    </View>
  );
}
