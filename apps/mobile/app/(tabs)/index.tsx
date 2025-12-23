import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import Slider from "@react-native-community/slider";

import { Colors, Fonts } from "../../constants/theme";
import { LevelSegment } from "../../components/LevelSegment";
import { getLogByDate, upsertLogByDate } from "../../src/storage/logStorage";
import type { LogRecord } from "../../src/types/log";
import { BrandColors } from "../../constants/colors";


type ThemeScheme = "light" | "dark";

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function jpDateLabel(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const w = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${y}/${String(m).padStart(2, "0")}/${String(day).padStart(2, "0")}（${w}）`;
}

const DEFAULT_LEVEL = 5 as const;
const DEFAULT_0_200 = 100 as const;

export default function RecordEntryScreen() {
  const rawScheme = useColorScheme();
  const scheme: ThemeScheme = rawScheme === "dark" ? "dark" : "light";
  const c: (typeof Colors)[ThemeScheme] = Colors[scheme];

  // 端末幅で血圧入力のレイアウトを切替（狭い場合は縦並び）
  const { width } = useWindowDimensions();
  const bpStack = width < 380;

  //バー項目の表示設定
  const VALUE_LABEL_COLOR = BrandColors.primary; // 濃い青 #335187
  const VALUE_LABEL_SIZE = 15;
  const AXIS_LABEL_SIZE = 10;

  // 数値をつまみに近づける（下げる）: 0〜8px程度で調整
  const VALUE_LABEL_DROP = 6;

  const LABEL_TWEAK_X = 10; // 右ズレ補正：まず 10px。必要なら 8〜14で調整
  const SLIDER_GUTTER = 12; // 左右余白（つまみ半径相当。必要なら 12〜18で調整）
  const MAX_0_200 = 200;

    // 体調
    const [pcWrapW, setPcWrapW] = useState(0);
    const [pcLabelW, setPcLabelW] = useState(0);

    // 気持ち
    const [mcWrapW, setMcWrapW] = useState(0);
    const [mcLabelW, setMcLabelW] = useState(0);



  // ベースフォント（全体に統一）
  const fontFamily = Fonts.rounded;

  const [date, setDate] = useState<Date>(new Date());
  const recordedDate = useMemo(() => toYmd(date), [date]);

  // 1–5
  const [headacheLevel, setHeadacheLevel] = useState<1 | 2 | 3 | 4 | 5>(DEFAULT_LEVEL);
  const [seizureLevel, setSeizureLevel] = useState<1 | 2 | 3 | 4 | 5>(DEFAULT_LEVEL);
  const [rightSideLevel, setRightSideLevel] = useState<1 | 2 | 3 | 4 | 5>(DEFAULT_LEVEL);
  const [leftSideLevel, setLeftSideLevel] = useState<1 | 2 | 3 | 4 | 5>(DEFAULT_LEVEL);
  const [speechImpairmentLevel, setSpeechImpairmentLevel] = useState<1 | 2 | 3 | 4 | 5>(
    DEFAULT_LEVEL
  );
  const [memoryImpairmentLevel, setMemoryImpairmentLevel] = useState<1 | 2 | 3 | 4 | 5>(
    DEFAULT_LEVEL
  );

  // 0–200
  const [physicalCondition, setPhysicalCondition] = useState<number>(DEFAULT_0_200);
  const [mentalCondition, setMentalCondition] = useState<number>(DEFAULT_0_200);

  // optional
  const [bpSys, setBpSys] = useState<string>("");
  const [bpDia, setBpDia] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  const isHydratingRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 日付が変わったら、その日のデータを読む（なければ初期値）
  useEffect(() => {
    let alive = true;

    (async () => {
      isHydratingRef.current = true;
      try {
        const existing = await getLogByDate(recordedDate);
        if (!alive) return;

        if (existing) {
          const v: LogRecord = existing;

          setHeadacheLevel(v.headacheLevel);
          setSeizureLevel(v.seizureLevel);
          setRightSideLevel(v.rightSideLevel);
          setLeftSideLevel(v.leftSideLevel);
          setSpeechImpairmentLevel(v.speechImpairmentLevel);
          setMemoryImpairmentLevel(v.memoryImpairmentLevel);

          setPhysicalCondition(v.physicalCondition);
          setMentalCondition(v.mentalCondition);

          setBpSys(v.bloodPressureSystolic == null ? "" : String(v.bloodPressureSystolic));
          setBpDia(v.bloodPressureDiastolic == null ? "" : String(v.bloodPressureDiastolic));

          setMemo(v.memo ?? "");
        } else {
          // 要件どおりのデフォルト（5 / 100）
          setHeadacheLevel(DEFAULT_LEVEL);
          setSeizureLevel(DEFAULT_LEVEL);
          setRightSideLevel(DEFAULT_LEVEL);
          setLeftSideLevel(DEFAULT_LEVEL);
          setSpeechImpairmentLevel(DEFAULT_LEVEL);
          setMemoryImpairmentLevel(DEFAULT_LEVEL);

          setPhysicalCondition(DEFAULT_0_200);
          setMentalCondition(DEFAULT_0_200);

          setBpSys("");
          setBpDia("");
          setMemo("");
        }
      } finally {
        setTimeout(() => {
          isHydratingRef.current = false;
        }, 0);
      }
    })();

    return () => {
      alive = false;
    };
  }, [recordedDate]);

  const scheduleAutoSave = useCallback(() => {
    if (isHydratingRef.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      const sys = bpSys.trim() === "" ? null : Number(bpSys);
      const dia = bpDia.trim() === "" ? null : Number(bpDia);

      await upsertLogByDate(recordedDate, {
        headacheLevel,
        seizureLevel,
        rightSideLevel,
        leftSideLevel,
        speechImpairmentLevel,
        memoryImpairmentLevel,
        physicalCondition,
        mentalCondition,
        bloodPressureSystolic: Number.isFinite(sys as number) ? (sys as number) : null,
        bloodPressureDiastolic: Number.isFinite(dia as number) ? (dia as number) : null,
        memo: memo.trim() === "" ? null : memo,
      });
    }, 400);
  }, [
    recordedDate,
    headacheLevel,
    seizureLevel,
    rightSideLevel,
    leftSideLevel,
    speechImpairmentLevel,
    memoryImpairmentLevel,
    physicalCondition,
    mentalCondition,
    bpSys,
    bpDia,
    memo,
  ]);

  useEffect(() => {
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  const Card = ({ children }: { children: React.ReactNode }) => (
    <View
      style={{
        backgroundColor: c.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: c.border,
        marginBottom: 14,
      }}
    >
      {children}
    </View>
  );

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <View style={{ width: 70 }}>
        <Text style={{ color: c.text, fontWeight: "700", fontFamily }}>{label}</Text>
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 56,
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      >
        {/* 日付 */}
        <View
          style={{
            backgroundColor: c.surface,
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: c.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <Pressable
            onPress={() => setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1))}
            style={{ padding: 8 }}
          >
            <Text style={{ fontSize: 22, color: c.text, fontFamily }}>‹</Text>
          </Pressable>

          <Text style={{ color: c.text, fontSize: 18, fontWeight: "800", fontFamily }}>
            {jpDateLabel(date)}
          </Text>

          <Pressable
            onPress={() => setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1))}
            style={{ padding: 8 }}
          >
            <Text style={{ fontSize: 22, color: c.text, fontFamily }}>›</Text>
          </Pressable>
        </View>

        <Card>
          <Row label="頭痛">
            <LevelSegment
              value={headacheLevel}
              onChange={setHeadacheLevel}
              activeBg={c.tint}
              activeText={c.surface}
              border={c.border}
              inactiveText={c.icon}
            />
          </Row>

          <Row label="てんかん">
            <LevelSegment
              value={seizureLevel}
              onChange={setSeizureLevel}
              activeBg={c.tint}
              activeText={c.surface}
              border={c.border}
              inactiveText={c.icon}
            />
          </Row>

          <Row label="右半身">
            <LevelSegment
              value={rightSideLevel}
              onChange={setRightSideLevel}
              activeBg={c.tint}
              activeText={c.surface}
              border={c.border}
              inactiveText={c.icon}
            />
          </Row>

          <Row label="左半身">
            <LevelSegment
              value={leftSideLevel}
              onChange={setLeftSideLevel}
              activeBg={c.tint}
              activeText={c.surface}
              border={c.border}
              inactiveText={c.icon}
            />
          </Row>

          <Row label="言語力">
            <LevelSegment
              value={speechImpairmentLevel}
              onChange={setSpeechImpairmentLevel}
              activeBg={c.tint}
              activeText={c.surface}
              border={c.border}
              inactiveText={c.icon}
            />
          </Row>

          <Row label="記憶力">
            <LevelSegment
              value={memoryImpairmentLevel}
              onChange={setMemoryImpairmentLevel}
              activeBg={c.tint}
              activeText={c.surface}
              border={c.border}
              inactiveText={c.icon}
            />
          </Row>

          {/* 体調（Row幅に合わせる） */}
          <Row label="体調">
          <View
            onLayout={(e) => setPcWrapW(e.nativeEvent.layout.width)}
            style={{ paddingHorizontal: SLIDER_GUTTER }}
          >
            {/* 値ラベル（つまみ中心に追従して中央揃え） */}
            <View style={{ height: 28, marginBottom: 2, position: "relative" }}>
              {pcWrapW > 0 && pcLabelW > 0 && (() => {
                const trackW = pcWrapW - SLIDER_GUTTER * 2;
                const thumbCenterX = SLIDER_GUTTER + (physicalCondition / MAX_0_200) * trackW;
                const left = Math.min(
                  Math.max(0, thumbCenterX - pcLabelW / 2 - LABEL_TWEAK_X),
                  pcWrapW - pcLabelW
                );
                
                return (
                  <Text
                    onLayout={(e) => setPcLabelW(e.nativeEvent.layout.width)}
                    style={{
                      position: "absolute",
                      left,
                      top: VALUE_LABEL_DROP,              // 追加：少し下へ
                      color: VALUE_LABEL_COLOR,           // 変更：濃い青
                      fontSize: VALUE_LABEL_SIZE,         // 変更：大きく
                      fontWeight: "700",                  // 変更：太字
                      fontFamily,
                    }}
                  >
                    {physicalCondition}
                  </Text>

                );
              })()}
              {/* 初回計測用（非表示） */}
              {pcLabelW === 0 && (
                <Text
                  onLayout={(e) => setPcLabelW(e.nativeEvent.layout.width)}
                  style={{ position: "absolute", opacity: 0, fontWeight: "800", fontFamily }}
                >
                  {physicalCondition}
                </Text>
              )}
            </View>

            <Slider
              minimumValue={0}
              maximumValue={200}
              step={1}
              value={physicalCondition}
              onValueChange={setPhysicalCondition}
              tapToSeek={true}
              minimumTrackTintColor={c.tint}
              maximumTrackTintColor={c.border}
              thumbTintColor={c.tint}
            />

            {/* 0 / 200：バーの下 */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
              <Text style={{ color: c.icon, fontFamily }}>0</Text>
              <Text style={{ color: c.icon, fontFamily }}>200</Text>
            </View>
          </View>
        </Row>



          {/* 気持ち（Row幅に合わせる） */}
          <Row label="気持ち">
            <View
              onLayout={(e) => setMcWrapW(e.nativeEvent.layout.width)}
              style={{ paddingHorizontal: SLIDER_GUTTER }}
            >
              <View style={{ height: 24, marginBottom: 6, position: "relative" }}>
                {mcWrapW > 0 && mcLabelW > 0 && (() => {
                  const trackW = mcWrapW - SLIDER_GUTTER * 2;
                  const thumbCenterX = SLIDER_GUTTER + (mentalCondition / MAX_0_200) * trackW;
                  const left = Math.min(
                    Math.max(0, thumbCenterX - mcLabelW / 2 - LABEL_TWEAK_X),
                    mcWrapW - mcLabelW
                  );
                  
                  return (
                    <Text
                      onLayout={(e) => setMcLabelW(e.nativeEvent.layout.width)}
                      style={{
                        position: "absolute",
                        left,
                        top: VALUE_LABEL_DROP,              // 追加：少し下へ
                        color: VALUE_LABEL_COLOR,           // 変更：濃い青
                        fontSize: VALUE_LABEL_SIZE,         // 変更：大きく
                        fontWeight: "700",                  // 変更：太字
                        fontFamily,
                      }}
                    >
                      {mentalCondition}
                    </Text>
                  );
                })()}
                {mcLabelW === 0 && (
                  <Text
                    onLayout={(e) => setMcLabelW(e.nativeEvent.layout.width)}
                    style={{ position: "absolute", opacity: 0, fontWeight: "800", fontFamily }}
                  >
                    {mentalCondition}
                  </Text>
                )}
              </View>

              <Slider
                minimumValue={0}
                maximumValue={200}
                step={1}
                value={mentalCondition}
                onValueChange={setMentalCondition}
                tapToSeek={true}
                minimumTrackTintColor={c.tint}
                maximumTrackTintColor={c.border}
                thumbTintColor={c.tint}
              />

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
                <Text style={{ color: c.icon, fontFamily }}>0</Text>
                <Text style={{ color: c.icon, fontFamily }}>200</Text>
              </View>
            </View>
          </Row>



          {/* 血圧（狭い端末では縦配置） */}
          <View
            style={{
              flexDirection: bpStack ? "column" : "row",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: c.text, fontWeight: "800", marginBottom: 8, fontFamily }}>
                最高血圧
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <TextInput
                  value={bpSys}
                  onChangeText={(t) => setBpSys(t.replace(/[^0-9]/g, ""))}
                  keyboardType="number-pad"
                  placeholder="例: 120"
                  placeholderTextColor={c.icon}
                  style={{
                    flex: 1,
                    minWidth: 0, // はみ出し防止
                    borderWidth: 1,
                    borderColor: c.border,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    backgroundColor: c.surface,
                    color: c.text,
                    fontFamily,
                  }}
                />
                <Text style={{ color: c.icon, flexShrink: 0, fontFamily }}>mmHg</Text>
              </View>
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: c.text, fontWeight: "800", marginBottom: 8, fontFamily }}>
                最低血圧
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <TextInput
                  value={bpDia}
                  onChangeText={(t) => setBpDia(t.replace(/[^0-9]/g, ""))}
                  keyboardType="number-pad"
                  placeholder="例: 80"
                  placeholderTextColor={c.icon}
                  style={{
                    flex: 1,
                    minWidth: 0, // はみ出し防止
                    borderWidth: 1,
                    borderColor: c.border,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    backgroundColor: c.surface,
                    color: c.text,
                    fontFamily,
                  }}
                />
                <Text style={{ color: c.icon, flexShrink: 0, fontFamily }}>mmHg</Text>
              </View>
            </View>
          </View>

          {/* メモ */}
          <Text style={{ color: c.text, fontWeight: "800", marginBottom: 8, fontFamily }}>
            メモ
          </Text>
          <TextInput
            value={memo}
            onChangeText={setMemo}
            placeholder=""
            placeholderTextColor={c.icon}
            multiline
            style={{
              minHeight: 110,
              borderWidth: 1,
              borderColor: c.border,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 12,
              backgroundColor: c.surface,
              color: c.text,
              textAlignVertical: "top",
              fontFamily,
            }}
          />
        </Card>


      </ScrollView>
    </View>
  );
}
