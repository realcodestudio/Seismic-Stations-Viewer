<template>
  <div class="seismic-container" :class="{ 'dark': themeStore.isDark }">
    <div class="theme-toggle" @click="themeStore.toggleTheme">
      <Icon :icon="themeStore.isDark ? 'ph:sun-bold' : 'ph:moon-bold'" />
    </div>
    
    <div class="settings-toggle" @click="toggleSettings">
      <Icon icon="mdi:cog" />
    </div>
    
    <div class="settings-panel" :class="{ 'show': showSettings }">
      <div class="settings-header">
        <h3>{{ $t('settings') }}</h3>
        <button class="close-btn" @click="toggleSettings">
          <Icon icon="mdi:close" />
        </button>
      </div>
      <div class="settings-content">
        <div class="alert-section">
          <label>{{ $t('alert_settings') }}</label>
          <div class="alert-control">
            <div class="threshold-select">
              <select 
                v-model="selectedShindo"
                @change="saveAlertSettings"
                :disabled="!alertEnabled"
              >
                <option 
                  v-for="option in shindoOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ $t(option.label) }}
                </option>
              </select>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="alertEnabled"
                @change="saveAlertSettings"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="refresh-section">
          <label>{{ $t('auto_refresh_settings') }}</label>
          <div class="refresh-control">
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="autoRefreshEnabled"
                @change="saveAutoRefreshSetting"
              >
              <span class="slider"></span>
            </label>
            <span class="refresh-text">{{ $t('background_auto_refresh') }}</span>
          </div>
        </div>

        <div class="filter-section">
          <label>{{ $t('filter_by_type') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="stationTypeFilter"
              :placeholder="$t('enter_station_type')"
            />
          </div>
        </div>

        <div class="filter-section" v-if="stationTypeFilter">
          <label>{{ $t('custom_station_name') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="customStationName[stationTypeFilter]"
              :placeholder="$t('enter_custom_station_name')"
            />
            <span v-if="showNoMatchError" class="error-emoji">❌</span>
          </div>
        </div>

        <div class="language-section">
          <label>{{ $t('language') }}</label>
          <div class="language-buttons">
            <button 
              v-for="lang in ['zhs', 'zht','en', 'ja']" 
              :key="lang"
              @click="changeLanguage(lang)"
              :class="{ 'active': locale === lang }"
            >
              {{ languageNames[lang] }}
            </button>
          </div>
        </div>

        <div class="version-section">
          <a href="https://acg.kr/ssv" 
             target="_blank" 
             rel="noopener noreferrer"
             class="github-link"
             :title="$t('github_link')">
            <Icon icon="mdi:github" />
          </a>
          <div class="website-links">
            <a href="https://wolfx.jp" 
               target="_blank" 
               rel="noopener noreferrer">
              Wolfx.jp
            </a>
            <a href="https://bousai.cn" 
               target="_blank" 
               rel="noopener noreferrer">
              bousai.cn
            </a>
          </div>
          <div class="version-info">
            <Icon icon="vscode-icons:file-type-vue" class="project-icon" />
            <span class="version">{{ version }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="stations-grid">
      <div v-for="data in filteredSeismicData" 
           :key="data.type" 
           class="seismic-card"
           :style="getCardStyle(data.Shindo)"
           :class="{ 'significant': isSignificantShindo(data.Shindo) }">
        <div class="card-header">
          <h1 class="region"><Icon icon="mdi:map-marker" />{{ customStationName[data.type] || $t('region', { region: data.region }) }}</h1>
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

// 1. 语言名称类型定义
interface LanguageNames {
  [key: string]: string;
}

const languageNames: LanguageNames = {
  zhs: '简体中文',
  zht: '繁體中文',
  en: 'English',
  ja: '日本語'
}

// 2. WebSocket 相关
// 删除之前的 let ws: WebSocket 声明
const ws = ref<WebSocket | null>(null)

// 语言切换函数
const changeLanguage = (lang: string) => {
  locale.value = lang
}

// 自动刷新相关函数
const startAutoRefresh = () => {
  if (refreshInterval) return
  
  refreshInterval = window.setInterval(() => {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
      console.log('WebSocket连接已断开，尝试重新连接...')
      initWebSocket()
    }
  }, 600000)
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}



// 组件卸载时清理
onUnmounted(() => {
  stopAutoRefresh()
  if (ws.value) {
    ws.value.close()
  }
})

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

onMounted(() => {
  initWebSocket()
  console.log('初始数据:', seismicDataArray.value)
})


const stationDetailModal = ref()
const selectedStation = ref()

function showStationDetail(data: any) {
  selectedStation.value = data 
  stationDetailModal.value?.show() // 显示详情弹窗
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

////
////
////
////
const version = ref('v3.4.3(250223)') // 修改版本号
////
////
////
////

const showSettings = ref(false)
const stationTypeFilter = ref('')

function toggleSettings() {
  showSettings.value = !showSettings.value
}

const filteredSeismicData = computed(() => {
  const data = seismicDataArray.value.map(station => {
    if ('countryName' in station && station.countryName === '台湾') {
      station.countryName = '中国台湾';
    }
    //地区名替换
    // else if ('countryName' in station && station.countryName === '香港') {
    //   station.countryName = 'example 香港特别行政区';
    // }
    
    return station;
    
  });

  if (!stationTypeFilter.value) {
    return data;
  }

  return data.filter(station => station.type === stationTypeFilter.value);
});

const showNoMatchError = computed(() => {
  return stationTypeFilter.value && stationTypeFilter.value.length > 0 && filteredSeismicData.value.length === 0
})

// 定义震度等级选项
const shindoOptions = [
  { value: 3.0, label: 'shindo_3' },
  { value: 4.0, label: 'shindo_4' },
  { value: 4.5, label: 'shindo_5-' },
  { value: 5.0, label: 'shindo_5+' },
  { value: 5.5, label: 'shindo_6-' },
  { value: 6.0, label: 'shindo_6+' },
  { value: 7.0, label: 'shindo_7' }
]

// 警报设置状态
const alertEnabled = ref(false)
const selectedShindo = ref(4.0) // 默认震度4
const alertSound = new Audio('/alert.mp3')

// 修改震度监听逻辑
watch(() => seismicDataArray.value, (newData) => {
  if (!alertEnabled.value) return
  
  // 如果有输入测站序列号，则只检查该测站
  if (stationTypeFilter.value) {
    const targetStation = newData.find(station => station.type === stationTypeFilter.value)
    if (targetStation) {
      const shindo = parseFloat(targetStation.Shindo)
      if (!isNaN(shindo) && shindo >= selectedShindo.value) {
        alertSound.play().catch(err => console.error('播放警报失败:', err))
      }
    }
    return
  }
  
  // 如果没有输入测站序列号，则检查所有测站
  newData.forEach(station => {
    const shindo = parseFloat(station.Shindo)
    if (!isNaN(shindo) && shindo >= selectedShindo.value) {
      alertSound.play().catch(err => console.error('播放警报失败:', err))
    }
  })
}, { deep: true })

// 保存设置到本地存储
function saveAlertSettings() {
  localStorage.setItem('alertSettings', JSON.stringify({
    enabled: alertEnabled.value,
    threshold: selectedShindo.value
  }))
}

// 初始化时读取本地存储的设置
onMounted(() => {
  const savedSettings = localStorage.getItem('alertSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    alertEnabled.value = settings.enabled
    selectedShindo.value = settings.threshold
  }
})

// 添加自动刷新设置
const autoRefreshEnabled = ref(false)
let refreshInterval: number | null = null

// 监听自动刷新设置变化
watch(autoRefreshEnabled, (newValue) => {
  if (newValue) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
})

// 保存设置
const saveAutoRefreshSetting = () => {
  localStorage.setItem('autoRefreshEnabled', autoRefreshEnabled.value.toString())
}

// 初始化时读取设置
onMounted(() => {
  const savedSetting = localStorage.getItem('autoRefreshEnabled')
  if (savedSetting !== null) {
    autoRefreshEnabled.value = savedSetting === 'true'
    if (autoRefreshEnabled.value) {
      startAutoRefresh()
    }
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopAutoRefresh()
})

const customStationName = ref<Record<string, string>>({}) // 修改为对象以存储每个UUID的名称
</script>

<style scoped lang="scss">
/* 添加全局样式 */
:global(body) {
  font-family: 'Google Sans', sans-serif;
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
    --card-bg-rgb: 161, 161, 161;
    --text-color: rgba(255, 255, 255, 0.9);
    --text-secondary: rgba(255, 255, 255, 0.7);
    
    /* 确保滚动容器也使用深色背景 */
    &, & > * {
      background: var(--bg-color);
    }
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 400px));
  gap: 1.5rem;
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
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
  min-width: 300px;
  max-width: 400px;
  min-height: auto;
  
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

      /* 使文本不换行 */
      white-space: nowrap; /* 取消换行 */
      overflow: hidden; /* 隐藏溢出文本 */
      text-overflow: ellipsis; /* 溢出文本显示省略号 */
      
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
    display: flex; /* 使用flex布局 */
    flex-direction: column; /* 垂直排列 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    padding: 1rem;
    border-radius: 1.2rem;
    margin-bottom: 1rem;
    flex: 1; /* 使每个组件占据相同的宽度 */
    min-width: 150px; /* 设置最小宽度 */
    max-width: auto; /* 设置最大宽度 */
    
    .shindo-label,
    .intensity-label {
      font-size: 0.9rem;
      margin-bottom: 0.3rem;
      opacity: 0.9;
      white-space: nowrap; /* 取消换行 */
    }
    
    .shindo-value,
    .intensity-value {
      font-size: 3rem;
      font-weight: bold;
      white-space: nowrap; /* 取消换行 */
    }
  }
  
  .data-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
    
    .data-item {
      flex: 1; /* 使数据项占据相同的宽度 */
      display: flex;
      align-items: center; /* 垂直居中 */
      padding: 0.5rem;
      border-radius: 0.8rem; /* 增加圆角 */
      background: rgba(255, 255, 255, 0.1);
      margin-bottom: 0.5rem;
      text-align: left; /* 文字左对齐 */

      h2 {
        color: var(--text-color); /* 确保图标颜色与主题一致 */
        font-size: 1.5rem; /* 调整图标大小 */
        margin-right: 0.9rem; /* 添加右边距以分隔图标和文字 */
      }
      
      h4 {
        margin: 0; /* 去掉默认的上下边距 */
        color: var(--text-color); /* 确保文字颜色与主题一致 */
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
      font-size: 0rem;
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

  @media (max-width: 768px) {
    padding: 1rem;
    
    .data-grid {
      gap: 0.6rem;
      
      .data-item {
        padding: 0.4rem 0.6rem;
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

.settings-toggle {
  position: fixed;
  top: 2rem;
  right: 4rem;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.25rem;
  border-radius: 75%;
  background: var(--card-bg);
  transition: all 0.3s ease;
  z-index: 100;
  
  &:hover {
    transform: scale(1.1);
  }
}

.settings-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: rgba(var(--card-bg-rgb), 0.5);
  backdrop-filter: blur(120px) saturate(180%);
  -webkit-backdrop-filter: blur(120px) saturate(180%);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  
  &.show {
    right: 0;
  }

  .settings-header {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    
    h3 {
      margin: 0;
      color: var(--text-color);
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--text-color);
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.3s;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }

  .settings-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }

    .version-section {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      padding: 1rem;
      
      // GitHub 图标链接
      .github-link {
        color: var(--text-color);
        font-size: 1.8rem;
        opacity: 0.8;
        transition: all 0.3s ease;
        
        &:hover {
          opacity: 1;
          transform: scale(1.1);
        }
      }
      
      // 网站链接容器
      .website-links {
        display: flex;
        gap: 1rem;
        align-items: center;
        
        a {
          color: var(--text-color);
          text-decoration: none;
          opacity: 0.8;
          font-size: 0.9rem;
          transition: opacity 0.3s;
          
          &:hover {
            opacity: 1;
          }
        }
      }
      
      // 版本信息
      .version-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        .project-icon {
          font-size: 1.2rem;
          color: var(--text-color);
          opacity: 0.8;
        }
        
        .version {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      }
    }

    .alert-section {
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
        font-weight: 500;
        text-align: left;
        padding-left: 0.5rem;
      }

      .alert-control {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 0.8rem;
        
        .threshold-select {
          flex: 1;
          
          select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            cursor: pointer;
            font-size: 0.9rem;
            
            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            
            &:focus {
              outline: none;
              border-color: rgba(255, 255, 255, 0.3);
            }
            
            option {
              background: var(--card-bg);
              color: var(--text-color);
            }
          }
        }

        // 开关按钮样式保持不变
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
          flex-shrink: 0;

          input {
            opacity: 0;
            width: 0;
            height: 0;

            &:checked + .slider {
              background-color: #2196F3;
              
              &:before {
                transform: translateX(26px);
              }
            }
          }

          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;

            &:before {
              position: absolute;
              content: "";
              height: 16px;
              width: 16px;
              left: 4px;
              bottom: 4px;
              background-color: white;
              transition: .4s;
              border-radius: 50%;
            }
          }
        }
      }
    }

    .filter-section,
    .language-section {
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
        font-weight: 500;
        text-align: left;
        padding-left: 0.5rem;
      }
    }

    .language-section {
      .language-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;

        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          &.active {
            background: rgba(255, 255, 255, 0.3);
            font-weight: bold;
          }
        }
      }
    }

    .filter-section {
      .input-wrapper {
        position: relative;
        width: 100%;
        
        input {
          width: 100%;
          padding: 0.8rem 2rem 0.8rem 1rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 0.8rem;
          background: var(--bg-color);
          color: var(--text-color);
          font-size: 1rem;
          letter-spacing: 0.5px;
          
          &:focus {
            outline: none;
            border-color: rgba(0, 0, 0, 0.2);
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
          }

          &::placeholder {
            color: var(--text-secondary);
            opacity: 0.7;
          }
        }
        
        .error-emoji {
          position: absolute;
          right: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          pointer-events: none;
        }
      }
    }

    .refresh-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        display: block;
        color: var(--text-color);
        font-weight: 500;
        text-align: left;
        padding-left: 0.5rem;
      }

      .refresh-control {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 0.8rem;

        .refresh-text {
          color: var(--text-color);
          font-size: 0.9rem;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
          flex-shrink: 0;

          input {
            opacity: 0;
            width: 0;
            height: 0;

            &:checked + .slider {
              background-color: #2196F3;
              
              &:before {
                transform: translateX(26px);
              }
            }
          }

          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;

            &:before {
              position: absolute;
              content: "";
              height: 16px;
              width: 16px;
              left: 4px;
              bottom: 4px;
              background-color: white;
              transition: .4s;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    right: -100%;
  }
}

/* 具体图标的样式 */
.icon {
  color: var(--icon-color); /* 设置图标颜色 */
  transition: color 0.3s ease; /* 添加过渡效果 */
}
</style>