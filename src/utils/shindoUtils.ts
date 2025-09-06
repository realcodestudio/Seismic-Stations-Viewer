import { CSSProperties } from "vue";
import { useThemeStore } from "../stores/theme";

export function getShindoStyle(shindo: string): CSSProperties {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;
  
  // JMA震度等级对应的浅色样式
  const lightStyles: Record<string, CSSProperties> = {
    "7": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(226, 0, 173, 0.57)",
      borderColor: "rgba(58, 0, 119, 1)",
    },
    "6強": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(255, 0, 55, 0.57)",
      borderColor: "rgba(204, 41, 122, 1)",
    },
    "6弱": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(255, 116, 116, 0.57)",
      borderColor: "rgba(204, 54, 54, 1)",
    },
    "5強": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(255, 131, 7, 0.57)",
      borderColor: "rgba(204, 122, 41, 1)",
    },
    "5弱": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(255, 204, 51, 0.57)",
      borderColor: "rgba(204, 163, 41, 1)",
    },
    "4": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(255, 255, 64, 0.45)",
      borderColor: "rgba(204, 204, 41, 1)",
    },
    "3": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(0, 255, 132, 0.3)",
      borderColor: "rgba(41, 204, 41, 1)",
    },
    "2": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(0, 191, 255, 0.3)",
      borderColor: "rgba(41, 163, 204, 1)",
    },
    "1": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(150, 245, 255, 0.3)",
      borderColor: "rgba(163, 163, 163, 1)",
    },
    "0": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderColor: "rgba(214, 213, 213, 1)",
    },
  };

  // JMA震度等级对应的深色样式
  const darkStyles: Record<string, CSSProperties> = {
    "7": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(98, 0, 131, 1)",
      borderColor: "rgba(90, 0, 151, 1)",
    },
    "6強": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(141, 0, 0, 1)",
      borderColor: "rgba(236, 57, 138, 1)",
    },
    "6弱": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(255, 0, 0, 1)",
      borderColor: "rgba(236, 70, 70, 1)",
    },
    "5強": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(255, 82, 34, 1)",
      borderColor: "rgba(236, 138, 57, 1)",
    },
    "5弱": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(246, 148, 0, 1)",
      borderColor: "rgba(236, 179, 57, 1)",
    },
    "4": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(200, 200, 63, 1)",
      borderColor: "rgba(236, 220, 57, 1)",
    },
    "3": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(0, 156, 141, 1)",
      borderColor: "rgba(57, 220, 57, 1)",
    },
    "2": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(0, 92, 178, 1)",
      borderColor: "rgba(57, 179, 220, 1)",
    },
    "1": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(134, 134, 134, 1)",
      borderColor: "rgba(179, 179, 179, 1)",
    },
    "0": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(0, 0, 0, 1)",
      borderColor: "rgba(238, 238, 238, 1)",
    },
  };

  // 如果传入的震度等级不存在，则返回默认样式
  return isDark ? (darkStyles[shindo] || darkStyles["0"]) : (lightStyles[shindo] || lightStyles["0"]);
}

export function isSignificantShindo(shindo: string): boolean {
  // 震度3以上视为显著地震
  const significantLevels = ["3", "4", "5弱", "5強", "6弱", "6強", "7"];
  return significantLevels.includes(shindo);
}
