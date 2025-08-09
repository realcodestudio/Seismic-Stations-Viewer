import { CSSProperties } from "vue";
import { useThemeStore } from "../stores/theme";

export function getLPGMStyle(LPGM: string): CSSProperties {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;
  
  // 长周期地震动等级对应的浅色样式
  const lightStyles: Record<string, CSSProperties> = {
    "4": {
      color: "#ffffff",
      backgroundColor: "#DC009A",
      borderColor: "#3a0077",
    },

    "3": {
      color: "#ffffff",
      backgroundColor: "#FF0F0F",
      borderColor: "#cc297a",
    },

    "2": {
      color: "#ffffff",
      backgroundColor: "#FFB200",
      borderColor: "#cccc29",
    },

    "1": {
      color: "#000000",
      backgroundColor: "#FFFB11",
      borderColor: "#29cc29",
    },

    "0": {
      color: "#000000",
      backgroundColor: "#ffffff",
      borderColor: "#cccccc",
    },
  };

  // 长周期地震动等级对应的深色样式
  const darkStyles: Record<string, CSSProperties> = {
    "4": {
      color: "#ffffff",
      backgroundColor: "#90007D",
      borderColor: "#5a0097",
    },

    "3": {
      color: "#ffffff",
      backgroundColor: "#BB0000",
      borderColor: "#ec398a",
    },

    "2": {
      color: "#ffffff",
      backgroundColor: "#DC9A00",
      borderColor: "#ecdc39",
    },

    "1": {
      color: "#000000",
      backgroundColor: "#CDAB00",
      borderColor: "#39dc39",
    },

    "0": {
      color: "#ffffff",
      backgroundColor: "#000000",
      borderColor: "#ececec",
    },
  };

  // 如果传入的LPGM不存在，则返回默认样式
  return isDark ? (darkStyles[LPGM] || darkStyles["0"]) : (lightStyles[LPGM] || lightStyles["0"]);
}
