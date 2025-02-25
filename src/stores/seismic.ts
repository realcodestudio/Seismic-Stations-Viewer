import { defineStore } from 'pinia'
import { ref } from 'vue'

interface SeismicData {
  // 基本信息
  type: string                  // 测站唯一标识
  region: string               // 地区名称
  latitude: number             // 纬度
  longitude: number            // 经度
  version: string              // 版本号

  // PGV 相关数据
  PGV: number                  // PGV 综合值
  PGV_EW: number              // PGV 东西方向
  PGV_NS: number              // PGV 南北方向
  PGV_UD: number              // PGV 上下方向
  Max_PGV: number             // 最大 PGV 综合值
  Max_PGV_EW: number          // 最大 PGV 东西方向
  Max_PGV_NS: number          // 最大 PGV 南北方向
  Max_PGV_UD: number          // 最大 PGV 上下方向

  // PGA 相关数据
  PGA: number                  // PGA 综合值
  PGA_EW: number              // PGA 东西方向
  PGA_NS: number              // PGA 南北方向
  PGA_UD: number              // PGA 上下方向
  Max_PGA: number             // 最大 PGA 综合值
  Max_PGA_EW: number          // 最大 PGA 东西方向
  Max_PGA_NS: number          // 最大 PGA 南北方向
  Max_PGA_UD: number          // 最大 PGA 上下方向

  // 震度相关数据
  Shindo: string              // 震度
  CalcShindo: number          // 计测震度
  Max_Shindo: string          // 最大震度
  Max_CalcShindo: number      // 最大计测震度

  // 烈度相关数据
  Intensity: string            // 烈度
  Max_Intensity: string        // 最大烈度

  // 其他信息
  High_Precision: boolean      // 是否高精度
  private: boolean            // 是否私有

  // 时间信息
  update_at: string           // 更新时间
  create_at: string           // 创建时间
}

export const useSeismicStore = defineStore('seismic', () => {
  const seismicDataMap = ref<Map<string, SeismicData>>(new Map())

  function updateSeismicData(data: SeismicData) {
    // 利用对象解构过滤掉 countryName, cityName, reverse 字段喵～
    const { countryName, cityName, reverse, ...restData } = data as any;

    const updatedData = {
      ...restData,
      region: restData.region || '未知地区',
      latitude: Number(restData.latitude) || 0,
      longitude: Number(restData.longitude) || 0,
      version: restData.version,
      PGA: Number(restData.PGA.toFixed(3)),
      CalcShindo: restData.CalcShindo,
      Shindo: restData.Shindo,
      Max_Shindo: restData.Max_Shindo,
      Intensity: restData.Intensity,
      update_at: restData.update_at
    };

    seismicDataMap.value.set(data.type, updatedData);
  }

  return {
    seismicDataMap,
    updateSeismicData
  }
})