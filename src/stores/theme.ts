import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  // 深色模式状态
  const isDark = ref(false);

  // 切换深色模式
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    // 更新document的class以应用深色模式样式
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    isDark,
    toggleTheme
  };
});
