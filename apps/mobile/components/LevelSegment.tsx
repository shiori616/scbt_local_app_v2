import React from "react";
import { View, Pressable, Text } from "react-native";

type Level = 1 | 2 | 3 | 4 | 5;

type Props = {
  value: Level;
  onChange: (v: Level) => void;

  // 見た目（テーマから渡す）
  activeBg: string;
  activeText: string;
  border: string;
  inactiveText: string;
};

export function LevelSegment({
  value,
  onChange,
  activeBg,
  activeText,
  border,
  inactiveText,
}: Props) {
  const levels: Level[] = [1, 2, 3, 4, 5];

  return (
    <View style={{ flexDirection: "row", borderWidth: 1, borderColor: border, borderRadius: 12, overflow: "hidden" }}>
      {levels.map((lv, i) => {
        const active = lv === value;
        return (
          <Pressable
            key={lv}
            onPress={() => onChange(lv)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: active ? activeBg : "transparent",
              borderLeftWidth: i === 0 ? 0 : 1,
              borderLeftColor: border,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: active ? activeText : inactiveText }}>
              {lv}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// import の揺れ対策（任意）：default でも使えるようにしておく
export default LevelSegment;
