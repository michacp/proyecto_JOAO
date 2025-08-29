 
import { ref, onMounted, computed, watch } from 'vue'
import { useContactos } from './useContactos'

export function useContactsTable() {
  const { contactos, loading, error, totalContactos, getContactos } = useContactos()
  
  // Estado para búsqueda y paginación
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(30)
  const itemsPerPageOptions = [30, 50, 100, 200]
  
  // Construir objeto de filtros para enviar al backend
  const buildFiltros = () => {
    return {
      pagina: currentPage.value,
      porPagina: itemsPerPage.value,
      busqueda: searchQuery.value
    }
  }
  
  // Cargar contactos con filtros
  const cargarContactos = () => {
    getContactos(buildFiltros())
  }
  
  // Watchers para recargar cuando cambien los filtros
  watch(searchQuery, () => {
    currentPage.value = 1 // Resetear a primera página al buscar
    cargarContactos()
  })
  
  watch(currentPage, cargarContactos)
  
  watch(itemsPerPage, () => {
    currentPage.value = 1 // Resetear a primera página al cambiar items por página
    cargarContactos()
  })
  
  // Calcular total de páginas (ahora viene del backend)
  const totalPages = computed(() => {
    return Math.ceil(totalContactos.value / itemsPerPage.value)
  })
  
  // Cambiar página
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  
  // Cargar contactos al inicializar
  onMounted(() => {
    cargarContactos()
  })
  
  return {
    contactos,
    loading,
    error,
    searchQuery,
    currentPage,
    itemsPerPage,
    itemsPerPageOptions,
    totalPages,
    totalContactos,
    changePage,
    cargarContactos
  }
}