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
          <div v-for="(value, key) in processedData" :key="key" class="data-item" :title="formatValue(value, key)">
            <span class="label">{{ formatLabel(key) }}:</span>
            <span class="value">{{ formatValue(value, key) }}</span>
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
    PGV: t('PGV'),
    PGV_EW: t('PGV_EW'),
    PGV_NS: t('PGV_NS'),
    PGV_UD: t('PGV_UD'),
    PGA: t('PGA'),
    PGA_EW: t('PGA_EW'),
    PGA_NS: t('PGA_NS'),
    PGA_UD: t('PGA_UD'),
    Max_PGA: t('Max_PGA'),
    Max_PGA_EW: t('Max_PGA_EW'),
    Max_PGA_NS: t('Max_PGA_NS'),
    Max_PGA_UD: t('Max_PGA_UD'),
    Max_PGV: t('Max_PGV'),
    Max_PGV_EW: t('Max_PGV_EW'),
    Max_PGV_NS: t('Max_PGV_NS'),
    Max_PGV_UD: t('Max_PGV_UD'),
    Shindo: t('Shindo'),
    CalcShindo: t('CalcShindo'),
    Max_Shindo: t('Max_Shindo'),
    Max_CalcShindo: t('Max_CalcShindo'),
    High_Precision: t('High_Precision'),
    private: t('private'),
    update_at: t('update_at'),
    create_at: t('create_at'),
    Intensity: t('Intensity'),
    Max_Intensity: t('Max_Intensity'),
    is_desktop: t('is_desktop'),
    PGD: t('PGD'),
    Max_PGD: t('Max_PGD')
  }

  return labelMap[key] || key
}

// 格式化数值
function formatValue(value: any, key: string): string {
  if (value === null || value === undefined) return '-'

  if (typeof value === 'number') {
    if (key === 'latitude' || key === 'longitude' || key === 'CalcShindo' || key === 'Max_Shindo' || key === 'Intensity' || key === 'Max_Intensity') {
      return value.toFixed(2)
    } else if (key === 'version') {
      return value.toFixed(0)
    }
    // 其他数值保留5位小数
    return value.toFixed(5)
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
  background: rgba(255, 255, 255, 0.699);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);

  .modal-content {
    background: var(--card-bg);
    border-radius: 1rem;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.445);

    .modal-header {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: rgba(var(--card-bg-rgb), 0.5);
      backdrop-filter: blur(40px) saturate(180%);
      -webkit-backdrop-filter: blur(40px) saturate(180%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      z-index: 1;

      h2 {
        margin: 0;
        color: var(--text-color);
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

        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }

    .modal-body {
      padding: 1.5rem;

      .data-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;

        .data-item {
          padding: 0.8rem;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .label {
            color: var(--text-color);
            font-weight: 500;
          }

          .value {
            color: var(--text-color);
            opacity: 0.8;
            max-width: 50%;
            word-break: break-all;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .station-modal {
    .modal-content {
      width: 95%;

      .modal-body {
        .data-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>
