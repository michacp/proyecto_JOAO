import { ref } from 'vue'
import axios from 'axios'

//const apiUrl = process.env.VUE_APP_API_URL
const apiUrl = "http://localhost:8000" 
export function useContactosCrud() {
  const loading = ref(false)
  const error = ref(null)
  
  // Verificar si email existe
  const verificarEmail = async (email) => {
    try {
      const response = await axios.post(`${apiUrl}/api/contactos/verificar-email`, 
        { email: email }, // Asegurar que sea objeto con clave email
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
      console.log(response.data)
      return response.data
    } catch (err) {
      console.error('Error verificando email:', err.response?.data)
      error.value = err.response?.data?.message || 'Error al verificar email'
      return { existe: false, error: error.value }
    }
  }
  
  // Crear nuevo contacto
  const crearContacto = async (contactoData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(`${apiUrl}/api/contactos`, contactoData)
      loading.value = false
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al crear contacto'
      loading.value = false
      return { success: false, error: error.value }
    }
  }
  


  // Editar contacto
  const editarContacto = async (id, contactoData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(`${apiUrl}/api/contactos/${id}`, contactoData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      loading.value = false
      return { success: true, data: response.data }
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación'
        error.value = firstError
      } else {
        error.value = err.response?.data?.message || 'Error al editar contacto'
      }
      
      loading.value = false
      return { success: false, error: error.value }
    }
  }

  // Eliminar contacto
  const eliminarContacto = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.delete(`${apiUrl}/api/contactos/${id}`)
      loading.value = false
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al eliminar contacto'
      loading.value = false
      return { success: false, error: error.value }
    }
  }
  
  return {
    loading,
    error,
    verificarEmail,
    crearContacto,
    editarContacto,
    eliminarContacto
  }
}