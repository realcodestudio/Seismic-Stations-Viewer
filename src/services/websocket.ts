import { useSeismicStore } from "../stores/seismic";

export function initWebSocket() {
  const websocketUrl = localStorage.getItem('websocketUrl') || 'wss://seisjs.wolfx.jp/all_seis';
  const ws = new WebSocket(websocketUrl);
  const seismicStore = useSeismicStore();

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // 添加详细日志
      console.log("收到WebSocket数据:", data);
      if (!data || typeof data.PGA === "undefined") {
        console.warn("收到无效的WebSocket数据: 缺少PGA字段");
        console.dir(data);
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
