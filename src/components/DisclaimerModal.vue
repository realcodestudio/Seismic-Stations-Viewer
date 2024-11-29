<template>
  <div v-if="show" class="disclaimer-modal">
    <div class="modal-content">
      <h2>项目说明</h2>
      <div class="disclaimer-text">
        <b>请注意：</b>本项目为独立开发项目，与 Wolfx团队组织没有任何从属关系或官方合作。<br> 本项目仅从 Wolfx团队提供的API中获取公开数据，不代表 Wolfx团队的官方立场。<br>如遇到任何项目相关的问题或故障，请勿联系 Wolfx 团队，应直接在本项目的 Issues 区提出。<br><b>使用本项目即表示您同意并理解上述声明。本项目仅供学习和参考使用。</b>
      </div>
      <button class="close-btn" @click="closeModal">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(true)

const closeModal = () => {
  show.value = false
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.disclaimer-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);

  .modal-content {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 1rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    h2 {
      margin-bottom: 1rem;
      text-align: center;
      color: var(--text-color);
    }

    .disclaimer-text {
      margin-bottom: 2rem;
      line-height: 1.6;
      color: var(--text-color);
    }

    .close-btn {
      display: block;
      width: 100%;
      padding: 0.8rem;
      background: #007AFF;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: #0056b3;
      }
    }
  }
}
</style>
