import { useSeismicStore } from '../stores/seismic'

export function initWebSocket() {
  const ws = new WebSocket('wss://seis.wolfx.jp:2053/all_seisjs')
  const seismicStore = useSeismicStore()

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    seismicStore.updateSeismicData(data)
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  return ws
}