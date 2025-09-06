import { CSSProperties } from "vue";
import { useThemeStore } from "../stores/theme";

// 检测是否为iOS设备
export function isiOSDevice(): boolean {
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }
  return false;
}

export function getShindoStyle(shindo: string): CSSProperties {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;
  const isiOS = isiOSDevice();
  
  // 震度等级对应的样式 浅色系 反之深色
  const lightStyles: Record<string, CSSProperties> = {
    "7": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(255, 0, 55, 0.57)" : "rgba(226, 0, 173, 0.57)",
      borderColor: "rgb(255, 0, 55)",
    },
    "6強": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(255, 0, 55, 0.57)" : "rgba(255, 0, 55, 0.57)",
      borderColor: "rgb(255, 0, 55)",
    },
    "6弱": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(255, 116, 116, 0.57)" : "rgba(255, 116, 116, 0.57)",
      borderColor: "rgba(255, 116, 116, 1)",
    },
    "5強": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(255, 131, 7, 0.57)" : "rgba(255, 131, 7, 0.57)",
      borderColor: "rgba(255, 131, 7, 1)",
    },
    "5弱": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(255, 204, 51, 0.57)" : "rgba(255, 204, 51, 0.57)",
      borderColor: "rgb(255, 204, 51)",
    },
    "4": {
      color: "rgb(0, 0, 0)",
      backgroundColor: isiOS ? "rgba(255, 255, 64, 0.45)" : "rgba(255, 255, 64, 0.45)",
      borderColor: "rgb(255, 255, 64)",
    },
    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(0, 255, 132, 0.3)" : "rgba(0, 255, 132, 0.3)",
      borderColor: "rgb(0, 255, 132)",
    },
    "2": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: isiOS ? "rgba(0, 191, 255, 0.3)" : "rgba(0, 191, 255, 0.3)",
      borderColor: "rgb(0, 191, 255)",
    },
    "1": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: isiOS ? "rgba(150, 245, 255, 0.3)" : "rgba(150, 245, 255, 0.3)",
      borderColor: "rgb(150, 244, 255)",
    },
    "0": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: isiOS ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.3)",
      borderColor: "rgb(255, 255, 255)",
    },
  };

  const darkStyles: Record<string, CSSProperties> = {
    "7": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(176, 0, 0, 0.8)" : "rgba(176, 0, 0, 0.6)",
      borderColor: "rgba(236, 0, 0, 1)",
    },
    "6强": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(220, 90, 0, 0.8)" : "rgba(220, 90, 0, 0.6)",
      borderColor: "rgba(236, 109, 0, 1)",
    },
    "6弱": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(230, 150, 0, 0.8)" : "rgba(230, 150, 0, 0.6)",
      borderColor: "rgba(236, 163, 0, 1)",
    },
    "5强": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(214, 182, 40, 0.8)" : "rgba(214, 182, 40, 0.6)",
      borderColor: "rgba(236, 196, 0, 1)",
    },
    "5弱": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(39, 164, 86, 0.8)" : "rgba(39, 164, 86, 0.6)",
      borderColor: "rgba(66, 165, 245, 1)",
    },
    "4": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(27, 132, 67, 0.8)" : "rgba(27, 132, 67, 0.6)",
      borderColor: "rgba(56, 142, 60, 1)",
    },
    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(60, 112, 190, 0.8)" : "rgba(60, 112, 190, 0.6)",
      borderColor: "rgba(41, 128, 185, 1)",
    },
    "2": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: isiOS ? "rgba(187, 187, 187, 0.8)" : "rgba(187, 187, 187, 0.6)",
      borderColor: "rgba(158, 158, 158, 1)",
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

  // 如果传入的震度不存在，则返回默认样式
  return isDark ? (darkStyles[shindo] || darkStyles["0"]) : (lightStyles[shindo] || lightStyles["0"]);
}

export function isSignificantShindo(shindo: string): boolean {
  // 震度4以上视为显著地震
  const significantLevels = [
    "4",
    "5弱",
    "5强",
    "6弱",
    "6强",
    "7",
  ];
  return significantLevels.includes(shindo);
}
