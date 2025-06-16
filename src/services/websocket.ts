import { useSeismicStore } from "../stores/seismic";

export function initWebSocket() {
  const ws = new WebSocket("wss://seisjs.wolfx.jp/all_seis");
  const seismicStore = useSeismicStore();

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // 检查数据是否有效
      if (!data || typeof data.PGA === "undefined") {
        console.warn("收到无效的WebSocket数据:", data);
        return; // 跳过处理
      }

      // 如果数据有效，更新状态
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
    // 可以选择在这里尝试重新连接
  };

  return ws;
}
