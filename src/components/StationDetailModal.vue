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
        <div class="data-grid">
          <div v-for="(value, key) in processedData" :key="key" class="data-item">
            <div class="item-icon">
              <!-- Icon will go here -->
              <Icon :icon="getIconForKey(key)" /> <!-- 使用 getIconForKey 函数获取图标 -->
            </div>
            <div class="item-content">
              <span class="label">{{ formatLabel(key) }}:</span>
              <span class="value">{{ formatValue(value, key) }}</span>
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
const seismicStore = useSeismicStore()
const { seismicDataMap } = storeToRefs(seismicStore)

// 使用 watchEffect 来实时获取最新数据
const currentData = computed(() => {
  if (!props.stationType) return null
  return seismicDataMap.value.get(props.stationType)
})

// 处理展示数据
const processedData = computed(() => {
  if (!currentData.value) return {}

  const data = { ...currentData.value }
  return Object.entries(data)
    .filter(([key]) => key !== 'pgaHistory')
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, any>)
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
    create_at: t('create_at'),
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
    create_at: 'mdi:plus-circle-outline',
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

  .modal-content {
    background: var(--card-bg); // 使用变量适配夜间模式
    border-radius: 1.5rem; // 更圆润的边角
    max-width: 800px;
    width: 95%; // 调整宽度
    max-height: 95vh; // 调整高度
    overflow-y: auto;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

    .modal-header {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.2rem 1.8rem; // 调整内边距
      background: rgba(var(--card-bg-rgb), 0.7);
      backdrop-filter: blur(40px) saturate(180%);
      -webkit-backdrop-filter: blur(40px) saturate(180%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      z-index: 1;

      h2 {
        margin: 0;
        color: var(--text-color); // 使用变量适配夜间模式
        font-size: 1.8rem; // 调整字体大小
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.8rem; // 调整图标大小
        cursor: pointer;
        color: var(--text-color); // 使用变量适配夜间模式
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
      padding: 1.8rem; // 调整内边距

      .data-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); // 缩小卡片最小宽度
        gap: 1.2rem;

        .data-item {
          display: flex; // 使用 flex 布局排列图标和内容
          align-items: center;
          padding: 1rem 1.2rem; // 调整内边距
          background: var(--card-item-bg, rgba(255, 255, 255, 0.8)); // 卡片背景，增加变量以便夜间模式调整
          border-radius: 0.8rem; // 卡片圆角
          box-shadow: 0 2px 8px rgba(68, 68, 68, 0.782); // 卡片阴影
          transition: all 0.2s ease-in-out;

          &:hover {
            transform: translateY(-2px); // 鼠标悬停效果
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .item-icon {
            flex-shrink: 0; // 防止图标缩小
            font-size: 1.8rem; // 图标大小
            margin-right: 1rem; // 图标与内容间距
            color: var(--text-secondary); // 图标颜色，增加变量以便夜间模式调整
          }

          .item-content {
            flex-grow: 1; // 内容区域占据剩余空间

            .label {
              display: block;
              font-size: 0.9rem; // 标签字体大小
              color: var(--text-secondary); // 标签颜色，增加变量以便夜间模式调整
              margin-bottom: 0.2rem;
              opacity: 0.9;
            }

            .value {
              display: block;
              font-size: 1.2rem; // 数值字体大小
              font-weight: bold;
              color: var(--text-color); // 数值颜色，使用变量适配夜间模式
              word-break: break-all; // 防止长文本溢出
            }
          }
        }
      }
    }
  }
}

// 夜间模式适配样式
:global(html.dark) .station-modal .modal-content {
  --card-item-bg: rgba(40, 40, 40, 0.8); // 夜间模式卡片背景
  --text-secondary: rgba(255, 255, 255, 0.6); // 夜间模式次要文本颜色
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

        .data-grid {
          grid-template-columns: 1fr; // 小屏幕下单列显示
          gap: 1rem;

          .data-item {
            padding: 0.8rem 1rem;

            .item-icon {
              font-size: 1.5rem;
              margin-right: 0.8rem;
            }

            .item-content {
              .label {
                font-size: 0.8rem;
              }

              .value {
                font-size: 1.1rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
