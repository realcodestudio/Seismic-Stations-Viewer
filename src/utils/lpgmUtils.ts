import { CSSProperties } from "vue";
import { useThemeStore } from "../stores/theme";

export function getLPGMStyle(LPGM: string): CSSProperties {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;
  
  // 长周期地震动等级对应的浅色样式
  const lightStyles: Record<string, CSSProperties> = {
    "4": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(220, 0, 154, 0.5)",
      borderColor: "rgba(58, 0, 119, 1)",
    },

    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(255, 15, 15, 0.5)",
      borderColor: "rgba(204, 41, 122, 1)",
    },

    "2": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(255, 178, 0, 0.5)",
      borderColor: "rgba(204, 204, 41, 1)",
    },

    "1": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(255, 251, 17, 0.5)",
      borderColor: "rgba(41, 204, 41, 1)",
    },

    "0": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderColor: "rgba(204, 204, 204, 1)",
    },
  };

  // 长周期地震动等级对应的深色样式
  const darkStyles: Record<string, CSSProperties> = {
    "4": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(144, 0, 125, 1)",
      borderColor: "rgba(90, 0, 151, 1)",
    },

    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(187, 0, 0, 1)",
      borderColor: "rgba(236, 57, 138, 1)",
    },

    "2": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(220, 154, 0, 1)",
      borderColor: "rgba(236, 220, 57, 1)",
    },

    "1": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(205, 171, 0, 1)",
      borderColor: "rgba(57, 220, 57, 1)",
    },

    "0": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(0, 0, 0, 1)",
      borderColor: "rgba(236, 236, 236, 1)",
    },
  };

  // 如果传入的LPGM不存在，则返回默认样式
  return isDark ? (darkStyles[LPGM] || darkStyles["0"]) : (lightStyles[LPGM] || lightStyles["0"]);
}
