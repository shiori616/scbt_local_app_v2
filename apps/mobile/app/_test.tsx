import { View, Button } from "react-native";
import { addLog, loadLogs } from "../src/storage/logStorage";

export default function TestScreen() {
  const handlePress = async () => {
    await addLog({
      recordedDate: "2025-01-01",
      headacheLevel: 3,
      seizureLevel: 1,
      rightSideLevel: 2,
      leftSideLevel: 2,
      speechImpairmentLevel: 1,
      memoryImpairmentLevel: 1,
      physicalCondition: 120,
      mentalCondition: 100,
      memo: "test log",
    });

    const logs = await loadLogs();
    console.log("logs:", logs);
  };

  return (
    <View style={{ padding: 24 }}>
      <Button title="Add test log" onPress={handlePress} />
    </View>
  );
}
