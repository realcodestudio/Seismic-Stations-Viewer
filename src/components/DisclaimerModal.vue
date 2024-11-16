<template>
  <div v-if="show" class="disclaimer-modal">
    <div class="modal-content">
      <h2>项目说明</h2>
      <div class="disclaimer-text">
        本项目用于从Wolfx Websocket API获取地震测站的各种信息并可视化展示；本项目不属于Wolfx管理，当项目出现问题时请勿联系Wolfx。
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
  background: rgba(0, 0, 0, 0.5);
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
