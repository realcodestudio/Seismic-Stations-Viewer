import { defineStore } from 'pinia'
import { ref } from 'vue'

interface SeismicData {
  type: string
  region: string
  PGA: number
  CalcShindo: number
  Shindo: string
  Max_Shindo: string
  update_at: string
}

export const useSeismicStore = defineStore('seismic', () => {
  const seismicDataMap = ref<Map<string, SeismicData>>(new Map())
  
  function updateSeismicData(data: SeismicData) {
    seismicDataMap.value.set(data.type, {
      type: data.type,
      region: data.region,
      PGA: Number(data.PGA.toFixed(3)),
      CalcShindo: data.CalcShindo,
      Shindo: data.Shindo,
      Max_Shindo: data.Max_Shindo,
      update_at: data.update_at
    })
  }

  return {
    seismicDataMap,
    updateSeismicData
  }
})