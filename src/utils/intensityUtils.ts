import { CSSProperties } from "vue";

export function getIntensityStyle(intensity: string): CSSProperties {
  // 烈度等级对应的样式
  const styles: Record<string, CSSProperties> = {
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
      backgroundColor: "#1B8242",
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
      backgroundColor: "#6B7878",
      borderColor: "#29a3cc",
    },
    "1": {
      color: "#ffffff",
      backgroundColor: "#3F3F3F",
      borderColor: "#a3a3a3",
    },
    "0": {
      color: "#ffffff",
      backgroundColor: "#3F3F3F",
      borderColor: "#cccccc",
    },
  };

  // 如果传入的烈度不存在，则返回默认样式
  return styles[intensity] || styles["0"];
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
