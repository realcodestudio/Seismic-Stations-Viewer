import { CSSProperties } from "vue";
import { useThemeStore } from "../stores/theme";

export function getShindoStyle(shindo: string): CSSProperties {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;
  
  // JMA震度等级对应的浅色样式
  const lightStyles: Record<string, CSSProperties> = {
    "7": {
      color: "#ffffff",
      backgroundColor: "#E200AD",
      borderColor: "#3a0077",
    },
    "6強": {
      color: "#ffffff",
      backgroundColor: "#FF0037",
      borderColor: "#cc297a",
    },
    "6弱": {
      color: "#ffffff",
      backgroundColor: "#FF7474",
      borderColor: "#cc3636",
    },
    "5強": {
      color: "#ffffff",
      backgroundColor: "#FF8307",
      borderColor: "#cc7a29",
    },
    "5弱": {
      color: "#000000",
      backgroundColor: "#FFCC33",
      borderColor: "#cca329",
    },
    "4": {
      color: "#000000",
      backgroundColor: "#E2E236",
      borderColor: "#cccc29",
    },
    "3": {
      color: "#000000",
      backgroundColor: "#00FF84",
      borderColor: "#29cc29",
    },
    "2": {
      color: "#000000",
      backgroundColor: "#00BFFF",
      borderColor: "#29a3cc",
    },
    "1": {
      color: "#000000",
      backgroundColor: "#96F5FF",
      borderColor: "#a3a3a3",
    },
    "0": {
      color: "#000000",
      backgroundColor: "#FFFFFF",
      borderColor: "#D6D5D5",
    },
  };

  // JMA震度等级对应的深色样式
  const darkStyles: Record<string, CSSProperties> = {
    "7": {
      color: "#ffffff",
      backgroundColor: "#620083",
      borderColor: "#5a0097",
    },
    "6強": {
      color: "#ffffff",
      backgroundColor: "#8D0000",
      borderColor: "#ec398a",
    },
    "6弱": {
      color: "#ffffff",
      backgroundColor: "#FF0000",
      borderColor: "#ec4646",
    },
    "5強": {
      color: "#ffffff",
      backgroundColor: "#FF5222",
      borderColor: "#ec8a39",
    },
    "5弱": {
      color: "#ffffff",
      backgroundColor: "#F69400",
      borderColor: "#ecb339",
    },
    "4": {
      color: "#000000",
      backgroundColor: "#C8C83F",
      borderColor: "#ecdc39",
    },
    "3": {
      color: "#000000",
      backgroundColor: "#009C8D",
      borderColor: "#39dc39",
    },
    "2": {
      color: "#000000",
      backgroundColor: "#005CB2",
      borderColor: "#39b3dc",
    },
    "1": {
      color: "#ffffff",
      backgroundColor: "#868686",
      borderColor: "#b3b3b3",
    },
    "0": {
      color: "#ffffff",
      backgroundColor: "#000000",
      borderColor: "#eeeeee",
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
