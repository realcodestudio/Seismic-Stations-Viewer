<template>
  <div v-if="show" class="station-modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ currentData?.region || $t('station_details') }}</h2>
        <button class="close-btn" @click="closeModal">
          <Icon icon="mdi:close" />
        </button>
      </div>

      <div class="modal-body" v-if="currentData">
        <!-- 复制成功提示 -->
        <div v-if="showCopyToast" class="copy-toast">
          <Icon icon="mdi:check-circle" class="toast-icon" />
          <span>{{ $t('uuid_copied') }}</span>
        </div>
        
        <div class="panels-container">
          <!-- 基本信息面板 -->
          <div class="panel">
            <div class="panel-header">
              <Icon icon="mdi:information-outline" class="panel-icon" />
              <h3>{{ $t('basic_info') }}</h3>
            </div>
            <div class="panel-content">
              <div class="data-grid">
                <div 
                  v-for="item in basicInfo" 
                  :key="item.key" 
                  class="data-item"
                  :class="{ 'clickable': item.key === 'type' }"
                  @click="item.key === 'type' && typeof item.value === 'string' ? (console.log('点击了 UUID 项:', item), copyUUID(item.value)) : null"
                >
                  <div class="item-icon">
                    <Icon :icon="getIconForKey(item.key)" />
                  </div>
                  <div class="item-content">
                    <span class="label">{{ item.label }}:</span>
                    <span class="value">{{ formatValue(item.value, item.key) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前地震参数面板 -->
          <div class="panel">
            <div class="panel-header">
              <Icon icon="mdi:waveform" class="panel-icon" />
              <h3>{{ $t('current_parameters') }}</h3>
            </div>
            <div class="panel-content">
              <div class="data-grid">
                <div v-for="item in currentParameters" :key="item.key" class="data-item">
                  <div class="item-icon">
                    <Icon :icon="getIconForKey(item.key)" />
                  </div>
                  <div class="item-content">
                    <span class="label">{{ item.label }}:</span>
                    <span class="value">{{ formatValue(item.value, item.key) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最大值记录面板 -->
          <div class="panel">
            <div class="panel-header">
              <Icon icon="mdi:trending-up" class="panel-icon" />
              <h3>{{ $t('maximum_records') }}</h3>
            </div>
            <div class="panel-content">
              <div class="data-grid">
                <div v-for="item in maximumRecords" :key="item.key" class="data-item">
                  <div class="item-icon">
                    <Icon :icon="getIconForKey(item.key)" />
                  </div>
                  <div class="item-content">
                    <span class="label">{{ item.label }}:</span>
                    <span class="value">{{ formatValue(item.value, item.key) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 方向分量面板 -->
          <div class="panel">
            <div class="panel-header">
              <Icon icon="mdi:compass" class="panel-icon" />
              <h3>{{ $t('directional_components') }}</h3>
              <button class="toggle-btn" @click="toggleDirectionalComponents">
                <Icon :icon="showDirectionalComponents ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
              </button>
            </div>
            <div class="panel-content" v-show="showDirectionalComponents" style="transition: all 0.3s ease;">
              <!-- 当前 PGA 分量 -->
              <div v-if="directionalComponents.currentPGA.length > 0" class="component-group">
                <h4 class="group-title">{{ $t('current_pga_components') }}</h4>
                <div class="data-grid">
                  <div v-for="item in directionalComponents.currentPGA" :key="item.key" class="data-item">
                    <div class="item-icon">
                      <Icon :icon="getIconForKey(item.key)" />
                    </div>
                    <div class="item-content">
                      <span class="label">{{ item.label }}:</span>
                      <span class="value">{{ formatValue(item.value, item.key) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 当前 PGV 分量 -->
              <div v-if="directionalComponents.currentPGV.length > 0" class="component-group">
                <h4 class="group-title">{{ $t('current_pgv_components') }}</h4>
                <div class="data-grid">
                  <div v-for="item in directionalComponents.currentPGV" :key="item.key" class="data-item">
                    <div class="item-icon">
                      <Icon :icon="getIconForKey(item.key)" />
                    </div>
                    <div class="item-content">
                      <span class="label">{{ item.label }}:</span>
                      <span class="value">{{ formatValue(item.value, item.key) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 当前 PGD 分量 -->
              <div v-if="directionalComponents.currentPGD.length > 0" class="component-group">
                <h4 class="group-title">{{ $t('current_pgd_components') }}</h4>
                <div class="data-grid">
                  <div v-for="item in directionalComponents.currentPGD" :key="item.key" class="data-item">
                    <div class="item-icon">
                      <Icon :icon="getIconForKey(item.key)" />
                    </div>
                    <div class="item-content">
                      <span class="label">{{ item.label }}:</span>
                      <span class="value">{{ formatValue(item.value, item.key) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 最大 PGA 分量 -->
              <div v-if="directionalComponents.maxPGA.length > 0" class="component-group">
                <h4 class="group-title">{{ $t('max_pga_components') }}</h4>
                <div class="data-grid">
                  <div v-for="item in directionalComponents.maxPGA" :key="item.key" class="data-item">
                    <div class="item-icon">
                      <Icon :icon="getIconForKey(item.key)" />
                    </div>
                    <div class="item-content">
                      <span class="label">{{ item.label }}:</span>
                      <span class="value">{{ formatValue(item.value, item.key) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 最大 PGV 分量 -->
              <div v-if="directionalComponents.maxPGV.length > 0" class="component-group">
                <h4 class="group-title">{{ $t('max_pgv_components') }}</h4>
                <div class="data-grid">
                  <div v-for="item in directionalComponents.maxPGV" :key="item.key" class="data-item">
                    <div class="item-icon">
                      <Icon :icon="getIconForKey(item.key)" />
                    </div>
                    <div class="item-content">
                      <span class="label">{{ item.label }}:</span>
                      <span class="value">{{ formatValue(item.value, item.key) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 最大 PGD 分量 -->
              <div v-if="directionalComponents.maxPGD.length > 0" class="component-group">
                <h4 class="group-title">{{ $t('max_pgd_components') }}</h4>
        <div class="data-grid">
                  <div v-for="item in directionalComponents.maxPGD" :key="item.key" class="data-item">
            <div class="item-icon">
                      <Icon :icon="getIconForKey(item.key)" />
                    </div>
                    <div class="item-content">
                      <span class="label">{{ item.label }}:</span>
                      <span class="value">{{ formatValue(item.value, item.key) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 系统状态面板 -->
          <div class="panel">
            <div class="panel-header">
              <Icon icon="mdi:cog" class="panel-icon" />
            <h3>{{ $t('system_status') }}</h3>
            </div>
            <div class="panel-content">
              <div class="data-grid">
                <div v-for="item in systemStatus" :key="item.key" class="data-item">
                  <div class="item-icon">
                    <Icon :icon="getIconForKey(item.key)" />
            </div>
            <div class="item-content">
                    <span class="label">{{ item.label }}:</span>
                    <span class="value">{{ formatValue(item.value, item.key) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import { useSeismicStore } from '../stores/seismic'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  stationType: string | null
}>()

const show = ref(false)
const showDirectionalComponents = ref(false) // 控制方向分量面板的展开/折叠
const showCopyToast = ref(false) // 控制复制提示的显示
const seismicStore = useSeismicStore()
const { seismicDataMap } = storeToRefs(seismicStore)

// 使用 watchEffect 来实时获取最新数据
const currentData = computed(() => {
  if (!props.stationType) return null
  return seismicDataMap.value.get(props.stationType)
})

// 数据分类处理
const basicInfo = computed(() => {
  if (!currentData.value) return []
  const data = currentData.value
  console.log('当前数据:', data) // 调试信息
  const result = [
    { key: 'region', label: formatLabel('region'), value: data.region },
    { key: 'latitude', label: formatLabel('latitude'), value: data.latitude },
    { key: 'longitude', label: formatLabel('longitude'), value: data.longitude },
    { key: 'type', label: formatLabel('type'), value: data.type }
  ].filter(item => item.value !== undefined && item.value !== null)
  console.log('基本信息:', result) // 调试信息
  return result
})

const currentParameters = computed(() => {
  if (!currentData.value) return []
  const data = currentData.value
  return [
    { key: 'PGA', label: formatLabel('PGA'), value: data.PGA },
    { key: 'PGV', label: formatLabel('PGV'), value: data.PGV },
    { key: 'PGD', label: formatLabel('PGD'), value: data.PGD },
    { key: 'Shindo', label: formatLabel('Shindo'), value: data.Shindo },
    { key: 'CalcShindo', label: formatLabel('CalcShindo'), value: data.CalcShindo },
    { key: 'Intensity', label: formatLabel('Intensity'), value: data.Intensity },
    { key: 'LPGM', label: formatLabel('LPGM'), value: data.LPGM },
    { key: 'Sva30', label: formatLabel('Sva30'), value: data.Sva30 }
  ].filter(item => item.value !== undefined && item.value !== null)
})

const maximumRecords = computed(() => {
  if (!currentData.value) return []
  const data = currentData.value
  return [
    { key: 'Max_PGA', label: formatLabel('Max_PGA'), value: data.Max_PGA },
    { key: 'Max_PGV', label: formatLabel('Max_PGV'), value: data.Max_PGV },
    { key: 'Max_PGD', label: formatLabel('Max_PGD'), value: data.Max_PGD },
    { key: 'Max_Shindo', label: formatLabel('Max_Shindo'), value: data.Max_Shindo },
    { key: 'Max_CalcShindo', label: formatLabel('Max_CalcShindo'), value: data.Max_CalcShindo },
    { key: 'Max_Intensity', label: formatLabel('Max_Intensity'), value: data.Max_Intensity },
    { key: 'Max_LPGM', label: formatLabel('Max_LPGM'), value: data.Max_LPGM },
    { key: 'Max_Sva30', label: formatLabel('Max_Sva30'), value: data.Max_Sva30 }
  ].filter(item => item.value !== undefined && item.value !== null)
})

const directionalComponents = computed(() => {
  if (!currentData.value) return {
    currentPGA: [],
    currentPGV: [],
    currentPGD: [],
    maxPGA: [],
    maxPGV: [],
    maxPGD: []
  }
  const data = currentData.value
  
  // 当前值分组
  const currentPGA = [
    { key: 'PGA_EW', label: formatLabel('PGA_EW'), value: data.PGA_EW },
    { key: 'PGA_NS', label: formatLabel('PGA_NS'), value: data.PGA_NS },
    { key: 'PGA_UD', label: formatLabel('PGA_UD'), value: data.PGA_UD }
  ].filter(item => item.value !== undefined && item.value !== null)

  const currentPGV = [
    { key: 'PGV_EW', label: formatLabel('PGV_EW'), value: data.PGV_EW },
    { key: 'PGV_NS', label: formatLabel('PGV_NS'), value: data.PGV_NS },
    { key: 'PGV_UD', label: formatLabel('PGV_UD'), value: data.PGV_UD }
  ].filter(item => item.value !== undefined && item.value !== null)

  const currentPGD = [
    { key: 'PGD_EW', label: formatLabel('PGD_EW'), value: data.PGD_EW },
    { key: 'PGD_NS', label: formatLabel('PGD_NS'), value: data.PGD_NS },
    { key: 'PGD_UD', label: formatLabel('PGD_UD'), value: data.PGD_UD }
  ].filter(item => item.value !== undefined && item.value !== null)

  // 最大值分组
  const maxPGA = [
    { key: 'Max_PGA_EW', label: formatLabel('Max_PGA_EW'), value: data.Max_PGA_EW },
    { key: 'Max_PGA_NS', label: formatLabel('Max_PGA_NS'), value: data.Max_PGA_NS },
    { key: 'Max_PGA_UD', label: formatLabel('Max_PGA_UD'), value: data.Max_PGA_UD }
  ].filter(item => item.value !== undefined && item.value !== null)

  const maxPGV = [
    { key: 'Max_PGV_EW', label: formatLabel('Max_PGV_EW'), value: data.Max_PGV_EW },
    { key: 'Max_PGV_NS', label: formatLabel('Max_PGV_NS'), value: data.Max_PGV_NS },
    { key: 'Max_PGV_UD', label: formatLabel('Max_PGV_UD'), value: data.Max_PGV_UD }
  ].filter(item => item.value !== undefined && item.value !== null)

  const maxPGD = [
    { key: 'Max_PGD_EW', label: formatLabel('Max_PGD_EW'), value: data.Max_PGD_EW },
    { key: 'Max_PGD_NS', label: formatLabel('Max_PGD_NS'), value: data.Max_PGD_NS },
    { key: 'Max_PGD_UD', label: formatLabel('Max_PGD_UD'), value: data.Max_PGD_UD }
  ].filter(item => item.value !== undefined && item.value !== null)

  return {
    currentPGA,
    currentPGV,
    currentPGD,
    maxPGA,
    maxPGV,
    maxPGD
  }
})

const systemStatus = computed(() => {
  if (!currentData.value) return []
  const data = currentData.value
  return [
    { key: 'is_desktop', label: formatLabel('is_desktop'), value: data.is_desktop },
    { key: 'High_Precision', label: formatLabel('High_Precision'), value: data.High_Precision },
    { key: 'error_code', label: formatLabel('error_code'), value: data.error_code },
    { key: 'version', label: formatLabel('version'), value: data.version },
    { key: 'create_at', label: formatLabel('create_at'), value: data.create_at },
    { key: 'update_at', label: formatLabel('update_at'), value: data.update_at }
  ].filter(item => item.value !== undefined && item.value !== null)
})

// 格式化标签名
function formatLabel(key: string): string {
  const labelMap: Record<string, string> = {
    type: t('type'),
    region: t('region'),
    latitude: t('latitude'),
    longitude: t('longitude'),
    version: t('version'),
    PGA: t('PGA'),
    PGV: t('PGV'),
    PGD: t('PGD'),
    PGA_EW: t('PGA_EW'),
    PGV_EW: t('PGV_EW'),
    PGD_EW: t('PGD_EW'),
    PGA_NS: t('PGA_NS'),
    PGV_NS: t('PGV_NS'),
    PGD_NS: t('PGD_NS'),
    PGA_UD: t('PGA_UD'),
    PGV_UD: t('PGV_UD'),
    PGD_UD: t('PGD_UD'),
    Max_PGA: t('Max_PGA'),
    Max_PGV: t('Max_PGV'),
    Max_PGD: t('Max_PGD'),
    Max_PGA_EW: t('Max_PGA_EW'),
    Max_PGV_EW: t('Max_PGV_EW'),
    Max_PGD_EW: t('Max_PGD_EW'),
    Max_PGA_NS: t('Max_PGA_NS'),
    Max_PGV_NS: t('Max_PGV_NS'),
    Max_PGD_NS: t('Max_PGD_NS'),
    Max_PGA_UD: t('Max_PGA_UD'),
    Max_PGV_UD: t('Max_PGV_UD'),
    Max_PGD_UD: t('Max_PGD_UD'),
    Shindo: t('Shindo'),
    Max_Shindo: t('Max_Shindo'),
    CalcShindo: t('CalcShindo'),
    Max_CalcShindo: t('Max_CalcShindo'),
    Intensity: t('Intensity'),
    Max_Intensity: t('Max_Intensity'),
    LPGM: t('LPGM'),
    Max_LPGM: t('Max_LPGM'),
    Sva30: t('Sva30'),
    Max_Sva30: t('Max_Sva30'),
    is_desktop: t('is_desktop'),
    High_Precision: t('High_Precision'),
    error_code: t('error_code'),
    update_at: t('update_at'),
    create_at: t('create_at')
  }

  return labelMap[key] || key
}

// 格式化数值
function formatValue(value: any, key: string): string {
  if (value === null || value === undefined) return '-'

  if (typeof value === 'number') {
    if (key === 'latitude' || key === 'longitude') {
      return value.toFixed(1)
    } else if (key === 'CalcShindo' || key === 'Max_Shindo' || key === 'Max_CalcShindo' || key === 'Intensity' || key === 'Max_Intensity') {
      return value.toFixed(2)
    } else if (key === 'version' || key === 'LPGM' || key === 'Max_LPGM') {
      return value.toFixed(0)
    }
    // 其他数值保留6位小数
    return value.toFixed(6)
  }

  if (typeof value === 'boolean') {
    return value ? t('yes') : t('no')
  }

  if (typeof value === 'string' && (value.includes('at') || value.includes('time'))) {
    try {
      const date = new Date(value)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return value
    }
  }

  return String(value)
}

// 根据数据项的 key 返回对应的图标名称
function getIconForKey(key: string): string {
  const iconMap: Record<string, string> = {
    type: 'mdi:tag',
    region: 'mdi:map-marker',
    latitude: 'mdi:latitude',
    longitude: 'mdi:longitude',
    version: 'mdi:numeric',
    PGA: 'mdi:waveform',
    PGV: 'mdi:waveform',
    PGD: 'mdi:waveform',
    PGA_EW: 'mdi:waveform',
    PGV_EW: 'mdi:waveform',
    PGD_EW: 'mdi:waveform',
    PGA_NS: 'mdi:waveform',
    PGV_NS: 'mdi:waveform',
    PGD_NS: 'mdi:waveform',
    PGA_UD: 'mdi:waveform',
    PGV_UD: 'mdi:waveform',
    PGD_UD: 'mdi:waveform',
    Max_PGA: 'mdi:trending-up',
    Max_PGV: 'mdi:trending-up',
    Max_PGD: 'mdi:trending-up',
    Max_PGA_EW: 'mdi:trending-up',
    Max_PGV_EW: 'mdi:trending-up',
    Max_PGD_EW: 'mdi:trending-up',
    Max_PGA_NS: 'mdi:trending-up',
    Max_PGV_NS: 'mdi:trending-up',
    Max_PGD_NS: 'mdi:trending-up',
    Max_PGA_UD: 'mdi:trending-up',
    Max_PGV_UD: 'mdi:trending-up',
    Max_PGD_UD: 'mdi:trending-up',
    Shindo: 'mdi:alert',
    Max_Shindo: 'mdi:alert',
    CalcShindo: 'mdi:calculator',
    Max_CalcShindo: 'mdi:calculator',
    Intensity: 'mdi:alert',
    Max_Intensity: 'mdi:alert',
    LPGM: 'mdi:pulse',
    Max_LPGM: 'mdi:pulse',
    Sva30: 'mdi:chart-line',
    Max_Sva30: 'mdi:chart-line',
    is_desktop: 'mdi:desktop-classic',
    High_Precision: 'mdi:crosshairs-gps',
    error_code: 'mdi:alert',
    update_at: 'mdi:update',
    create_at: 'mdi:plus-circle-outline'
  };
  return iconMap[key] || 'mdi:information-outline'; // 默认图标
}

// 监听数据变化
watchEffect(() => {
  if (show.value && props.stationType) {
    // 强制更新视图
    currentData.value
  }
})

const closeModal = () => {
  show.value = false
  
  // 移除 URL 中的 /detail 后缀
  const path = window.location.pathname
  if (path.endsWith('/detail')) {
    const newUrl = path.substring(0, path.length - 7) // 移除 /detail
    window.history.pushState({}, '', newUrl)
  }
}

// 切换方向分量面板的展开/折叠
const toggleDirectionalComponents = () => {
  showDirectionalComponents.value = !showDirectionalComponents.value
}

// 复制 UUID 到剪贴板
const copyUUID = async (uuid: string) => {
  console.log('正在复制 UUID:', uuid) // 调试信息
  try {
    await navigator.clipboard.writeText(uuid)
    console.log('UUID 复制成功') // 调试信息
    showCopyToast.value = true
    // 3秒后自动隐藏提示
    setTimeout(() => {
      showCopyToast.value = false
    }, 3000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 添加显式的 show 方法
function showModal() {
  show.value = true
}

// 修改 defineExpose，暴露 showModal 方法
defineExpose({ show: showModal })
</script>

<style scoped lang="scss">
.station-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.289);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(20px);

  // 夜间模式背景
  :global(html.dark) & {
    background: rgba(0, 0, 0, 0.6);
  }

  .modal-content {
    background: var(--card-bg);
    border-radius: 1.5rem;
    max-width: 1200px;
    width: 95%;
    max-height: 95vh;
    overflow-y: auto;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

    .modal-header {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.2rem 1.8rem;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
      backdrop-filter: blur(40px) saturate(180%);
      -webkit-backdrop-filter: blur(40px) saturate(180%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      z-index: 1;

      h2 {
        margin: 0;
        color: var(--text-color);
        font-size: 1.8rem;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.8rem;
        cursor: pointer;
        color: var(--text-color);
        padding: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }

    .modal-body {
      padding: 1.8rem;
      position: relative; // 为提示框定位

      // 复制成功提示样式
      .copy-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(34, 197, 94, 0.9);
        color: white;
        padding: 0.8rem 1.2rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;

        .toast-icon {
          font-size: 1.2rem;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      }

      .panels-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .panel {
          background: var(--card-item-bg, rgba(255, 255, 255, 0.8));
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(68, 68, 68, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          }

                      .panel-header {
              display: flex;
              align-items: center;
              padding: 1rem 1.5rem;
              background: linear-gradient(135deg, rgba(228, 52, 149, 0.362), rgba(81, 129, 239, 0.395));
              border-bottom: 1px solid rgba(0, 0, 0, 0.05);

              .panel-icon {
                font-size: 1.5rem;
                color: #3b82f6;
                margin-right: 0.8rem;
              }

              h3 {
                margin: 0;
                color: var(--text-color);
                font-size: 1.2rem;
                font-weight: 600;
                flex-grow: 1;
                text-align: left; // 确保标题文字左对齐
              }

              .toggle-btn {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: var(--text-color);
                padding: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;

                &:hover {
                  background: rgba(255, 255, 255, 0.1);
                  transform: scale(1.1);
                }

                :global(html.dark) & {
                  &:hover {
                    background: rgba(255, 255, 255, 0.1);
                  }
                }
              }
            }

                      .panel-content {
              padding: 1.5rem;

              .component-group {
                margin-bottom: 2rem;

                &:last-child {
                  margin-bottom: 0;
                }

                .group-title {
                  margin: 0 0 1rem 0;
                  font-size: 1rem;
                  font-weight: 600;
                  color: var(--text-color);
                  opacity: 0.8;
                  padding-bottom: 0.5rem;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

                  :global(html.dark) & {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                  }
                }
              }

      .data-grid {
        display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 1rem;
                align-items: start; // 确保卡片顶部对齐

        .data-item {
                  display: flex;
                  align-items: flex-start; // 改为顶部对齐，适应多行内容
                  padding: 1rem 1.2rem;
                  background: rgba(0, 0, 0, 0.057);
                  border-radius: 0.8rem;
                  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease-in-out;
                  min-height: 60px; // 设置最小高度，确保一致性

                  // 可点击的数据项样式
                  &.clickable {
                    cursor: pointer;
                    position: relative;

                    &::after {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
                      border-radius: 0.8rem;
                      opacity: 0;
                      transition: opacity 0.2s ease;
                    }

                    &:hover {
                      &::after {
                        opacity: 1;
                      }

                      .item-icon {
                        color: #3b82f6;
                      }
                    }

                    &:active {
                      transform: scale(0.98);
                    }
                  }

                  &:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    background: rgba(255, 255, 255, 0.266);
                  }

                  // 夜间模式数据卡片样式
                  :global(html.dark) & {
                    background: rgba(60, 60, 60, 0.8);
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

          &:hover {
                      background: rgba(70, 70, 70, 0.9);
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    }

                    .item-content {
                      .label {
                        color: rgba(255, 255, 255, 0.7);
                      }

                      .value {
                        color: rgba(255, 255, 255, 0.95);
                      }
                    }

                    .item-icon {
                      color: rgba(255, 255, 255, 0.6);
                    }
          }

          .item-icon {
                  flex-shrink: 0;
                  font-size: 1.5rem;
                  margin-right: 1rem;
                  color: var(--text-secondary);
          }

          .item-content {
                  flex-grow: 1;
                  min-width: 0; // 防止内容溢出

            .label {
              display: block;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
              margin-bottom: 0.2rem;
                    opacity: 0.8;
                    white-space: nowrap; // 防止标签换行
                    overflow: hidden;
                    text-overflow: ellipsis;
            }

            .value {
              display: block;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-color);
                    word-break: break-word; // 改为 break-word，更优雅的换行
                    line-height: 1.3; // 增加行高，提高可读性
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

// 夜间模式适配样式
:global(html.dark) .station-modal .modal-content {
  --card-item-bg: rgba(30, 30, 30, 0.9);
  --text-secondary: rgba(255, 255, 255, 0.176);

  .panel {
    background: rgba(40, 40, 40, 0.8);
    
    .panel-header {
      background: linear-gradient(135deg, rgba(59, 131, 246, 0.319), rgb(132, 0, 255));
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header {
      background: linear-gradient(135deg, rgba(17, 108, 255, 0.351), rgba(146, 51, 234, 0.322));
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .panel-content {
      // 数据卡片样式已在上面单独定义，这里不需要重复
    }
  }
}

@media (max-width: 768px) {
  .station-modal {
    .modal-content {
      width: 98%;

      .modal-header {
        padding: 1rem 1.2rem;

        h2 {
          font-size: 1.5rem;
        }

        .close-btn {
          font-size: 1.5rem;
          padding: 0.6rem;
        }
      }

      .modal-body {
        padding: 1.2rem;

        .panels-container {
          gap: 1rem;

          .panel {
            .panel-header {
              padding: 0.8rem 1.2rem;

              .panel-icon {
                font-size: 1.3rem;
                margin-right: 0.6rem;
              }

              h3 {
                font-size: 1.1rem;
              }
            }

            .panel-content {
              padding: 1.2rem;

              .data-grid {
                grid-template-columns: 1fr;
                gap: 0.8rem;

          .data-item {
            padding: 0.8rem 1rem;

            .item-icon {
                    font-size: 1.3rem;
              margin-right: 0.8rem;
            }

            .item-content {
              .label {
                font-size: 0.8rem;
              }

              .value {
                      font-size: 1rem;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
