import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

function formatDateYYYYMMDD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function NewLogScreen() {
  const today = useMemo(() => formatDateYYYYMMDD(new Date()), []);
  const [recordedDate, setRecordedDate] = useState<string>(today);
  const [memo, setMemo] = useState<string>("");

  return (
    <View style={{ flex: 1, paddingTop: 80, paddingHorizontal: 24, gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>New Log</Text>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "600" }}>Recorded date</Text>
        <TextInput
          value={recordedDate}
          onChangeText={setRecordedDate}
          placeholder="YYYY-MM-DD"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />
        <Text style={{ fontSize: 12, opacity: 0.7 }}>
          MVP: type as YYYY-MM-DD (we can replace with a date picker later)
        </Text>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "600" }}>Memo</Text>
        <TextInput
          value={memo}
          onChangeText={setMemo}
          placeholder="Write something..."
          multiline
          style={{
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            minHeight: 120,
            textAlignVertical: "top",
          }}
        />
      </View>

      <Pressable
        onPress={() => {
          // 次ステップで addLog() に接続します
          console.log("draft:", { recordedDate, memo });
        }}
        style={{
          marginTop: 8,
          paddingVertical: 14,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Continue</Text>
      </Pressable>
    </View>
  );
}
