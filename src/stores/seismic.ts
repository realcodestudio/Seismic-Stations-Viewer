import { defineStore } from 'pinia'
import { ref } from 'vue'

interface SeismicData {
  // 基本信息
  type: string                  // 测站唯一标识
  region: string               // 地区名称
  latitude: number             // 纬度
  longitude: number            // 经度
  version: string              // 版本号

  // PGA 相关数据
  PGA: number                  // PGA 综合值
  Max_PGA: number             // 最大 PGA 综合值

  // PGV 相关数据
  PGV: number                  // PGV 综合值
  Max_PGV: number             // 最大 PGV 综合值

  // 震度相关数据
  Shindo: string              // 震度
  CalcShindo: number          // 计测震度
  Max_Shindo: string          // 最大震度
  Max_CalcShindo: number      // 最大计测震度

  // 烈度相关数据
  Intensity: string            // 烈度
  Max_Intensity: string        // 最大烈度

  // 长周期地震动相关数据
  LPGM: number            // 长周期地震动阶级
  Max_LPGM: number        // 最大长周期地震动阶级
  Sva30: number            // 加速度反应谱值
  Max_Sva30: number        // 最大加速度反应谱值

  // 其他信息
  is_desktop: boolean          // 是否为桌面端
  High_Precision: boolean      // 是否高精度

  // 时间信息
  update_at: string           // 更新时间
  create_at: string           // 创建时间

  // 添加历史 PGA 数据属性
  pgaHistory: { time: number, value: number }[];
}

export const useSeismicStore = defineStore('seismic', () => {
  const seismicDataMap = ref<Map<string, SeismicData>>(new Map())

  function updateSeismicData(data: SeismicData) {
    const { reverse, ...restData } = data as any;

    // 获取当前测站的历史数据
    const currentStationData = seismicDataMap.value.get(data.type);
    const pgaHistory = currentStationData?.pgaHistory || [];

    // 添加新的 PGA 数据点
    pgaHistory.push({ time: Date.now(), value: restData.PGA });

    // 保持历史数据数组长度不超过 60
    if (pgaHistory.length > 60) {
      pgaHistory.shift(); // 移除最旧的数据点
    }

    const updatedData = {
      ...restData,
      region: restData.region || data.type.slice(-6),
      latitude: restData.latitude || 0,
      longitude: restData.longitude || 0,
      version: restData.version,
      PGA: restData.PGA,
      CalcShindo: restData.CalcShindo,
      Shindo: restData.Shindo,
      Max_Shindo: restData.Max_Shindo,
      Intensity: restData.Intensity,
      update_at: restData.update_at,
      // 添加更新后的历史数据
      pgaHistory: pgaHistory,
    };

    seismicDataMap.value.set(data.type, updatedData);
  }

  return {
    seismicDataMap,
    updateSeismicData
  }
})