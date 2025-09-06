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

export function getLPGMStyle(lpgm: string): CSSProperties {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;
  const isiOS = isiOSDevice();
  
  // LPGM等级对应的样式 浅色系 反之深色
  const lightStyles: Record<string, CSSProperties> = {
    "4": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(220, 0, 154, 0.5)" : "rgba(220, 0, 154, 0.5)",
      borderColor: "rgb(220, 0, 154)",
    },
    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(255, 15, 15, 0.5)" : "rgba(255, 15, 15, 0.5)",
      borderColor: "rgb(255, 15, 15)",
    },
    "2": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(255, 178, 0, 0.5)" : "rgba(255, 178, 0, 0.5)",
      borderColor: "rgb(255, 179, 0)",
    },
    "1": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: isiOS ? "rgba(255, 251, 17, 0.5)" : "rgba(255, 251, 17, 0.5)",
      borderColor: "rgb(247, 247, 247)",
    },
    "0": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: isiOS ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.3)",
      borderColor: "rgb(255, 255, 255)",
    },
  };

  const darkStyles: Record<string, CSSProperties> = {
    "4": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(220, 90, 0, 0.8)" : "rgba(220, 90, 0, 0.6)",
      borderColor: "rgba(236, 109, 0, 1)",
    },
    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(230, 150, 0, 0.8)" : "rgba(230, 150, 0, 0.6)",
      borderColor: "rgba(236, 163, 0, 1)",
    },
    "2": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(39, 164, 86, 0.8)" : "rgba(39, 164, 86, 0.6)",
      borderColor: "rgba(66, 165, 245, 1)",
    },
    "1": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(134, 134, 134, 0.8)" : "rgba(134, 134, 134, 0.6)",
      borderColor: "rgba(179, 179, 179, 1)",
    },
    "0": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.7)",
      borderColor: "rgba(236, 236, 236, 1)",
    },
  };

  // 如果传入的LPGM等级不存在，则返回默认样式
  return isDark ? (darkStyles[lpgm] || darkStyles["0"]) : (lightStyles[lpgm] || lightStyles["0"]);
}
