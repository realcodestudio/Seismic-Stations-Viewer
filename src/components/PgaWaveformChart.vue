<template>
  <div ref="chartContainer" class="waveform-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';

const props = defineProps<{
  pgaHistory: { time: number, value: number }[];
  isDark: boolean;
}>();

const chartContainer = ref<HTMLElement | null>(null);
let chart: ECharts | null = null;

// 计算 PGA 差值和时间标签
const calculatePgaDiff = (history: { time: number, value: number }[]) => {
  const diffData: number[] = [];
  const timeLabels: string[] = [];

  for (let i = 1; i < history.length; i++) {
    const diff = history[i].value - history[i - 1].value;
    diffData.push(diff);
    // 格式化时间标签，只显示分:秒
    const date = new Date(history[i].time);
    timeLabels.push(date.toLocaleTimeString('zh-CN', { minute: '2-digit', second: '2-digit' }));
  }
  return { diffData, timeLabels };
};

// 初始化 ECharts 图表
const initChart = () => {
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value);
    renderChart(props.pgaHistory);
  }
};

// 渲染图表
const renderChart = (history: { time: number, value: number }[]) => {
  if (!chart) return;

  const { diffData, timeLabels } = calculatePgaDiff(history);

  // 根据是否是夜间模式设置颜色
  const axisColor = props.isDark ? '#555' : '#666';
  const textColor = props.isDark ? '#bbb' : '#666';
  const splitLineColor = props.isDark ? '#333' : '#555';
  const waveformColor = props.isDark ? '#ff9933' : '#1e90ff';
  const areaGradientColorStart = props.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 153, 51, 0.2)';
  const areaGradientColorEnd = props.isDark ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 153, 51, 0)';

  const option: EChartsOption = {
    backgroundColor: 'transparent', // 背景透明
    grid: {
      left: '0%',
      right: '0%',
      bottom: '5%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timeLabels,
      axisLine: { show: true, lineStyle: { color: axisColor } }, // 坐标轴线颜色
      axisLabel: { color: textColor }, // 坐标轴文字颜色
      axisTick: { show: false }, // 不显示刻度线
    },
    yAxis: {
      type: 'value',
      axisLine: { show: true, lineStyle: { color: axisColor } }, // 坐标轴线颜色
      axisLabel: { color: textColor }, // 坐标轴文字颜色
      splitLine: { show: true, lineStyle: { type: 'dashed', color: splitLineColor } }, // 网格线样式
    },
    series: [
      {
        name: 'PGA Diff',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: diffData,
        lineStyle: {
          color: waveformColor, // 波形颜色
          width: 2, // 增加线条粗细
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: areaGradientColorStart
            },
            {
              offset: 1,
              color: areaGradientColorEnd
            }
          ])
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        params = params[0];
        return `${params.name}<br/>PGA (cm/s^2): ${params.value.toFixed(6)}`;
      },
    },
  };

  chart.setOption(option);
};

// 监听 pgaHistory 数据变化，更新图表
watch(() => props.pgaHistory, (newHistory) => {
  renderChart(newHistory);
}, { deep: true });

// 组件挂载后初始化图表
onMounted(() => {
  initChart();
  // 确保图表在容器大小改变时重绘
  window.addEventListener('resize', () => chart?.resize());
});

// 组件卸载前销毁图表
onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener('resize', () => chart?.resize());
});
</script>

<style scoped>
.waveform-chart {
  width: 90%;
  height: 150px;
}
</style>