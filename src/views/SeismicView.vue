<template>
  <div class="seismic-container" :class="{ 'dark': themeStore.isDark }">
    <div class="theme-toggle" @click="themeStore.toggleTheme">
      <Icon :icon="themeStore.isDark ? 'ph:sun-bold' : 'ph:moon-bold'" />
    </div>
    
    <div class="stations-grid">
      <div v-for="data in seismicDataArray" 
           :key="data.type" 
           class="seismic-card"
           :style="getCardStyle(data.Shindo)"
           :class="{ 'significant': isSignificantShindo(data.Shindo) }">
        <div class="card-header">
          <h1 class="region"><Icon icon="mdi:map-marker" />{{ $t('region', { region: data.region }) }}</h1>
          <span class="update-time">{{ $t('update_time', { time: formatTime(data.update_at) }) }}</span>
        </div>
        
        <div class="data-grid">
          <div class="shindo-display" :style="getShindoStyle(data.Shindo || '0')">
            <h1 class="shindo-label">{{ $t('real_time_shindo') }}</h1>
            <span class="shindo-value">{{ data.Shindo || '0' }}</span>
          </div>
          
          <div class="intensity-display" :style="getIntensityStyle(formatIntensity(data.Intensity))">
            <h1 class="intensity-label">{{ $t('real_time_intensity') }}</h1>
            <span class="intensity-value">{{ formatIntensity(data.Intensity) }}</span>
          </div>
          
          <div class="data-item">
            <h2><Icon icon="mdi:waveform" /></h2>
            <h4>{{ $t('PGA') }}: {{ formatNumber(data.PGA) }}</h4>
          </div>
          
          <div class="data-item">
            <h2><Icon icon="mdi:calculator" /></h2>
            <h4>{{ $t('calc_shindo') }}: {{ formatNumber(data.CalcShindo) }}</h4>
          </div>
          
          <div class="data-item">
            <h2><Icon icon="mdi:format-vertical-align-top" /></h2>
            <h4>{{ $t('max_shindo') }}: {{ data.Max_Shindo }}</h4>
          </div>
          
          <div class="data-item">
            <h2><Icon icon="mdi:format-vertical-align-top" /></h2>
            <h4>{{ $t('max_intensity') }}: {{ data.Max_Intensity }}</h4>
          </div>
        </div>

        <div class="card-footer">
          <button class="detail-btn" @click="showStationDetail(data)">
            <Icon icon="mdi:information" class="icon" />
            {{ $t('details') }}
          </button>
        </div>
      </div>
    </div>

    <footer class="footer" :class="{ 'collapsed': isFooterCollapsed }">
      <div class="language-toggle">
        <button @click="changeLanguage('zh')">中文</button>
        <button @click="changeLanguage('en')">English</button>
        <button @click="changeLanguage('ja')">日本語</button>
      </div>
      <transition name="fade">
        <div v-if="!isFooterCollapsed">
          <p><b>{{ $t('footer_text') }}</b></p>
          <p><b><a href="https://acg.kr/ssv" target="_blank" rel="noopener noreferrer">{{ $t('github_link') }}</a>  {{ version }}</b></p>
        </div>
      </transition>
    </footer>

    <button class="toggle-footer" @click="toggleFooter">
      <Icon :icon="isFooterCollapsed ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
    </button>

    <StationDetailModal 
      ref="stationDetailModal"
      :stationType="selectedStation?.type || null"
    />
  </div>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue';
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useThemeStore } from '../stores/theme'
import { useSeismicStore } from '../stores/seismic'
import { initWebSocket } from '../services/websocket'
import { getShindoStyle, isSignificantShindo } from '../utils/shindoUtils'
import { getIntensityStyle } from '../utils/intensityUtils'
import StationDetailModal from '../components/StationDetailModal.vue'
import { useI18n } from 'vue-i18n'

const themeStore = useThemeStore()
const seismicStore = useSeismicStore()
let ws: WebSocket

const seismicDataArray = computed(() => {
  const data = Array.from(seismicStore.seismicDataMap.values())
  // console.log('当前数据:', data)
  return data
})

function getCardStyle(shindo: string): CSSProperties {
  const style = getShindoStyle(shindo); // 假设 getShindoStyle 返回一个包含颜色、边框的对象
  return {
    borderColor: style.borderColor || '#ccc',
    borderWidth: isSignificantShindo(shindo) ? '3px' : '1px',
    borderStyle: 'solid',
  };
}

function formatTime(timeStr: string) {
  return new Date(timeStr).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function initWebSocketWithDebug() {
  ws = initWebSocket();

  ws.onopen = () => {
    console.log('WebSocket 已连接');
  };

  ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
  };

  ws.onclose = () => {
    console.warn('WebSocket 已关闭，尝试重新连接...');
    setTimeout(initWebSocketWithDebug, 5000); // 5秒后重新连接
  };
}

onMounted(() => {
  initWebSocketWithDebug()
  console.log('初始数据:', seismicDataArray.value)
})

onUnmounted(() => {
  ws?.close()
})

const stationDetailModal = ref()
const selectedStation = ref()

function showStationDetail(data: any) {
  selectedStation.value = data
  stationDetailModal.value?.show()
}

function formatNumber(value: number): string {
  if (isNaN(value) || value === undefined || value === null) return '0';
  return Number(value).toFixed(3);
}

