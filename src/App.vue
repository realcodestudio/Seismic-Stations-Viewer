<template>
  <div class="app-container">
    <!-- 开场动画 -->
    <SplashScreen v-if="showSplash" @loading-complete="handleLoadingComplete" />
    
    <!-- 语言选择器 -->
    <LanguageSelector 
      v-if="showLanguageSelector" 
      @language-selected="handleLanguageSelected" 
    />
    
    <!-- 用户协议模态框 -->
    <TermsModal 
      v-if="showTermsModal" 
      :show="showTermsModal" 
      @accept="handleTermsAccepted" 
      @close="handleTermsClosed" 
    />
    
    <!-- 主页面内容 -->
    <div v-if="showMainContent" class="main-content">
      <SeismicView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SeismicView from './views/SeismicView.vue';
import SplashScreen from './components/SplashScreen.vue';
import TermsModal from './components/TermsModal.vue';
import LanguageSelector from './components/LanguageSelector.vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

// 状态管理
const showSplash = ref(true);
const showLanguageSelector = ref(false);
const showTermsModal = ref(false);
const showMainContent = ref(false);
const isFirstTimeUser = ref(false);

onMounted(() => {
  // 检查用户是否已同意条款
  const termsAccepted = localStorage.getItem('termsAccepted');
  isFirstTimeUser.value = !termsAccepted;
});

// 处理加载完成
const handleLoadingComplete = () => {
  // 隐藏开场动画
  showSplash.value = false;
  
  // 如果是首次用户，显示语言选择器
  if (isFirstTimeUser.value) {
    showLanguageSelector.value = true;
  } else {
    // 否则直接显示主内容
    showMainContent.value = true;
  }
};

// 处理语言选择
const handleLanguageSelected = (languageCode: string) => {
  // 设置选择的语言
  locale.value = languageCode;
  // 隐藏语言选择器，显示条款模态框
  showLanguageSelector.value = false;
  showTermsModal.value = true;
};

// 处理用户同意条款
const handleTermsAccepted = () => {
  // 保存用户同意的状态
  try {
    localStorage.setItem('termsAccepted', 'true');
  } catch (error) {
    console.warn('无法保存到 localStorage:', error);
  }
  showTermsModal.value = false;
  showMainContent.value = true;
};

// 处理用户关闭条款模态框
const handleTermsClosed = () => {
  // 即使用户关闭模态框，也显示主内容
  showTermsModal.value = false;
  showMainContent.value = true;
};
</script>

<style>
:root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  min-height: 100vh;
}

.main-content {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
