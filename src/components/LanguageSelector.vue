<template>
  <div class="language-selector-overlay">
    <div class="language-selector-container">
      <!-- Logo 和项目名称 -->
      <div class="language-selector-logo">
        <img src="/ssv_logo.png" alt="Wolfx Logo" class="logo-image">
        <h1 class="project-name">Wolfx SSV</h1>
      </div>

      <p class="language-selector-subtitle">Select Language</p>
      <div class="language-options">
        <button 
          v-for="(name, code) in languageOptions" 
          :key="code"
          @click="selectLanguage(code)"
          class="language-option"
        >
          {{ name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['language-selected']);

// 语言选项
const languageOptions = {
  zhs: '简体中文（中国）',
  zht: '繁體中文（台灣）',
  en: 'English(US)',
  ja: '日本語',
  ko: '한국어'
};

// 选择语言
const selectLanguage = (languageCode: string) => {
  emit('language-selected', languageCode);
};
</script>

<style scoped>
.language-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}

.language-selector-container {
  text-align: center;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
}

.language-selector-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.logo-image {
  width: 150px;
  height: 150px;
  margin-bottom: 1rem;
}

.project-name {
  font-size: 2.5rem;
  font-weight: bold;
  color: #213547;
  margin: 0;
}

.language-selector-title {
  font-size: 2rem;
  color: #213547;
  margin-bottom: 1rem;
}

.language-selector-subtitle {
  font-size: 1.3rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.language-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.language-option {
  padding: 1rem;
  font-size: 1.1rem;
  border: 1px solid #e2e8f0;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-option:hover {
  background-color: #f8fafc;
  border-color: #41b883;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .language-selector-title {
    font-size: 1.5rem;
  }
  
  .language-selector-subtitle {
    font-size: 0.9rem;
  }
  
  .language-option {
    font-size: 1rem;
    padding: 0.8rem;
  }
}
</style>