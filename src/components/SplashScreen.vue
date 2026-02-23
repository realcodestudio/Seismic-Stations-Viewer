<template>
  <div class="splash-container">
    <div class="splash-content">
      <div class="splash-logo">
        <img src="/ssv_logo.png" alt="Wolfx SSV Logo" class="logo-image">
      </div>
      <h1 class="splash-title">Wolfx SSV</h1>
      <p class="splash-subtitle">Earthquake Seismic Stations Viewer</p>
      <div class="splash-progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const emit = defineEmits(['loading-complete']);
const progress = ref(0);

onMounted(() => {
  // 模拟加载进度
  const interval = setInterval(() => {
    progress.value += Math.random() * 10;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(interval);
      // 延迟一小段时间后通知加载完成
      setTimeout(() => {
        emit('loading-complete');
      }, 500);
    }
  }, 200);
});
</script>

<style scoped>
.splash-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease;
}

/* Logo 样式 */
.logo-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.splash-logo {
  animation: pulse 2s ease-in-out infinite;
}

.splash-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #213547;
  margin: 0;
}

.splash-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  margin: 0;
}

.splash-progress {
  width: 300px;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #7cc2ff 0%, #ff9ef2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .splash-title {
    font-size: 2.5rem;
  }
  
  .splash-subtitle {
    font-size: 1rem;
  }
  
  .splash-progress {
    width: 200px;
  }
}
</style>