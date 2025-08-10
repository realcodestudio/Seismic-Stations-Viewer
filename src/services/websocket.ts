import { useSeismicStore } from "../stores/seismic";

export function initWebSocket() {
  // 页面加载时重置重连计数器
  localStorage.removeItem('websocketReconnectAttempts');
  const websocketUrl = localStorage.getItem('websocketUrl') || 'wss://seisjs.wolfx.jp/all_seis';
  const ws = new WebSocket(websocketUrl);
  const seismicStore = useSeismicStore();

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // 添加详细日志
      // console.log("收到WebSocket数据:", data);
      if (!data || typeof data.PGA === "undefined") {
        console.warn();
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

  // 连接成功时重置重连计数器
  ws.onopen = () => {
    console.log("WebSocket连接成功。");
    // 重置重连计数器
    localStorage.removeItem('websocketReconnectAttempts');
  };

  // 移到onclose事件内部以确保每次重连都是独立的
  ws.onclose = () => {
    console.warn("WebSocket连接已关闭。");
    // 从localStorage获取重连配置，便于动态调整
    const maxReconnectAttempts = 256; //最大重连次数
    const reconnectInterval = 10000; // 10秒
    
    // 获取当前重连次数，如果不存在则初始化为0
    let reconnectAttempts = parseInt(localStorage.getItem('websocketReconnectAttempts') || '0', 10);
    
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      // 保存重连次数到localStorage
      localStorage.setItem('websocketReconnectAttempts', reconnectAttempts.toString());
      console.log(`尝试重连(${reconnectAttempts}/${maxReconnectAttempts})...`);
      setTimeout(() => {
        initWebSocket();
      }, reconnectInterval);
    } else {
      console.error(`已达到最大重连次数(${maxReconnectAttempts})，请检查网络连接是否正常。`);
      // 重置重连次数
      localStorage.removeItem('websocketReconnectAttempts');
    }
  };

  return ws;
}
