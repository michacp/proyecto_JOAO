import { ref } from 'vue'

export function useToasts() {
  const toasts = ref([])
  
  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    const toast = { id, message, type }
    
    toasts.value.push(toast)
    
    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  const removeToast = (id) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }
  
  return {
    toasts,
    showToast,
    removeToast
  }
}