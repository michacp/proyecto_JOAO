<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div v-for="toast in toasts" :key="toast.id" 
         class="toast show" 
         :class="`toast-${toast.type}`"
         role="alert">
      <div class="toast-header">
        <strong class="me-auto">Sistema</strong>
        <button type="button" class="btn-close" 
                @click="removeToast(toast.id)"></button>
      </div>
      <div class="toast-body">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToasts } from '../composables/useToasts'

const { toasts, removeToast } = useToasts()
</script>

<style scoped>
.toast-success {
  background-color: #d1e7dd;
  border-color: #badbcc;
  color: #0f5132;
}

.toast-error {
  background-color: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
}

.toast-warning {
  background-color: #fff3cd;
  border-color: #ffecb5;
  color: #664d03;
}
</style>