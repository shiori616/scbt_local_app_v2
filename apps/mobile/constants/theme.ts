import { Platform } from "react-native";
import { BrandColors, UIColors } from "./colors";

export const Colors = {
  light: {
    text: BrandColors.text,
    background: BrandColors.background,
    tint: BrandColors.primary,
    icon: BrandColors.muted,
    tabIconDefault: BrandColors.muted,
    tabIconSelected: BrandColors.primary,
    border: UIColors.border,
    surface: BrandColors.white,
  },
  dark: {
    // ダークはまず「見やすさ優先」の暫定（ブランドに寄せるのは後でOK）
    text: BrandColors.white,
    background: "#000000",
    tint: BrandColors.secondary,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: BrandColors.white,
    border: UIColors.border,
    surface: "#111111",
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
