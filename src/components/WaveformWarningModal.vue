<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="cancel">
    <div class="modal-content" :class="{ dark: isDark }">
      <h3>{{ $t('waveform_accuracy_warning_title') }}</h3>
      <p>{{ $t('waveform_accuracy_warning_message') }}</p>
      <div class="modal-checkbox">
        <label>
          <input type="checkbox" v-model="dontShowAgain">
          {{ $t('dont_show_waveform_warning_again') }}
        </label>
      </div>
      <div class="modal-actions" :class="{ dark: isDark }">
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
  isDark: {
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
  if (props.isDark) {
    console.log('Modal is in dark mode');
  }
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
  background: rgba(0, 0, 0, 0.91);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
}

.modal-content.dark {
  background: #333;
  color: #eee;
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

.modal-actions.dark button:first-child {
  background: #0d47a1;
}

.modal-actions.dark button:last-child {
  background: #555;
  color: #eee;
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
