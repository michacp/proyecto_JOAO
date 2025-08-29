import { ref } from 'vue'
import axios from 'axios'

//const apiUrl = process.env.VUE_APP_API_URL  
const apiUrl = "http://localhost:8000" 
export function useContactos() {
  const contactos = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalContactos = ref(0)
  const totalPaginas = ref(0)
  const paginaActual = ref(1)

  const getContactos = async (filtros = {}) => {
    loading.value = true
    error.value = null
    try {
      // Convertir los filtros en parámetros de consulta para GET
      const params = new URLSearchParams()
      
      // Añadir parámetros de paginación
      params.append('pagina', filtros.pagina || 1)
      params.append('porPagina', filtros.porPagina || 10)
      
      // Añadir búsqueda si existe
      if (filtros.busqueda) {
        params.append('busqueda', filtros.busqueda)
      } 
      const response = await axios.get(`${apiUrl}/api/contactos?${params.toString()}`)
      
      // Asignar los datos de respuesta
      contactos.value = response.data.contactos || []
      totalContactos.value = response.data.total || 0
      totalPaginas.value = response.data.totalPaginas || 0
      paginaActual.value = response.data.pagina || 1
      
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Error al cargar contactos'
      contactos.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    contactos,
    loading,
    error,
    totalContactos,
    totalPaginas,
    paginaActual,
    getContactos
  }
}