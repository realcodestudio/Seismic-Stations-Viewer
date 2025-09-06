<template>
  <div class="seismic-container">
    <div class="controls-container">
      <button class="main-toggle" @click="toggleControls">
        <Icon :icon="showControls ? 'mdi:close' : 'mdi:menu'" size="32" style="width: 32px; height: 32px;" />
      </button>
      <div class="control-buttons" :class="{ 'expanded': showControls }">
        <div class="settings-toggle" @click="() => { toggleSettings(); showControls = false; }">
          <Icon icon="mdi:cog" size="24" />
        </div>
        <div class="wave-icon" @click="() => { toggleStationData(); showControls = false; }">
          <Icon icon="mdi:waveform" size="24" />
        </div>
      </div>
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
              <select v-model="selectedShindo" @change="saveAlertSettings" :disabled="!alertEnabled">
                <option v-for="option in shindoOptions" :key="option.value" :value="option.value">
                  {{ $t(option.label) }}
                </option>
              </select>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="alertEnabled" @change="saveAlertSettings">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="refresh-section">
          <label>{{ $t('auto_refresh_settings') }}</label>
          <div class="refresh-control">
            <label class="toggle-switch">
              <input type="checkbox" v-model="autoRefreshEnabled" @change="saveAutoRefreshSetting">
              <span class="slider"></span>
            </label>
            <span class="refresh-text">{{ $t('background_auto_refresh') }}</span>
          </div>
        </div>

        <div class="websocket-section">
          <label>{{ $t('websocket_settings') }}</label>
          <div class="websocket-control">
            <div class="input-wrapper">
              <input type="text" v-model="websocketUrl" :placeholder="$t('websocket_url_placeholder')" />
            </div>
            <button @click="saveWebsocketUrl">{{ $t('save') }}</button>
            <button @click="resetWebsocketUrl" class="reset-btn" :title="$t('reset')">
              <Icon icon="mdi:refresh" />
            </button>
          </div>
        </div>

        <div class="display-section">
          <label>{{ $t('display_settings') }}</label>
          <div class="display-options">
            <button 
              class="background-option-btn"
              :class="{ active: displaySettings.pga }"
              @click="() => { displaySettings.pga = !displaySettings.pga; saveDisplaySettings(); }"
            >
              PGA
            </button>

            <button 
              class="background-option-btn"
              :class="{ active: displaySettings.measuredIntensity }"
              @click="() => { displaySettings.measuredIntensity = !displaySettings.measuredIntensity; saveDisplaySettings(); }"
            >
              {{ $t('calc_shindo') }}
            </button>

            <button 
              class="background-option-btn"
              :class="{ active: displaySettings.maxJMAShindo }"
              @click="() => { displaySettings.maxJMAShindo = !displaySettings.maxJMAShindo; saveDisplaySettings(); }"
            >
              {{ $t('max_shindo') }}
            </button>

            <button 
              class="background-option-btn"
              :class="{ active: displaySettings.maxCSISIntensity }"
              @click="() => { displaySettings.maxCSISIntensity = !displaySettings.maxCSISIntensity; saveDisplaySettings(); }"
            >
              {{ $t('max_intensity') }}
            </button>


            <div class="display-section">
              <label>{{ $t('RT_display_settings') }}</label>
              <div class="display-options">
                <button 
                  class="background-option-btn"
                  :class="{ active: displaySettings.longPeriod }"
                  @click="() => { displaySettings.longPeriod = !displaySettings.longPeriod; saveDisplaySettings(); }"
                >
                  {{ $t('realtime_LPGM') }}
                </button>

                <button 
                  class="background-option-btn"
                  :class="{ active: displaySettings.realTimeJMA }"
                  @click="() => { displaySettings.realTimeJMA = !displaySettings.realTimeJMA; saveDisplaySettings(); }"
                >
                  {{ $t('real_time_shindo') }}
                </button>

                <button 
                  class="background-option-btn"
                  :class="{ active: displaySettings.realTimeCSIS }"
                  @click="() => { displaySettings.realTimeCSIS = !displaySettings.realTimeCSIS; saveDisplaySettings(); }"
                >
                  {{ $t('real_time_intensity') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <label>{{ $t('filter_by_type') }}</label>
          <div class="input-wrapper" style="display: flex; gap: 0.5rem;">
            <input type="text" v-model="stationTypeFilter" :placeholder="$t('enter_station_type')" style="flex: 1;" />
            <button @click="saveStationUUID" :disabled="!stationTypeFilter.trim()" class="save-btn">{{ $t('save') }}</button>
            <button @click="discardStationUUID" :disabled="!stationTypeFilter.trim()" class="discard-btn">{{ $t('discard') }}</button>
            <span v-if="showNoMatchError" class="error-emoji">❌</span>
          </div>
        </div>


        <div class="filter-section" v-if="stationTypeFilter">
          <label>{{ $t('custom_station_name') }}</label>
          <div class="input-wrapper" style="display: flex; gap: 0.5rem;">
            <input type="text" v-model="customStationName[stationTypeFilter]" :placeholder="$t('enter_custom_station_name_escaped')"style="flex: 1;" />
            <button @click="saveCustomStationName" :disabled="!stationTypeFilter.trim()" class="save-btn">{{ $t('save') }}</button>
            <button @click="discardCustomStationName" :disabled="!stationTypeFilter.trim()" class="discard-btn">{{ $t('discard') }}</button>
          </div>
        </div> 
       




        <div class="language-section">
          <label>{{ $t('language') }}</label>
          <div class="display-options">
            <button v-for="lang in ['zhs', 'zht', 'en', 'ja', 'ko']" :key="lang" @click="changeLanguage(lang)"
              class="background-option-btn"
              :class="{ 'active': locale === lang }">
              {{ languageNames[lang] }}
            </button>
          </div>


          <div class="geoip-section">
            <button @click="() => refreshGeoIP(true)" :disabled="isGeoIPDetecting" class="geoip-refresh-btn">
              <Icon icon="mdi:refresh" :class="{ 'spinning': isGeoIPDetecting }" />
              {{ isGeoIPDetecting ? $t('detecting_location') : $t('redetect_location') }}
            </button>
          </div>
        </div>

        <div class="background-section">
          <label>{{ $t('background_settings') }}</label>
          <div class="background-options">
            <button 
              class="background-option-btn" 
              :class="{ active: backgroundType === 'white' }"
              @click="() => { backgroundType = 'white'; saveBackgroundSettings(); }"
            >
              {{ $t('white_background') }}
            </button>

            <button 
              class="background-option-btn" 
              :class="{ active: backgroundType === 'wolfx' }"
              @click="() => { backgroundType = 'wolfx'; saveBackgroundSettings(); }"
            >
              {{ $t('wolfx_background') }}
            </button>
            
            <button 
              class="background-option-btn" 
              :class="{ active: backgroundType === 'green-black' }"
              @click="() => { backgroundType = 'green-black'; saveBackgroundSettings(); }"
            >
              {{ $t('green_black_background') }}
            </button>
            
            <button 
              class="background-option-btn" 
              :class="{ active: backgroundType === 'black' }"
              @click="() => { backgroundType = 'black'; saveBackgroundSettings(); }"
            >
              {{ $t('black_background') }}
            </button>
            
            <button 
              v-if="backgroundType === 'wolfx'"
              class="background-option-btn"
              @click="refreshBackground"
              title="刷新背景"
            >
              <Icon icon="mdi:refresh" />
            </button>
          </div>
        </div>

        <div class="version-section">
          <a href="https://acg.kr/ssv" target="_blank" rel="noopener noreferrer" class="github-link"
            :title="$t('github_link')">
            <Icon icon="mdi:github" />
          </a>

          <button @click="goToCreateStation"
            style="background: #2196f3; color: #fff; border: none; border-radius: 300px; padding: 10px 20px; font-size: 1rem; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(33,150,243,0.15); transition: background 0.2s;">
            {{ $t('create_station') }}
          </button>

          <div class="website-links">
            <a href="https://wolfx.jp" target="_blank" rel="noopener noreferrer">
              Wolfx.jp
            </a>
            <a href="https://bousai.cn" target="_blank" rel="noopener noreferrer">
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

    <!-- API提醒模态框 -->
    <div v-if="showApiWarning" class="api-warning-modal" @click="closeApiWarning">
      <div class="api-warning-content" @click.stop>
        <div class="api-warning-header">
          <h3>{{ $t('api_warning_title') }}</h3>
          <button class="close-btn" @click="closeApiWarning">
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div class="api-warning-body">
          <p>{{ $t('api_warning_message') }}</p>
          <div class="api-warning-buttons">
            <button class="cancel-btn" @click="cancelApiChange">{{ $t('cancel') }}</button>
            <button class="confirm-btn" @click="confirmApiChange">{{ $t('confirm') }}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="stations-grid">
      <div v-for="data in filteredSeismicData" :key="data.type" class="seismic-card" :style="getCardStyle(data.Shindo)"
        :class="{ 'significant': isSignificantShindo(data.Shindo) }">
        <div class="card-header">
          <h1 class="region">
            <Icon icon="mdi:map-marker" />{{ customStationName[data.type] || $t('region', { region: data.region }) }}
          </h1>
          <span class="update-time">{{ $t('update_time', { time: formatTime(data.update_at) }) }}</span>
        </div>

        <div v-if="showStationData" class="data-grid" :class="{ 'single-item': getActiveDisplayItemsCount() === 1, 'double-items': getActiveDisplayItemsCount() === 2 }">
          <div v-if="displaySettings.realTimeJMA" class="shindo-display" :style="getDisplayStyle('shindo', data.Shindo || '0')">
            <h1 class="shindo-label">{{ $t('real_time_shindo') }}</h1>
            <span class="shindo-value">{{ data.Shindo || '0' }}</span>
          </div>

          <div v-if="displaySettings.realTimeCSIS" class="intensity-display"
            :style="getDisplayStyle('intensity', formatIntensity(data.Intensity))">
            <h1 class="intensity-label">{{ $t('real_time_intensity') }}</h1>
            <span class="intensity-value">{{ formatIntensity(data.Intensity) }}</span>
          </div>

          <div v-if="displaySettings.longPeriod" class="LPGM-display" :style="getDisplayStyle('lpgm', String(data.LPGM || '0'))">
            <h1 class="LPGM-label">{{ $t('realtime_LPGM') }}</h1>
            <span class="LPGM-value">{{ data.LPGM || '0' }}</span>
          </div>

          <div class="data-box-grid">
            <div v-if="displaySettings.pga" class="data-box">
              <div class="data-box-content">
                <div class="label-text">
                  <Icon icon="mdi:waveform" />
                  <span>{{ $t('PGA') }}</span>
                </div>
                <h4>{{ formatNumber(data.PGA) }}</h4>
              </div>
            </div>

            <div v-if="displaySettings.measuredIntensity" class="data-box">
              <div class="data-box-content">
                <div class="label-text">
                  <Icon icon="mdi:calculator" />
                  <span>{{ $t('calc_shindo') }}</span>
                </div>
                <h4>{{ formatNumber(data.CalcShindo) }}</h4>
              </div>
            </div>

            <div v-if="displaySettings.maxJMAShindo" class="data-box">
              <div class="data-box-content">
                <div class="label-text">
                  <Icon icon="mdi:format-vertical-align-top" />
                  <span>{{ $t('max_shindo') }}</span>
                </div>
                <h4>{{ data.Max_Shindo }}</h4>
              </div>
            </div>

            <div v-if="displaySettings.maxCSISIntensity" class="data-box">
              <div class="data-box-content">
                <div class="label-text">
                  <Icon icon="mdi:format-vertical-align-top" />
                  <span>{{ $t('max_intensity') }}</span>
                </div>
                <h4>{{ data.Max_Intensity }}</h4>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!showStationData" class="simplified-data-grid">
          <div class="simplified-data-item">
            <span class="label">{{ $t('real_time_shindo') }}</span>
            <span class="value">{{ data.Shindo || '0' }}</span>
          </div>
          <div class="simplified-data-item">
            <span class="label">{{ $t('real_time_intensity') }}</span>
            <span class="value">{{ formatIntensity(data.Intensity) }}</span>
          </div>
          <div class="simplified-data-item">
            <span class="label">{{ $t('PGA') }}</span>
            <span class="value">{{ formatNumber(data.PGA) }}</span>
          </div>
        </div>

        <PgaWaveformChart v-if="!showStationData" :pga-history="data.pgaHistory" />

        <div class="card-footer">
          <button class="detail-btn" @click="showStationDetail(data)">
            <Icon icon="mdi:information" class="icon" />
            {{ $t('details') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredSeismicData.length === 0" class="no-station-hint">
      <Icon icon="mdi:map-marker-off" style="font-size: 3rem; color: #bbb; margin-bottom: 1rem;" />
      <div class="hint-text">{{ $t('no_station_available') }}</div>
    </div>

    <StationDetailModal ref="stationDetailModal" :stationType="selectedStation?.type || null" />
    <WaveformWarningModal :isVisible="showWarningModal" @agree="handleWarningAgreed" @cancel="handleWarningCanceled" />
  </div>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue';
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'

const showControls = ref(false);
const toggleControls = () => {
  showControls.value = !showControls.value;

  if (showControls.value) {
    setTimeout(() => {
      showControls.value = false;
    }, 4000);  // 如果是展开状态，4秒后自动折叠
  }
};

// WebSocket URL配置
const websocketUrl = ref(localStorage.getItem('websocketUrl') || 'wss://seisjs.wolfx.jp/all_seis');
const defaultWebsocketUrl = 'wss://seisjs.wolfx.jp/all_seis';

// API提醒模态框相关数据
const showApiWarning = ref(false);
const previousWebsocketUrl = ref(websocketUrl.value);

const saveWebsocketUrl = () => {
  // 检查是否是非默认API地址
  if (websocketUrl.value !== defaultWebsocketUrl) {
    // 保存当前URL作为前一个URL
    previousWebsocketUrl.value = websocketUrl.value;
    // 显示提醒模态框
    showApiWarning.value = true;
  } else {
    // 如果是默认API地址，直接保存
    localStorage.setItem('websocketUrl', websocketUrl.value);
    alert('WebSocket URL saved, please refresh the page to apply the changes.');
  }
};

// API提醒模态框相关方法
const closeApiWarning = () => {
  showApiWarning.value = false;
};

const cancelApiChange = () => {
  // 恢复为原来的API地址
  websocketUrl.value = defaultWebsocketUrl;
  showApiWarning.value = false;
};

const confirmApiChange = () => {
  // 使用API地址修改后保存
  localStorage.setItem('websocketUrl', websocketUrl.value);
  showApiWarning.value = false;
  alert('WebSocket URL saved, please refresh the page to apply the changes.');
};

// 重置WebSocket API到默认值
const resetWebsocketUrl = () => {
  websocketUrl.value = defaultWebsocketUrl;
  localStorage.setItem('websocketUrl', defaultWebsocketUrl);
  alert('WebSocket URL reset to default value.');
};

import { Icon } from '@iconify/vue'
import { useSeismicStore } from '../stores/seismic'
import { initWebSocket } from '../services/websocket'
import { getShindoStyle, isSignificantShindo } from '../utils/shindoUtils'
import { getIntensityStyle } from '../utils/intensityUtils'
import { getLPGMStyle } from '../utils/lpgmUtils'
import StationDetailModal from '../components/StationDetailModal.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import PgaWaveformChart from '../components/PgaWaveformChart.vue'
import WaveformWarningModal from '../components/WaveformWarningModal.vue'

// 保存测站单独显示功能UUID到本地存储
const saveStationUUID = () => {
  console.log('saveStationUUID called');
  if (stationTypeFilter.value && stationTypeFilter.value.trim()) {
    try {
      localStorage.setItem('savedStationUUID', stationTypeFilter.value.trim());
      // 同时保存自定义测站名称
      saveCustomStationName();
      console.log('UUID saved successfully:', stationTypeFilter.value.trim());
      // 使用alert可能被浏览器阻止，添加控制台日志
      alert(t('uuid_saved_successfully'));
    } catch (error: any) {
      console.error('Failed to save UUID:', error);
      alert('Save: ' + (error.message || error));
    }
  }
};

// 保存自定义测站名称到本地存储
const saveCustomStationName = () => {
  try {
    const currentUUID = stationTypeFilter.value.trim();
    if (currentUUID) {
      const customName = customStationName.value[currentUUID];
      if (customName && customName.trim()) {
        // 保存当前UUID的自定义名称
        localStorage.setItem(`customStationName_${currentUUID}`, customName.trim());
      } else {
        // 如果没有自定义名称，删除保存的名称
        localStorage.removeItem(`customStationName_${currentUUID}`);
      }
      console.log('Custom station name saved successfully for UUID:', currentUUID);
    }
  } catch (error) {
    console.error('Failed to save custom station name:', error);
  }
};

// 舍弃测站UUID
const discardStationUUID = () => {
  console.log('discardStationUUID called');
  try {
    // 获取当前UUID以清除对应的自定义名称
    const currentUUID = stationTypeFilter.value;
    localStorage.removeItem('savedStationUUID');
    stationTypeFilter.value = '';
    
    // 同时清除保存的自定义测站名称
    if (currentUUID && currentUUID.trim()) {
      localStorage.removeItem(`customStationName_${currentUUID.trim()}`);
      // 从响应式对象中删除
      delete customStationName.value[currentUUID.trim()];
    }
    
    console.log('UUID discarded successfully');
    alert(t('uuid_discarded_successfully'));
  } catch (error: any) {
    console.error('Failed to discard UUID:', error);
    alert('舍弃失败: ' + (error.message || error));
  }
};

// 舍弃自定义测站名称
const discardCustomStationName = () => {
  console.log('discardCustomStationName called');
  try {
    const currentUUID = stationTypeFilter.value;
    if (currentUUID && currentUUID.trim()) {
      localStorage.removeItem(`customStationName_${currentUUID.trim()}`);
      // 从响应式对象中删除
      delete customStationName.value[currentUUID.trim()];
      console.log('Custom station name discarded successfully');
      alert(t('custom_name_discarded_successfully'));
    }
  } catch (error: any) {
    console.error('Failed to discard custom station name:', error);
    alert('舍弃失败: ' + (error.message || error));
  }
};

// 添加调试函数，检查localStorage状态
const checkUUIDStatus = () => {
  const savedUUID = localStorage.getItem('savedStationUUID');
  console.log('Current saved UUID:', savedUUID);
  console.log('Current stationTypeFilter:', stationTypeFilter.value);
};

// 页面加载时检查状态
onMounted(() => {
  checkUUIDStatus();
});

// 移除自动保存的watch监听器
// watch(stationTypeFilter, (newValue) => {
//   if (newValue && newValue.trim()) {
//     localStorage.setItem('savedStationUUID', newValue.trim());
//   } else {
//     localStorage.removeItem('savedStationUUID');
//   }
// });


////版本号！！！
////版本号！！！
////版本号！！！
////版本号！！！
////版本号！！！
////版本号！！！
const version = ref('v4.2.5r6') // 修改版本号
////版本号！！！
////版本号！！！
////版本号！！！
////版本号！！！
////版本号！！！
////版本号！！！

const seismicStore = useSeismicStore()

// 1. 语言名称类型定义
interface LanguageNames {
  [key: string]: string;
}

const languageNames: LanguageNames = {
  zhs: '简体中文(中国)',
  zht: '繁體中文(台灣)',
  en: 'English(US)',
  ja: '日本語',
  ko: '한국어'
}

// 2. WebSocket 相关
// 删除之前的 let ws: WebSocket 声明
const ws = ref<WebSocket | null>(null)

const { locale } = useI18n()

// 语言映射
const langMap: Record<string, string> = {
  zhs: 'zh-CN',  // 简体中文
  zht: 'zh-TW',  // 繁体中文
  en: 'en',      // 英文
  ja: 'ja',      // 日文
  ko: 'ko'       // 韩文
}

// 设置初始语言
onMounted(() => {
  const currentLang = locale.value
  document.documentElement.lang = langMap[currentLang] || currentLang
})

// 监听语言变化
watch(locale, (newLang: string) => {
  document.documentElement.lang = langMap[newLang] || newLang
}, { immediate: true })

// 语言切换函数
const changeLanguage = (lang: string) => {
  locale.value = lang
  // URL 更新会通过 locale 的 watcher 自动处理
}

// 手动刷新 GeoIP 检测
const refreshGeoIP = async (forceRefresh = false) => {
  if (forceRefresh) {
    // 清除缓存，强制重新检测
    localStorage.removeItem('geoip_cache')
    localStorage.removeItem('geoip_cache_time')
  }
  
  // 重新检测（使用缓存）
  await detectUserLocation(true)
}

// 确保在页面加载时处理哈希URL
// onMounted(() => {
//   // 处理URL哈希参数
//   const handleHashChange = () => {
//     const hash = window.location.hash.substring(1); // 获取#后面的部分
//     if (hash) {
//       const { uuid } = safeParseURL(hash);
//       if (uuid && uuid.trim()) {
//         stationTypeFilter.value = uuid.trim();
//       }
//     }
//   };
// 
//   // 初始加载时处理
//   handleHashChange();
//   // 监听哈希变化
//   window.addEventListener('hashchange', handleHashChange);
// 
//   // 组件卸载时移除监听
//   onUnmounted(() => {
//     window.removeEventListener('hashchange', handleHashChange);
//   });
// });

// 页面加载时的 GeoIP 检测（每次刷新都调用 API）
const initGeoIP = async () => {
  // 清除缓存，确保每次都调用 API
  try {
    localStorage.removeItem('geoip_cache')
    localStorage.removeItem('geoip_cache_time')
  } catch (error) {
    console.warn('无法清除缓存:', error)
  }
  
  // 调用 API 检测（不使用缓存）
  await detectUserLocation(false)
  
  // 从本地存储读取保存的UUID - 放在detectUserLocation之后
  try {
    const savedUUID = localStorage.getItem('savedStationUUID');
    if (savedUUID && savedUUID.trim()) {
      stationTypeFilter.value = savedUUID.trim();
      // 同时加载自定义测站名称
      loadCustomStationName(savedUUID.trim());
    }
  } catch (error) {
    console.warn('无法读取保存的UUID:', error);
  }
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
  // 应用测站类型过滤
  if (stationTypeFilter.value && stationTypeFilter.value.trim()) {
    const filter = stationTypeFilter.value.trim().toLowerCase();
    return data.filter(item => 
      item.type && item.type.toLowerCase().includes(filter)
    );
  }
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

onMounted(async () => {
  initWebSocket()
  console.log('初始数据:', seismicDataArray.value)
  
  // 监听浏览器前进后退按钮
// window.addEventListener('popstate', () => {
//   const path = window.location.pathname
//   if (path !== '/' && path.length > 1) {
//     const { uuid, customName, isWaveMode } = safeParseURL(path)
//     
//     // 设置UUID过滤器
//     if (uuid && uuid.trim()) {
//       stationTypeFilter.value = uuid.trim()
//       // 存储自定义名称
//       if (customName && customName.trim()) {
//         customStationName.value[uuid.trim()] = customName.trim()
//       }
//     }
//     
//     // 如果是波形模式，切换到波形模式
//     if (isWaveMode) {
//       showStationData.value = false
//       localStorage.setItem('dontShowWaveformWarning', 'true')
//     }
//     
//     // 如果是详情页面，设置待显示的UUID
//     // Removed showDetail check as it's no longer used
//     if (uuid && uuid.trim()) {
//       pendingDetailUUID.value = uuid.trim()
//     }
//   } else {
//     stationTypeFilter.value = ''
//   }
// })
})


const stationDetailModal = ref()
const selectedStation = ref()

function showStationDetail(data: any) {
  selectedStation.value = data
  stationDetailModal.value?.show() // 显示详情弹窗
  
  // 更新 URL 添加 /detail 后缀
  // const uuid = data.type
  // const customName = customStationName.value[uuid] || ''
  // 
  // const newUrl = generateURL(uuid, customName, !showStationData.value)
  // window.history.pushState({}, '', newUrl)
}

function formatNumber(value: number): string {
  if (isNaN(value) || value === undefined || value === null) return '0';
  return Number(value).toFixed(3);
}

function formatIntensity(value: string | number | null | undefined): string {
  if (!value || isNaN(Number(value))) return '0';
  return Math.round(Number(value)).toString();
}

const stationTypeFilter = ref('')
const showSettings = ref(false)

// 从 URL 初始化测站过滤器和自定义名称
onMounted(async () => {
  // 处理 URL 参数
  // const path = window.location.pathname
  // if (path !== '/' && path.length > 1) {
  //   const { uuid, customName, isWaveMode } = safeParseURL(path)
  //   
  //   // 设置 UUID
  //   if (uuid && uuid.trim()) {
  //     stationTypeFilter.value = uuid.trim()
  //   }
  //   
  //   // 设置自定义名称
  //   if (customName && customName.trim()) {
  //     customStationName.value[uuid.trim()] = customName.trim()
  //   }
  //   
  //   // 如果是波形模式，切换到波形模式
  //   if (isWaveMode) {
  //     showStationData.value = false
  //     localStorage.setItem('dontShowWaveformWarning', 'true')
  //   }
  //   
  //   // 如果需要显示详情模态框，保存状态等待数据加载
  //   if (uuid && uuid.trim()) {
  //     // 将需要显示详情的 UUID 保存到响应式变量
  //     pendingDetailUUID.value = uuid.trim()
  //   }
  // }
  
  // 页面加载时自动执行一次位置检测（每次刷新都调用 API）
  await initGeoIP()
})

// 监听测站过滤器变化，更新 URL
// watch(stationTypeFilter, (newValue) => {
//   if (newValue && newValue.trim()) {
//     // 检查是否有自定义名称
//     const customName = customStationName.value[newValue.trim()]
//     const newUrl = generateURL(newValue.trim(), customName, !showStationData.value)
//     window.history.pushState({}, '', newUrl)
//   } else {
//     // 如果没有输入，生成只包含语言前缀的 URL
//     const newUrl = generateURL()
//     window.history.pushState({}, '', newUrl)
//   }
// }, { immediate: false })

// 添加显示设置的响应式状态
const displaySettings = ref({
  pga: true,
  measuredIntensity: true,
  maxJMAShindo: true,
  maxCSISIntensity: true,
  // 添加顶部实时数据的显示控制
  realTimeJMA: true,
  realTimeCSIS: true,
  longPeriod: true
})
  
  // 计算当前激活的显示项目数量
  function getActiveDisplayItemsCount() {
    let count = 0;
    if (displaySettings.value.realTimeJMA) count++;
    if (displaySettings.value.realTimeCSIS) count++;
    if (displaySettings.value.longPeriod) count++;
    return count;
  }

function toggleSettings() {
  showSettings.value = !showSettings.value
}

const now = ref(Date.now())
let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  
  // 清理 popstate 事件监听器
  window.removeEventListener('popstate', () => {})
})

function parseUpdateAt(str: string): number {
  return new Date(str.replace(/-/g, '/')).getTime()
}

const EXPIRE_SECONDS = 25 // 约25秒后自动隐藏update_time长时间未更新测站

const filteredSeismicData = computed(() => {
  let arr = !stationTypeFilter.value
    ? seismicDataArray.value
    : seismicDataArray.value.filter(data => data.type === stationTypeFilter.value)
  return arr.filter(data => {
    const updateTime = parseUpdateAt(data.update_at)
    return now.value - updateTime < EXPIRE_SECONDS * 1000
  })
})

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
const alertSound = new Audio('./alert.mp3')

// 修改震度监听逻辑
watch(() => seismicDataArray.value, (newData: any[]) => {
  if (!alertEnabled.value) return

  // 如果有输入测站序列号，则只检查该测站
  if (stationTypeFilter.value) {
    const targetStation = newData.find((station: any) => station.type === stationTypeFilter.value)
    if (targetStation) {
      const shindo = parseFloat(targetStation.Shindo)
      if (!isNaN(shindo) && shindo >= selectedShindo.value) {
        alertSound.play().catch(err => console.error('播放警报失败:', err))
      }
    }
    return
  }

  // 如果没有输入测站序列号，则检查所有测站
  newData.forEach((station: any) => {
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
watch(autoRefreshEnabled, (newValue: boolean) => {
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

const customStationName = ref<Record<string, string>>({}) // 存储自定义名称，键为UUID
const pendingDetailUUID = ref<string | null>(null) // 待显示详情的测站UUID
const isGeoIPDetecting = ref(false) // 是否正在检测地理位置

// 国家/地区代码到语言的映射（用于手动刷新功能）
const countryLanguageMap: Record<string, string> = {
  'CN': 'zhs',   // 中国大陆 - 简体中文
  'HK': 'zht',   // 香港 - 繁体中文
  'MO': 'zht',   // 澳门 - 繁体中文
  'TW': 'zht',   // 台湾 - 繁体中文
  'KR': 'ko',    // 韩国 - 韩语
  'JP': 'ja',    // 日本 - 日语
  'US': 'en',    // 美国 - 英语
  'UK': 'en',    // 英国 - 英语
  'EN': 'en'     // 英语国家代码 - 英语
}


// 检测用户地理位置并设置语言（用于手动刷新）
const detectUserLocation = async (useCache = false): Promise<void> => {
  if (isGeoIPDetecting.value) return // 防止重复检测
  
  // 页面加载时跳过缓存检查，直接调用 GeoAPI
  // 只有在手动刷新时才检查缓存
  if (useCache) {
    // 检查本地存储中是否有缓存的检测结果
    let cachedGeoIP: string | null = null
    let cacheTime: string | null = null
    
    try {
      cachedGeoIP = localStorage.getItem('geoip_cache')
      cacheTime = localStorage.getItem('geoip_cache_time')
    } catch (error) {
      console.warn('无法访问 localStorage，跳过缓存检查:', error)
    }
    
    // 如果缓存存在且不超过24小时，使用缓存结果
    if (cachedGeoIP && cacheTime) {
      const cacheAge = Date.now() - parseInt(cacheTime)
      const maxCacheAge = 24 * 60 * 60 * 1000 // 24小时
      
      if (cacheAge < maxCacheAge) {
        try {
          const cachedData = JSON.parse(cachedGeoIP)
          const countryCode = cachedData.country_code
          if (countryCode && countryLanguageMap[countryCode]) {
            const detectedLanguage = countryLanguageMap[countryCode]
            console.log(`使用缓存的 GeoIP 数据: ${countryCode}, 语言: ${detectedLanguage}`)
            if (locale.value !== detectedLanguage) {
              locale.value = detectedLanguage
              console.log(`语言已更新为: ${detectedLanguage}`)
            }
            return
          }
        } catch (error) {
          console.warn('缓存数据解析失败，重新检测:', error)
        }
      }
    }
  }
  
  isGeoIPDetecting.value = true
  
  try {
    console.log('正在检测用户地理位置...')
    const response = await fetch('https://api.wolfx.jp/geoip.php')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('GeoIP 响应:', data)
    
    // 缓存检测结果
    try {
      localStorage.setItem('geoip_cache', JSON.stringify(data))
      localStorage.setItem('geoip_cache_time', Date.now().toString())
    } catch (error) {
      console.warn('无法保存到 localStorage:', error)
    }
    
    const countryCode = data.country_code
    if (countryCode && countryLanguageMap[countryCode]) {
      const detectedLanguage = countryLanguageMap[countryCode]
      console.log(`检测到国家/地区: ${countryCode}, 设置语言: ${detectedLanguage}`)
      
      // 只有在当前语言不是检测到的语言时才更新
      if (locale.value !== detectedLanguage) {
        locale.value = detectedLanguage
        console.log(`语言已更新为: ${detectedLanguage}`)
      }
    } else {
      console.log(`未识别的国家/地区代码: ${countryCode}, 使用默认英语`)
      if (locale.value !== 'en') {
        locale.value = 'en'
        console.log('语言已设置为默认英语')
      }
    }
  } catch (error) {
    console.error('GeoIP 检测失败:', error)
    // 检测失败时使用默认英语
    if (locale.value !== 'en') {
      locale.value = 'en'
      console.log('GeoIP 检测失败，使用默认英语')
    }
  } finally {
    isGeoIPDetecting.value = false
  }
}

// 生成URL (当前未使用)
// @ts-ignore
function generateURL(uuid?: string, customName?: string, isWaveMode?: boolean): string {
  // 获取 Vite 配置的 base 路径
  const basePath = import.meta.env.BASE_URL || '/'  
  
  let url = basePath  
  
  // 对于简单HTTP服务器，使用哈希模式避免404
  url += '#'
  
  // 确保URL格式正确
  if (uuid && uuid.trim()) {
    url += uuid.trim()
  }
  
  // 添加波形模式前缀
  if (isWaveMode) {
    url += '/wave'
  }
  
  // 添加自定义名称
  if (customName && customName.trim()) {
    url += `&${encodeURIComponent(customName.trim())}`
  }
  
  return url
}

// 监听自定义名称变化，更新 URL
// watch(customStationName, (newNames) => {
//   if (stationTypeFilter.value && stationTypeFilter.value.trim() && !stationDetailModal.value?.isVisible()) {
//     const currentUUID = stationTypeFilter.value.trim()
//     const customName = newNames[currentUUID]
//     
//     const newUrl = generateURL(currentUUID, customName, !showStationData.value)
//     window.history.pushState({}, '', newUrl)
//   }
// }, { deep: true, immediate: false })

// 保存显示设置到本地存储
const saveDisplaySettings = () => {
  localStorage.setItem('displaySettings', JSON.stringify(displaySettings.value))
}

// 检测当前是否为黑色背景模式
function isBlackBackground(): boolean {
  return backgroundType.value === 'black';
}

// 根据显示类型和值获取对应的样式
function getDisplayStyle(type: 'shindo' | 'intensity' | 'lpgm', value: string): CSSProperties {
  if (isBlackBackground()) {
    // 在黑色背景模式下，直接使用深色样式定义
    switch (type) {
      case 'shindo':
        // 深色JMA震度等级样式
        const darkShindoStyles: Record<string, CSSProperties> = {
          "7": { color: "#ffffff", backgroundColor: "#620083", borderColor: "#5a0097" },
          "6強": { color: "#ffffff", backgroundColor: "#8D0000", borderColor: "#ec398a" },
          "6弱": { color: "#ffffff", backgroundColor: "#FF0000", borderColor: "#ec4646" },
          "5強": { color: "#ffffff", backgroundColor: "#E27400", borderColor: "#ec8a39" },
          "5弱": { color: "#ffffff", backgroundColor: "#A38C00", borderColor: "#ecb339" },
          "4": { color: "#ffffff", backgroundColor: "#73A300", borderColor: "#ecdc39" },
          "3": { color: "#ffffff", backgroundColor: "#00A351", borderColor: "#39dc39" },
          "2": { color: "#ffffff", backgroundColor: "#007DB3", borderColor: "#39b3dc" },
          "1": { color: "#000000", backgroundColor: "#868686", borderColor: "#b3b3b3" },
          "0": { color: "#ffffff", backgroundColor: "#000000", borderColor: "#ececec" }
        };
        return darkShindoStyles[value] || darkShindoStyles["0"];
        
      case 'intensity':
        // 深色烈度等级样式
        const darkIntensityStyles: Record<string, CSSProperties> = {
          "12": { color: "#ffffff", backgroundColor: "#7400B3", borderColor: "#5a0097" },
          "11": { color: "#ffffff", backgroundColor: "#7D0084", borderColor: "#5a0097" },
          "10": { color: "#ffffff", backgroundColor: "#820099", borderColor: "#5a0097" },
          "9": { color: "#ffffff", backgroundColor: "#A00000", borderColor: "#5a0097" },
          "8": { color: "#ffffff", backgroundColor: "#B90000", borderColor: "#ec398a" },
          "7": { color: "#ffffff", backgroundColor: "#C27C01", borderColor: "#ec4646" },
          "6": { color: "#ffffff", backgroundColor: "#D6B628", borderColor: "#ec8a39" },
          "5": { color: "#ffffff", backgroundColor: "#27A456", borderColor: "#ecb339" },
          "4": { color: "#ffffff", backgroundColor: "#1B8443", borderColor: "#ecdc39" },
          "3": { color: "#ffffff", backgroundColor: "#3C70BE", borderColor: "#39dc39" },
          "2": { color: "#000000", backgroundColor: "#BBBBBB", borderColor: "#39b3dc" },
          "1": { color: "#ffffff", backgroundColor: "#868686", borderColor: "#b3b3b3" },
          "0": { color: "#ffffff", backgroundColor: "#000000", borderColor: "#ececec" }
        };
        return darkIntensityStyles[value] || darkIntensityStyles["0"];
        
      case 'lpgm':
        // 深色长周期地震动等级样式
        const darkLPGMStyles: Record<string, CSSProperties> = {
          "4": { color: "#ffffff", backgroundColor: "#90007D", borderColor: "#5a0097" },
          "3": { color: "#ffffff", backgroundColor: "#BB0000", borderColor: "#ec398a" },
          "2": { color: "#ffffff", backgroundColor: "#DC9A00", borderColor: "#ecdc39" },
          "1": { color: "#000000", backgroundColor: "#CDAB00", borderColor: "#39dc39" },
          "0": { color: "#ffffff", backgroundColor: "#000000", borderColor: "#ececec" }
        };
        return darkLPGMStyles[value] || darkLPGMStyles["0"];
        
      default:
        return {};
    }
  } else {
    // 非黑色背景模式下，使用常规样式
    switch (type) {
      case 'shindo':
        return getShindoStyle(value);
      case 'intensity':
        return getIntensityStyle(value);
      case 'lpgm':
        return getLPGMStyle(value);
      default:
        return {};
    }
  }
}

// 添加背景设置的响应式状态
const backgroundType = ref('wolfx'); // 默认使用Wolfx图床
const wolfxBackgroundUrl = ref(''); // 保存刷新后的Wolfx背景URL

// 保存背景设置到本地存储
function saveBackgroundSettings() {
  try {
    localStorage.setItem('backgroundType', backgroundType.value);
    // 应用背景设置
    applyBackgroundSettings();
  } catch (error: any) {
    console.error('Failed to save background settings:', error);
  }
}

// 应用背景设置
function applyBackgroundSettings() {
  const seismicContainer = document.querySelector('.seismic-container') as HTMLElement;
  if (seismicContainer) {
    // 移除所有背景相关的类和内联样式，确保新背景样式能正确应用
    seismicContainer.classList.remove('wolfx-background', 'white-background', 'green-black-background', 'black-background');
    
    // 清除可能的内联背景样式，防止与CSS类冲突
    seismicContainer.style.backgroundImage = '';
    seismicContainer.style.backgroundSize = '';
    seismicContainer.style.backgroundPosition = '';
    seismicContainer.style.backgroundRepeat = '';
    
    // 根据选择的背景类型添加对应的类
    if (backgroundType.value === 'white') {
      seismicContainer.classList.add('white-background');
    } else if (backgroundType.value === 'wolfx') {
      seismicContainer.classList.add('wolfx-background');
      // 如果有保存的刷新URL，使用它而不是CSS中的默认URL
      if (wolfxBackgroundUrl.value) {
        seismicContainer.style.backgroundImage = `url('${wolfxBackgroundUrl.value}')`;
        seismicContainer.style.backgroundSize = 'cover';
        seismicContainer.style.backgroundPosition = 'center';
        seismicContainer.style.backgroundRepeat = 'no-repeat';
      }
    } else if (backgroundType.value === 'green-black') {
      seismicContainer.classList.add('green-black-background');
    } else if (backgroundType.value === 'black') {
      seismicContainer.classList.add('black-background');
    }
  }
}

// 刷新背景（主要用于Wolfx图床背景）
function refreshBackground() {
  // 对Wolfx图床背景添加时间戳参数来刷新图片
  if (backgroundType.value === 'wolfx') {
    const timestamp = new Date().getTime();
    const newUrl = `https://api.wolfx.jp/img.php?t=${timestamp}`;
    // 保存刷新后的URL
    wolfxBackgroundUrl.value = newUrl;
    
    // 更新背景图片URL
    const seismicContainer = document.querySelector('.seismic-container') as HTMLElement;
    if (seismicContainer) {
      // 移除wolfx-background类和内联样式，防止冲突
      seismicContainer.classList.remove('wolfx-background');
      seismicContainer.style.backgroundImage = '';
      
      // 强制重绘
      void seismicContainer.offsetWidth;
      
      // 直接设置背景图片
      seismicContainer.style.backgroundImage = `url('${newUrl}')`;
      seismicContainer.style.backgroundSize = 'cover';
      seismicContainer.style.backgroundPosition = 'center';
      seismicContainer.style.backgroundRepeat = 'no-repeat';
      
      // 重新添加类
      seismicContainer.classList.add('wolfx-background');
    }
  } else {
    // 对于其他背景类型，直接重新应用背景设置
    applyBackgroundSettings();
  }
}

// 初始化时读取本地存储的显示设置
onMounted(() => {
  const savedSettings = localStorage.getItem('displaySettings')
  if (savedSettings) {
    displaySettings.value = JSON.parse(savedSettings)
  }
  
  // 从本地存储加载背景设置
  const savedBackgroundType = localStorage.getItem('backgroundType');
  if (savedBackgroundType) {
    backgroundType.value = savedBackgroundType;
  }
  
  // 应用背景设置
  applyBackgroundSettings();
})

function goToCreateStation() {
  window.open('https://wolfx.jp/seisjs', '_blank');
}

// 修改 showCards 数据属性名称
const showStationData = ref(true);
const showWarningModal = ref(false); // 控制警告弹窗显示

// 基于UUID的详情模态框监听逻辑
watch(seismicDataArray, (newData) => {
  if (pendingDetailUUID.value && newData.length > 0) {
    const stationData = newData.find(data => data.type === pendingDetailUUID.value)
    if (stationData) {
      // 找到对应的测站数据，显示详情模态框
      selectedStation.value = stationData
      stationDetailModal.value?.show()
      // 清除待显示的 UUID
      pendingDetailUUID.value = null
    }
  }
}, { deep: true, immediate: false })

// 添加一个变量来保存最后使用的UUID (当前未使用)
// @ts-ignore
const lastUUID = ref('');

// 移除自动保存的watch监听器，使用手动保存按钮
// watch(stationTypeFilter, (newValue) => {
//   if (newValue && newValue.trim()) {
//     lastUUID.value = newValue.trim();
//     localStorage.setItem('savedStationUUID', newValue.trim());
//   } else {
//     localStorage.removeItem('savedStationUUID');
//   }
// }, { immediate: true })

// 从本地存储加载自定义测站名称
const loadCustomStationName = (uuid: string) => {
  try {
    if (uuid && uuid.trim()) {
      const savedCustomName = localStorage.getItem(`customStationName_${uuid.trim()}`);
      if (savedCustomName && savedCustomName.trim()) {
        customStationName.value[uuid.trim()] = savedCustomName.trim();
        console.log('Custom station name loaded successfully for UUID:', uuid.trim());
      }
    }
  } catch (error) {
    console.warn('无法读取保存的自定义测站名称:', error);
  }
};

// 监听详情模态框可见性变化，更新URL
// watch(() => stationDetailModal.value?.isVisible() || false, (isVisible) => {
//   if (!isVisible) {
//     // 当模态框关闭时，移除URL中的UUID
//     const newUrl = generateURL(undefined, undefined, !showStationData.value);
//     window.history.pushState({}, '', newUrl);
//   } else if (lastUUID.value) {
//     // 当模态框打开时，确保stationTypeFilter正确
//     stationTypeFilter.value = lastUUID.value;
//   }
// }, { immediate: false })

// 语言变化时的 URL 更新
// watch(locale, () => {
//   const isDetailOpen = stationDetailModal.value?.isVisible() || false;
//   if (stationTypeFilter.value && stationTypeFilter.value.trim() && !isDetailOpen) {
//     const currentUUID = stationTypeFilter.value.trim()
//     const customName = customStationName.value[currentUUID]
//     
//     const newUrl = generateURL(currentUUID, customName, !showStationData.value)
//     window.history.pushState({}, '', newUrl)
//   } else {
//     // 如果没有测站过滤器或打开了详情，只更新基础URL
//     const newUrl = generateURL(undefined, undefined, !showStationData.value)
//     window.history.pushState({}, '', newUrl)
//   }
// }, { immediate: false })

// 监听波形模式变化，更新 URL
// watch(showStationData, (isDataMode) => {
//   if (stationTypeFilter.value && stationTypeFilter.value.trim()) {
//     const currentUUID = stationTypeFilter.value.trim()
//     const customName = customStationName.value[currentUUID]
//     
//     const newUrl = generateURL(currentUUID, customName, !isDataMode)
//     window.history.pushState({}, '', newUrl)
//   }
// }, { immediate: false })

// 修改 toggleCards 函数名称
const toggleStationData = () => {
  const dontShowAgain = localStorage.getItem('dontShowWaveformWarning') === 'true';

  if (showStationData.value) { // 如果当前显示的是详细数据，点击切换到波形图
    if (dontShowAgain) { // 如果用户勾选了不再提示，直接切换
      showStationData.value = !showStationData.value;
    } else { // 否则显示警告弹窗
      showWarningModal.value = true;
    }
  } else {
    showStationData.value = !showStationData.value; // 如果当前显示的是波形图，直接切换到详细数据
  }
};

// 处理警告弹窗同意
const handleWarningAgreed = (dontShowAgain: boolean) => { // 接收状态参数
  showWarningModal.value = false; // 隐藏警告弹窗
  if (dontShowAgain) { // 如果勾选了不再提示
    localStorage.setItem('dontShowWaveformWarning', 'true'); // 在本地存储中记录
  }
  showStationData.value = !showStationData.value; // 执行切换到波形图的逻辑
};

// 处理警告弹窗取消事件
const handleWarningCanceled = () => {
  showWarningModal.value = false; // 隐藏警告弹窗
};

// 组件挂载时读取本地存储的状态
onMounted(() => {
  const savedSetting = localStorage.getItem('dontShowWaveformWarning');
  if (savedSetting === 'true') {
    // 如果用户之前勾选了不再提示，则直接切换到波形图
    // 注意：这里不能直接修改 showStationData.value，因为此时图表可能还没有完全加载
    // 更好的方法是在需要显示波形图时检查这个状态
  }
  initWebSocket();
  console.log('初始数据:', seismicDataArray.value);
});
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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
}

.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 440px));
  gap: 1.5rem;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
  margin-bottom: 4rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
}

.seismic-card {
  position: relative;
  padding-bottom: 3rem;
  padding: 1.5rem;
  border-radius: 2.5rem;
  background: var(--card-bg);
  box-shadow: 0 4px 6px rgba(167, 167, 167, 0.61);
  transition: all 0.35s ease;
  min-width: 400px;
  max-width: 550px;
  min-height: auto;
  margin: 0 auto;

  // 在黑色背景模式下，设置卡片背景为#1C1C1C
  .black-background .seismic-card {
    background: #1C1C1C;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.61);
  }

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
    margin-bottom: 1rem;

    .region {
      font-size: 1.75rem;
      margin: 0;
      color: var(--text-color);
      transition: color 0.3s ease;

      /* 使文本不换行 */
      white-space: nowrap;
      /* 取消换行 */
      overflow: hidden;
      /* 隐藏溢出文本 */
      text-overflow: ellipsis;
      /* 溢出文本显示省略号 */

      @media (max-width: 768px) {
        font-size: 1.5rem;
        /* 在小屏幕上缩小字体 */
      }

      @media (max-width: 480px) {
        font-size: 1.2rem;
        /* 在更小屏幕上进一步缩小字体 */
      }
    }

    .update-time {
      font-size: 0.9rem;
      opacity: 0.8;
      color: var(--text-secondary);
      transition: color 0.3s ease;
    }
  }

  .data-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    margin-bottom: 1rem;
    width: 100%;

    &:empty {
      display: none;
    }

    // 当只有一个子元素时
    &:has(> :only-child) {
      grid-template-columns: 1fr;

      >div {
        grid-column: 1 / -1;
        max-width: none;
        width: 100%;
      }
    }

    // 当有两个子元素时
    &:has(> :nth-child(2):last-child) {
      grid-template-columns: repeat(2, 1fr);

      >div {
        width: 100%;
      }
    }

    // 当single-item类被添加时
    &.single-item {
      grid-template-columns: 1fr;
      justify-content: flex-end;
      
      >div {
        grid-column: 1 / -1;
        max-width: none;
        width: 100%;
        justify-self: end;
      }
    }

    // 当double-items类被添加时
    &.double-items {
      grid-template-columns: repeat(2, 1fr);
      
      >div {
        width: 100%;
      }
    }

    .shindo-display,
    .intensity-display,
    .LPGM-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.2rem 0.75rem;
      border-radius: 1.52rem;
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.178);
      transition: all 0.3s ease;
      min-height: 120px;
      width: 100%;
      overflow: hidden;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.292);
        background: rgba(255, 255, 255, 0.08);
      }

      .shindo-label,
      .intensity-label,
      .LPGM-label {
        font-size: 0.75rem;
        margin-bottom: 0.7rem;
        opacity: 0.8;
        text-align: center;
        min-height: 2.4em;
        display: flex;
        align-items: center;
        justify-content: center;

        width: auto;
        line-height: 1.2;
        padding: 0 0.3rem;

        // 处理长文本
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
      }

      .shindo-value,
      .intensity-value,
      .LPGM-value {
        font-size: 2.2rem;
        font-weight: bold;
        white-space: nowrap;
        line-height: 1.2;
      }
    }

    @media (max-width: 768px) {
      gap: 0.6rem;

      .shindo-display,
      .intensity-display,
      .LPGM-display {
        padding: 0.9rem 0.01rem;
        min-width: 100px;

        .shindo-label,
        .intensity-label,
        .LPGM-label {
          font-size: 0.7rem;
        }

        .shindo-value,
        .intensity-value,
        .LPGM-value {
          font-size: 2.8rem;
        }
      }
    }

    .data-box-grid {
      grid-column: span 3;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      width: 100%;
      margin-top: 0.5rem;
      padding: 0 0.5rem;

      .data-box {
        min-height: 30px;
        box-shadow: 0 2px 8px rgba(134, 134, 134, 0.287);
        border-radius: 1.2rem;
        justify-content: center;
        padding: 0.5rem 1.3rem;

        .data-box-content {
          .label-text {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: var(--text-color);
            opacity: 0.8;
            font-size: 0.9rem;
            margin: 0;
            width: 100%;
            min-height: 2.4em;
            line-height: 1.2;

            .icon {
              font-size: 1rem;
              flex-shrink: 0;
            }

            span {
              white-space: normal;
              text-align: left;
              display: -webkit-box;
              line-clamp: 2;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }

          h4 {
            margin: 0;
            color: var(--text-color);
            font-size: 1.2rem;
            font-weight: bold;
            width: 100%;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .card-footer {
    position: absolute;
    bottom: 0;
    left: 1;
    right: 0;
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

/* 主题切换按钮已移除 */
/* .theme-toggle {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to,
/* .fade-leave-active in <2.1.8 */
.fade-leave-active {
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
        padding: 0.8rem 0.8rem;
        font-size: 0.8rem;
      }
    }
  }
}

.dark {
  .seismic-card {
    .detail-btn {
      background: rgba(255, 255, 255, 0);

    }
  }
  
  .settings-content {
    .filter-section,
    .websocket-section {
      .save-btn,
      .discard-btn,
      .reset-btn {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
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

    h4,
    .icon {
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

.wave-icon {
  position: fixed;
  top: 2rem;
  right: 7rem;
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
  right: -700px;
  width: 700px;
  height: 100vh;
  background: rgba(var(--card-bg-rgb), 0.5);
  backdrop-filter: blur(120px) saturate(180%);
  -webkit-backdrop-filter: blur(120px) saturate(180%);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  text-align: left;

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

            &:checked+.slider {
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
    .websocket-section,
    .language-section {
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

      .geoip-section {
        margin-top: 1rem;
        
        .geoip-refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;

          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.2);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .spinning {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        }
      }
    }

    .filter-section,
    .websocket-section {
      .input-wrapper {
        position: relative;
        width: 100%;

        input {
          width: 100%;
          padding: 0.8rem 2rem 0.8rem 1rem;
          border: 2.5px solid rgba(224, 224, 224, 0.1);
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
      
      .websocket-control {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        
        button {
          padding: 1rem 1rem;
          border: none;
          border-radius: 0.8rem;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          white-space: nowrap;
          
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        }
        .save-btn,
        .discard-btn,
        .reset-btn {
          padding: 1rem;
          border: none;
          border-radius: 0.8rem;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          
          .iconify {
            width: 1.2rem;
            height: 1.2rem;
          }
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
        padding-left: 0;
        margin-left: 0;
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

            &:checked+.slider {
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

    .RT-display-section,
    .display-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      label {
        display: block;
        color: var(--text-color);
        font-weight: 500;
        text-align: left;
        padding-left: 0;
        margin-left: 0;
        word-wrap: break-word;
      }

      .display-options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .RT-display-option,
        .display-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;

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

              &:checked+.slider {
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

          .option-text {
            color: var(--text-color);
            font-size: 0.9rem;
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

.controls-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.main-toggle {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background-color: #ffffff;
  color: #333;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.main-toggle .iconify {
  width: 32px;
  height: 32px;
}

.dark .main-toggle {
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
}


.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.control-buttons.expanded {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.settings-toggle, .wave-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  color: #333;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
}

/* 深色模式相关样式已移除 */
/* .dark .theme-toggle, .dark .settings-toggle, .dark .wave-icon {
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
}

/* 具体图标的样式 */
.icon {
  color: var(--text-color);
  transition: color 0.3s ease;
}

.no-station-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #bbb;
  font-size: 1.3rem;
  opacity: 0.8;

  .hint-text {
    margin-top: 0.5rem;
  }
}

/* 添加简洁数据网格样式 */
.simplified-data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: center;

  .simplified-data-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 0.3rem;
    }

    .value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--text-color);
    }
  }

  @media (max-width: 768px) {
    gap: 0.5rem;

    .simplified-data-item {
      .label {
        font-size: 0.8rem;
      }

      .value {
        font-size: 1.2rem;
      }
    }
  }
}

/* API提醒模态框样式 */
.api-warning-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.api-warning-content {
  background: var(--bg-color);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
}

.api-warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.771);
  padding: 1.5rem;
  border-bottom: 1px solid rgba(141, 141, 141, 0.53);
}

.api-warning-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.3rem;
}

.api-warning-body {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.851);
}

.api-warning-body p {
  margin: 0 0 1.5rem 0;
  color: var(--text-color);
  line-height: 1.6;
}

.api-warning-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.api-warning-buttons button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.confirm-btn {
  background: #2196F3;
  color: white;
}

.confirm-btn:hover {
  background: #1976D2;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>