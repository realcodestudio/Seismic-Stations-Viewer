<template>
  <!-- 主协议模态框容器 -->
  <div v-if="show" class="terms-container">
    <!-- 背景  -->
    <div class="terms-background"></div>
    
    <!-- 内容  -->
    <div class="terms-content-wrapper">
      <div class="terms-modal" @click.stop>
        <div class="terms-header">
          <h2>{{ t('terms_title') }}</h2>
        </div>
        <div class="terms-content">
          <div class="terms-section">
            <h3>{{ t('terms_of_service_title') }}</h3>
            <p>{{ t('terms_of_service_welcome') }}</p>
            <ol>
              <li>{{ t('terms_of_service_1') }}</li>
              <li>{{ t('terms_of_service_2') }}</li>
              <li>{{ t('terms_of_service_3') }}</li>
              <li>{{ t('terms_of_service_4') }}</li>
              <li>{{ t('terms_of_service_5') }}</li>
              <li>{{ t('terms_of_service_6') }}</li>
            </ol>
          </div>
          
          <div class="terms-section">
            <h3>{{ t('privacy_policy_title') }}</h3>
            <p>{{ t('privacy_policy_welcome') }}</p>
            <ol>
              <li>{{ t('privacy_policy_1') }}</li>
              <li>{{ t('privacy_policy_2') }}</li>
              <li>{{ t('privacy_policy_3') }}</li>
              <li>{{ t('privacy_policy_4') }}</li>
              <li>{{ t('privacy_policy_5') }}</li>
              <li>{{ t('privacy_policy_6') }}</li>
            </ol>
          </div>
          
          <div class="terms-actions">
            <label class="terms-checkbox">
              <input type="checkbox" v-model="agreed" />
              <span>{{ t('agree_terms') }}</span>
            </label>
          </div>
        </div>
        <div class="terms-footer">
          <button class="terms-button reject-button" @click="rejectTerms">
              {{ t('disagree_button') }}
            </button>
            <button class="terms-button accept-button" :disabled="!agreed" @click="acceptTerms">
              {{ t('next_button') }}
            </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 不同意确认模态框 -->
  <div v-if="showRejectConfirm" class="reject-confirm-overlay" @click.self="cancelRejectTerms">
    <div class="reject-confirm-modal" @click.stop>
      <h3>{{ t('reject_confirm_title') }}</h3>
        <p>{{ t('reject_confirm_message') }}</p>
      <div class="reject-confirm-actions">
        <button class="reject-confirm-button cancel-button" @click="cancelRejectTerms">
            {{ t('reject_cancel_button') }}
          </button>
          <button class="reject-confirm-button continue-button" @click="confirmRejectTerms">
            {{ t('continue_disagree_button') }}
          </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['accept', 'close']);
const agreed = ref(false);
const showRejectConfirm = ref(false); // 控制不同意确认模态框的显示

const acceptTerms = () => {
  if (agreed.value) {
    // 标记用户已同意条款
    localStorage.setItem('termsAccepted', 'true');
    emit('accept');
  }
};

const rejectTerms = () => {
  // 显示自定义确认模态框
  showRejectConfirm.value = true;
};

const confirmRejectTerms = () => {
  // 如果用户继续不同意，则跳转到bing.com
  window.location.href = 'https://www.bing.com';
};

const cancelRejectTerms = () => {
  // 关闭确认模态框
  showRejectConfirm.value = false;
};
</script>

<style scoped>
/* 主协议模态框容器 */
.terms-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}

/* 背景层 - 只应用模糊效果 */
.terms-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.595);
  background-image: url('https://api.wolfx.jp/img.php');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: fadeIn 0.3s ease;
  /* 图床背景模糊效果 - 跨浏览器兼容 */
  filter: blur(50px);
  -webkit-filter: blur(50px); /* Safari */
  -moz-filter: blur(50px); /* Firefox */
  -ms-filter: blur(50px); /* IE/Edge */
  transform: scale(1.05); /* 防止模糊后出现边缘白边 */
}

/* 内容层 - 不应用模糊效果 */
.terms-content-wrapper {
  position: relative;
  z-index: 1;
  animation: fadeIn 0.3s ease;
}

.terms-modal {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
  /* 亚克力背景模糊效果 - 跨浏览器兼容 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
  -moz-backdrop-filter: blur(10px); /* Firefox */
  -ms-backdrop-filter: blur(10px); /* IE/Edge */
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.terms-header {
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.terms-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #213547;
}

.terms-content {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.terms-section {
  margin-bottom: 2rem;
}

.terms-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #334155;
}

.terms-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #64748b;
}

.terms-section ol {
  padding-left: 1.5rem;
  color: #64748b;
}

.terms-section li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.terms-actions {
  margin-top: 2rem;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: #64748b;
}

.terms-checkbox input {
  margin-top: 0.25rem;
}

.terms-footer {
  padding: 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* 不同意按钮样式 - 设定为灰色 */
.reject-button {
  background-color: #cbd5e1;
  color: #334155;
}

.reject-button:hover {
  background-color: #94a3b8;
}

/* 下一步按钮样式 - 未勾选时为灰色，勾选后变为醒目蓝色 */
.accept-button:not(:disabled) {
  background-color: #07aaf0;
}

.terms-button {
  padding: 0.75rem 1.5rem;
  background-color: #00000019;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.terms-button:hover:not(:disabled) {
  background-color: #35495E;
}

.terms-button:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 确保协议内容除标题外全部左对齐 */
.terms-section p,
.terms-section ol,
.terms-section li,
.terms-checkbox span {
  text-align: left;
}

/* 响应式设计 */
/* 不同意确认模态框样式 */
.reject-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.reject-confirm-modal {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
  /* 亚克力背景模糊效果 - 跨浏览器兼容 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
  -moz-backdrop-filter: blur(10px); /* Firefox */
  -ms-backdrop-filter: blur(10px); /* IE/Edge */
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.reject-confirm-modal h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #213547;
}

.reject-confirm-modal p {
  margin: 0 0 2rem 0;
  color: #64748b;
  line-height: 1.5;
}

.reject-confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.reject-confirm-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cancel-button {
  background-color: #07aaf0;
  color: white;
}

.cancel-button:hover {
  background-color: #2684dc;
}

.continue-button {
  background-color: #cbd5e1;
  color: #334155;
}

.continue-button:hover {
  background-color: #94a3b8;
}

@media (max-width: 768px) {
  .terms-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .terms-header,
  .terms-content,
  .terms-footer {
    padding: 1.5rem;
  }
  
  .reject-confirm-modal {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>