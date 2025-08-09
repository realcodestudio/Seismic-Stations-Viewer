import { CSSProperties } from "vue";
import { useThemeStore } from "../stores/theme";

export function getIntensityStyle(intensity: string): CSSProperties {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;
  
  // 烈度等级对应的样式 浅色系 反之深色
  const lightStyles: Record<string, CSSProperties> = {
    "12": {
      color: "#ffffff",
      backgroundColor: "#4B0074",
      borderColor: "#3a0077",
    },
    "11": {
      color: "#ffffff",
      backgroundColor: "#5D0090",
      borderColor: "#3a0077",
    },
    "10": {
      color: "#ffffff",
      backgroundColor: "#7301AC",
      borderColor: "#3a0077",
    },
    "9": {
      color: "#ffffff",
      backgroundColor: "#A00000",
      borderColor: "#3a0077",
    },
    "8": {
      color: "#ffffff",
      backgroundColor: "#E60000",
      borderColor: "#cc297a",
    },
    "7": {
      color: "#ffffff",
      backgroundColor: "#E69D1C",
      borderColor: "#cc3636",
    },
    "6": {
      color: "#ffffff",
      backgroundColor: "#E1C755",
      borderColor: "#cc7a29",
    },
    "5": {
      color: "#ffffff",
      backgroundColor: "#37E278",
      borderColor: "#cca329",
    },
    "4": {
      color: "#ffffff",
      backgroundColor: "#31A35C",
      borderColor: "#cccc29",
    },
    "3": {
      color: "#ffffff",
      backgroundColor: "#1E6EE6",
      borderColor: "#29cc29",
    },
    "2": {
      color: "#ffffff",
      backgroundColor: "#6B8788",
      borderColor: "#29a3cc",
    },
    "1": {
      color: "#000000",
      backgroundColor: "#FFFFFF",
      borderColor: "#F7F7F73",
    },
    "0": {
      color: "#000000",
      backgroundColor: "#FFFFFF",
      borderColor: "#F7F7F7",
    },
  };

  const darkStyles: Record<string, CSSProperties> = {
    "12": {
      color: "#ffffff",
      backgroundColor: "#7400B3",
      borderColor: "#5a0097",
    },
    "11": {
      color: "#ffffff",
      backgroundColor: "#7D0084",
      borderColor: "#5a0097",
    },
    "10": {
      color: "#ffffff",
      backgroundColor: "#820099",
      borderColor: "#5a0097",
    },
    "9": {
      color: "#ffffff",
      backgroundColor: "#A00000",
      borderColor: "#5a0097",
    },
    "8": {
      color: "#ffffff",
      backgroundColor: "#B90000",
      borderColor: "#ec398a",
    },
    "7": {
      color: "#ffffff",
      backgroundColor: "#C27C01",
      borderColor: "#ec4646",
    },
    "6": {
      color: "#ffffff",
      backgroundColor: "#D6B628",
      borderColor: "#ec8a39",
    },
    "5": {
      color: "#ffffff",
      backgroundColor: "#27A456",
      borderColor: "#ecb339",
    },
    "4": {
      color: "#ffffff",
      backgroundColor: "#1B8443",
      borderColor: "#ecdc39",
    },
    "3": {
      color: "#ffffff",
      backgroundColor: "#3C70BE",
      borderColor: "#39dc39",
    },
    "2": {
      color: "#000000",
      backgroundColor: "#BBBBBB",
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
      borderColor: "#ececec",
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
