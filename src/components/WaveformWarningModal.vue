<template>
  <div :class="{ 'modal-overlay': true, 'show': isVisible }" @click.self="cancel">
    <div class="modal-content">
      <h3>{{ $t('waveform_accuracy_warning_title') }}</h3>
      <p>{{ $t('waveform_accuracy_warning_message') }}</p>
      <div class="modal-checkbox">
        <label>
          <input type="checkbox" v-model="dontShowAgain">
          {{ $t('dont_show_waveform_warning_again') }}
        </label>
      </div>
      <div class="modal-actions">
        <button @click="agree">{{ $t('agree') }}</button>
        <button @click="cancel">{{ $t('cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['agree', 'cancel']);

const dontShowAgain = ref(false);

const agree = () => {
  if (props.isVisible) {
    console.log('Modal is visible');
  }
  emit('agree', dontShowAgain.value);
};

const cancel = () => {
  console.log(t('cancel'));
  emit('cancel');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, background 0.3s ease;
}

.modal-overlay.show {
  opacity: 1;
  visibility: visible;
  background: rgba(0, 0, 0, 0.91);
  
  .modal-content {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  transform: translateY(30px) scale(0.9);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-checkbox {
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;

  label {
    font-size: 0.8rem;
    color: var(--text-color);

    input[type="checkbox"] {
      margin-right: 5px;
    }
  }
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  border-radius: 20px;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

button:first-child {
  background: #2196f3;
  color: white;
}

button:last-child {
  background: #ccc;
  color: #333;
}
</style>
