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

// 根据设备类型获取合适的透明度
export function getAdjustedOpacity(baseOpacity: number): number {
  return isiOSDevice() ? Math.min(baseOpacity + 0.2, 0.8) : baseOpacity;
}

export function getIntensityStyle(intensity: string): CSSProperties {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;
  const isiOS = isiOSDevice();
  
  // 烈度等级对应的样式 浅色系 反之深色
  const lightStyles: Record<string, CSSProperties> = {
    "12": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(75, 0, 116, 0.8)" : "rgba(75, 0, 116, 0.6)",
      borderColor: "rgba(58, 0, 119, 1)",
    },
    "11": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(94, 0, 144, 0.75)" : "rgba(94, 0, 144, 0.55)",
      borderColor: "rgba(58, 0, 119, 1)",
    },
    "10": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(115, 1, 172, 0.65)" : "rgba(115, 1, 172, 0.45)",
      borderColor: "rgba(58, 0, 119, 1)",
    },
    "9": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(160, 0, 0, 0.7)" : "rgba(160, 0, 0, 0.5)",
      borderColor: "rgba(58, 0, 119, 1)",
    },
    "8": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(230, 0, 0, 0.75)" : "rgba(230, 0, 0, 0.55)",
      borderColor: "rgba(204, 41, 122, 1)",
    },
    "7": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(230, 156, 28, 0.8)" : "rgba(230, 156, 28, 0.6)",
      borderColor: "rgba(204, 54, 54, 1)",
    },
    "6": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(225, 199, 85, 0.75)" : "rgba(225, 199, 85, 0.55)",
      borderColor: "rgba(204, 122, 41, 1)",
    },
    "5": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(55, 226, 120, 0.75)" : "rgba(55, 226, 120, 0.55)",
      borderColor: "rgba(204, 163, 41, 1)",
    },
    "4": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(49, 163, 92, 0.7)" : "rgba(49, 163, 92, 0.5)",
      borderColor: "rgba(204, 204, 41, 1)",
    },
    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(30, 110, 230, 0.7)" : "rgba(30, 110, 230, 0.5)",
      borderColor: "rgba(41, 204, 41, 1)",
    },
    "2": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(107, 135, 136, 0.7)" : "rgba(107, 135, 136, 0.5)",
      borderColor: "rgba(41, 163, 204, 1)",
    },
    "1": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: isiOS ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.3)",
      borderColor: "rgba(247, 247, 247, 0.3)",
    },
    "0": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: isiOS ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.3)",
      borderColor: "rgba(247, 247, 247, 1)",
    },
  };

  const darkStyles: Record<string, CSSProperties> = {
    "12": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(116, 0, 179, 0.8)" : "rgba(116, 0, 179, 0.6)",
      borderColor: "rgba(90, 0, 151, 1)",
    },
    "11": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(125, 0, 132, 0.8)" : "rgba(125, 0, 132, 0.6)",
      borderColor: "rgba(90, 0, 151, 1)",
    },
    "10": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(130, 0, 153, 0.8)" : "rgba(130, 0, 153, 0.6)",
      borderColor: "rgba(90, 0, 151, 1)",
    },
    "9": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(160, 0, 0, 0.8)" : "rgba(160, 0, 0, 0.6)",
      borderColor: "rgba(90, 0, 151, 1)",
    },
    "8": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: isiOS ? "rgba(185, 0, 0, 0.8)" : "rgba(185, 0, 0, 0.6)",
      borderColor: "rgba(236, 57, 138, 1)",
    },
    "7": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(194, 124, 1, 0.6)",
      borderColor: "rgba(236, 70, 70, 1)",
    },
    "6": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(214, 182, 40, 0.6)",
      borderColor: "rgba(236, 138, 57, 1)",
    },
    "5": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(39, 164, 86, 0.6)",
      borderColor: "rgba(236, 179, 57, 1)",
    },
    "4": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(27, 132, 67, 0.6)",
      borderColor: "rgba(236, 220, 57, 1)",
    },
    "3": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(60, 112, 190, 0.6)",
      borderColor: "rgba(57, 220, 57, 1)",
    },
    "2": {
      color: "rgba(0, 0, 0, 1)",
      backgroundColor: "rgba(187, 187, 187, 0.5)",
      borderColor: "rgba(57, 179, 220, 1)",
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

  // 如果传入的烈度不存在，则返回默认样式
  return isDark ? (darkStyles[intensity] || darkStyles["0"]) : (lightStyles[intensity] || lightStyles["0"]);
}

export function isSignificantIntensity(Intensity: string): boolean {
  // 烈度3以上视为显著地震
  const significantLevels = [
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  return significantLevels.includes(Intensity);
}
