import { useSeismicStore } from "../stores/seismic";

export function initWebSocket() {
  const ws = new WebSocket("wss://seisjs.wolfx.jp/all_seis");
  const seismicStore = useSeismicStore();

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (!data || typeof data.PGA === "undefined") {
        console.warn("收到无效的WebSocket数据:", data);
        return;
      }

      seismicStore.updateSeismicData(data);
    } catch (error) {
      console.error("处理WebSocket数据错误:", error);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket错误:", error);
  };

  ws.onclose = () => {
    console.warn("WebSocket连接已关闭。");
  };

  return ws;
}
