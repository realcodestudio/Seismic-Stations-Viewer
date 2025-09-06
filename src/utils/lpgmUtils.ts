import { CSSProperties } from "vue";
import { useThemeStore } from "../stores/theme";

export function getLPGMStyle(lpgm: string): CSSProperties {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;
  
  // LPGM等级对应的样式 浅色系 反之深色
  const lightStyles: Record<string, CSSProperties> = {
    "5": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(176, 0, 0, 0.6)",
      borderColor: "rgba(204, 0, 0, 1)",
    },
    "4": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(255, 112, 0, 0.6)",
      borderColor: "rgba(255, 152, 0, 1)",
    },
    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(255, 182, 0, 0.6)",
      borderColor: "rgba(255, 202, 0, 1)",
    },
    "2": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(55, 226, 120, 0.6)",
      borderColor: "rgba(139, 195, 74, 1)",
    },
    "1": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderColor: "rgba(247, 247, 247, 0.3)",
    },
    "0": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderColor: "rgba(247, 247, 247, 1)",
    },
  };

  const darkStyles: Record<string, CSSProperties> = {
    "5": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(176, 0, 0, 0.6)",
      borderColor: "rgba(236, 0, 0, 1)",
    },
    "4": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(220, 90, 0, 0.6)",
      borderColor: "rgba(236, 109, 0, 1)",
    },
    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(230, 150, 0, 0.6)",
      borderColor: "rgba(236, 163, 0, 1)",
    },
    "2": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(39, 164, 86, 0.6)",
      borderColor: "rgba(66, 165, 245, 1)",
    },
    "1": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(134, 134, 134, 0.6)",
      borderColor: "rgba(179, 179, 179, 1)",
    },
    "0": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "rgba(236, 236, 236, 1)",
    },
  };

  // 如果传入的LPGM等级不存在，则返回默认样式
  return isDark ? (darkStyles[lpgm] || darkStyles["0"]) : (lightStyles[lpgm] || lightStyles["0"]);
}
