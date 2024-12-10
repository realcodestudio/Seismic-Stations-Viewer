import { useSeismicStore } from '../stores/seismic'

export function initWebSocket() {
  const ws = new WebSocket('wss://seisjs.wolfx.jp/all_seis')
  const seismicStore = useSeismicStore()

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      // console.log('收到WebSocket数据:', data)
      seismicStore.updateSeismicData(data)
    } catch (error) {
      console.error('处理WebSocket数据错误:', error)
    }
  }

  return ws
}