function formatIntensity(value: string | number | null | undefined): string {
  if (!value || isNaN(Number(value))) return '0';
  return Math.round(Number(value)).toString();
}

watch(() => themeStore.isDark, (isDark) => {
  document.documentElement.classList.toggle('dark', isDark)
}, { immediate: true })

const { locale } = useI18n()

function changeLanguage(lang: string) {
  locale.value = lang
}

const isFooterCollapsed = ref(true);
const version = ref('v3.1.2(241228)'); //底部版本号修改

function toggleFooter() {
  isFooterCollapsed.value = !isFooterCollapsed.value;
}
</script>

<style scoped lang="scss">
/* 添加全局样式 */
:global(body) {
  margin: 0;
  padding: 0;
  
}

:global(#app) {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color);
}

.seismic-container {
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  transition: background-color 0.3s ease;
  background: var(--bg-color);
  
  &.dark {
    --bg-color: #121212;
    --card-bg: #a1a1a12f;
    --text-color: rgba(255, 255, 255, 0.9);
    --text-secondary: rgba(255, 255, 255, 0.7);
    
    /* 确保滚动容器也使用深色背景 */
    &, & > * {
      background: var(--bg-color);
    }
  }
}

/* 添加全局深色模式样式 */
:global(html.dark) {
  background: #121212;
  
  body, #app {
    background: #121212;
  }
}

.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 0.9fr));
  gap: 1.9rem;
  max-width: 1000;
  margin: 0 auto;
  margin-bottom: 4rem;
}

.seismic-card {
  position: relative;
  padding-bottom: 3rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background: var(--card-bg);
  box-shadow: 0 4px 6px rgba(167, 167, 167, 0.61);
  transition: all 0.35s ease;
  border-radius: 2.5rem;
  
  &.significant {
    transform: scale(1.02);
  }

  &:hover {
    transform: translateY(-5px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
    
    .region {
      font-size: 1.75rem;
      margin: 0;
      color: var(--text-color);
      transition: color 0.3s ease;

      /* 使文本换行并自动缩小字体 */
      white-space: normal; /* 允许换行 */
      overflow-wrap: break-word; /* 允许单词换行 */
      min-width: 0; /* 允许缩小 */

      @media (max-width: 768px) {
        font-size: 1.5rem; /* 在小屏幕上缩小字体 */
      }

      @media (max-width: 480px) {
        font-size: 1.2rem; /* 在更小屏幕上进一步缩小字体 */
      }
    }
    
    .update-time {
      font-size: 0.9rem;
      opacity: 0.8;
      color: var(--text-secondary);
      transition: color 0.3s ease;
    }
  }

  .shindo-display,
  .intensity-display {
    grid-column: 0 ;
    display: grid;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
    border-radius: 1.2rem;
    margin-bottom: 1rem;
    min-height: 20px;
    max-width: auto;
    
    .shindo-label,
    .intensity-label {
      font-size: 0.9rem;
      margin-bottom: 0.3rem;
      opacity: 0.9;
    }
    
    .shindo-value,
    .intensity-value {
      font-size: 2rem;
      font-weight: bold;
    }
  }
  
  .data-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    
    .data-item {
      display: flex;
      align-items: center;
      gap: auto; 
      max-height: 40px;
      padding: 0.8rem;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.13);
      backdrop-filter: blur(10px);
      color: var(--text-color);
      transition: all 0.3s ease;
      
      .icon {
        font-size: 1.2rem;
        color: var(--text-color);
        transition: color 0.3s ease;
      }
      
      h4 {
        margin: 0;
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
        color: var(--text-color);
        transition: color 0.3s ease;
      }
    }
  }

  .card-footer {
    position: absolute;
    bottom: 0;
    left: 1;
    right:0;
    padding: 1rem;
    display: flex;
    justify-content: center;
    
    .detail-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 2rem;
      background: var(--card-bg);
      color: var(--text-color);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.1);
      
      &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
      }
      
      .icon {
        font-size: 1.2rem;
        color: var(--text-color);
      }
      
      span {
        line-height: 1;
      }
    }
  }
}

.theme-toggle {
  position: fixed;
  top: 2rem;
  right: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.25rem;
  border-radius: 75%;
  background: var(--card-bg);
  transition: all 1s ease;
  z-index: 100;
  
  &:hover {
    transform: scale(1, 1);
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  text-align: center;
  background: var(--card-bg);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 90;
  transition: transform 0.3s ease;

  &.collapsed {
    transform: translateY(100%);
  }

  .language-toggle {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-color);
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.toggle-footer {
  position: fixed;
  right: 1rem;
  bottom: 7rem;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.7rem;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

@media (max-width: 768px) {
  .stations-grid {
    grid-template-columns: 1fr;
  }
  
  .seismic-card {
    padding: 1rem;
    
    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      
      .region {
        font-size: 1.2rem;
      }
    }
    
    .data-grid {
      grid-template-columns: 1fr;
    }
    
    .card-footer {
      padding: 0.8rem;
      
      .detail-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }
    }
  }
}

.dark {
  .seismic-card {
    .detail-btn {
      background: rgba(255, 255, 255, 0);
      
      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    }
  }
}

.seismic-card {
  .card-header {
    .region {
      transition: color 0.3s ease;
    }
    
    .update-time {
      transition: color 0.3s ease;
    }
  }
  
  .data-item {
    transition: all 0.3s ease;
    
    h4, .icon {
      transition: color 0.3s ease;
    }
  }
}
</style>