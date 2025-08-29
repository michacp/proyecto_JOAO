<script setup>
import { ref, watch } from 'vue'
import { useContactsTable } from '../composables/useContactsTable'
import { useContactosCrud } from '../composables/useContactosCrud'
import { useToasts } from '../composables/useToasts'
import ToastContainer from '../components/ToastContainer.vue'

const {
  loading,
  error,
  searchQuery,
  currentPage,
  itemsPerPage,
  itemsPerPageOptions,
  totalPages,
  totalContactos,
  changePage,
  contactos,
  cargarContactos
} = useContactsTable()

const { crearContacto, verificarEmail, editarContacto, eliminarContacto } = useContactosCrud()
const { showToast } = useToasts()

// Estados para modales
const showModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const formLoading = ref(false)
const emailError = ref('')
const deleteLoading = ref(false)

// Formularios
const nuevoContacto = ref({
  nombre: '',
  email: '',
  telefono: ''
})

const contactoEditando = ref({
  id: null,
  nombre: '',
  email: '',
  telefono: ''
})

const contactoEliminando = ref({
  id: null,
  nombre: ''
})

// Email timeout para debounce
let emailTimeout = null

// Watcher para email en nuevo contacto
watch(() => nuevoContacto.value.email, async (newEmail) => {
  if (emailTimeout) clearTimeout(emailTimeout)
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (newEmail && emailRegex.test(newEmail)) {
    emailTimeout = setTimeout(async () => {
      formLoading.value = true
      const result = await verificarEmail(newEmail)
      formLoading.value = false
      
      if (result.existe) {
        emailError.value = 'Este email ya está registrado'
      } else {
        emailError.value = ''
      }
    }, 500)
  } else {
    emailError.value = ''
  }
})

// Watcher para email en edición
watch(() => contactoEditando.value.email, async (newEmail) => {
  if (emailTimeout) clearTimeout(emailTimeout)
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (newEmail && emailRegex.test(newEmail) && newEmail !== contactoEditando.value.originalEmail) {
    emailTimeout = setTimeout(async () => {
      formLoading.value = true
      const result = await verificarEmail(newEmail)
      formLoading.value = false
      
      if (result.existe) {
        emailError.value = 'Este email ya está registrado'
      } else {
        emailError.value = ''
      }
    }, 500)
  } else {
    emailError.value = ''
  }
})

// Abrir modales
const openModal = () => {
  showModal.value = true
  resetForm()
}

const openEditModal = (contacto) => {
  showEditModal.value = true
  contactoEditando.value = {
    id: contacto.id,
    nombre: contacto.nombre,
    email: contacto.email,
    telefono: contacto.telefono || '',
    originalEmail: contacto.email // Guardar email original para comparación
  }
  emailError.value = ''
}

const openDeleteModal = (contacto) => {
  showDeleteModal.value = true
  contactoEliminando.value = {
    id: contacto.id,
    nombre: contacto.nombre
  }
}

// Cerrar modales
const closeModal = () => {
  showModal.value = false
  resetForm()
}

const closeEditModal = () => {
  showEditModal.value = false
  contactoEditando.value = { id: null, nombre: '', email: '', telefono: '', originalEmail: '' }
  emailError.value = ''
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  contactoEliminando.value = { id: null, nombre: '' }
}

// Resetear formulario
const resetForm = () => {
  nuevoContacto.value = { nombre: '', email: '', telefono: '' }
  emailError.value = ''
}

// Enviar formularios
const submitForm = async () => {
  if (emailError.value) {
    showToast('Por favor corrige el email', 'error')
    return
  }

  formLoading.value = true
  const result = await crearContacto(nuevoContacto.value)
  formLoading.value = false

  if (result.success) {
    showToast('Contacto creado exitosamente', 'success')
    closeModal()
    cargarContactos()
  } else {
    showToast(result.error, 'error')
  }
}

const submitEditForm = async () => {
  if (emailError.value) {
    showToast('Por favor corrige el email', 'error')
    return
  }

  formLoading.value = true
  const result = await editarContacto(contactoEditando.value.id, {
    nombre: contactoEditando.value.nombre,
    email: contactoEditando.value.email,
    telefono: contactoEditando.value.telefono
  })
  formLoading.value = false

  if (result.success) {
    showToast('Contacto actualizado exitosamente', 'success')
    closeEditModal()
    cargarContactos()
  } else {
    showToast(result.error, 'error')
  }
}

const confirmDelete = async () => {
  deleteLoading.value = true
  const result = await eliminarContacto(contactoEliminando.value.id)
  deleteLoading.value = false

  if (result.success) {
    showToast('Contacto eliminado exitosamente', 'success')
    closeDeleteModal()
    cargarContactos()
  } else {
    showToast(result.error, 'error')
  }
}
</script>

<template>
  <div class="container mt-4">
    <!-- Toast Container -->
    <ToastContainer />
    
    <!-- Header con título y botón -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📞 Lista de Contactos</h2>
      <button class="btn btn-primary" @click="openModal">
        <i class="bi bi-plus-circle"></i> Agregar Contacto
      </button>
    </div>

    <!-- Panel de búsqueda y filtros -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input 
                v-model="searchQuery"
                type="text" 
                class="form-control" 
                placeholder="Buscar contactos..." 
                @keyup.enter="cargarContactos"
              >
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="itemsPerPage" class="form-select">
              <option v-for="option in itemsPerPageOptions" :value="option" :key="option">
                {{ option }} por página
              </option>
            </select>
          </div>
          <div class="col-md-3 text-end">
            <span class="text-muted">
              Mostrando {{ contactos ? contactos.length : 0 }} de {{ totalContactos }} contactos
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando contactos...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle"></i> 
      Error: {{ error }}
    </div>

    <!-- Tabla de contactos -->
    <div v-if="!loading && !error">
      <div class="table-responsive">
        <table class="table table-hover table-striped">
          <thead class="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in (contactos || [])" :key="c.id">
              <td class="fw-bold">{{ c.nombre }}</td>
              <td>{{ c.email }}</td>
              <td>{{ c.telefono }}</td>
<td class="text-end">
  <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(c)">
    <i class="bi bi-pencil"></i> Editar
  </button>
  <button class="btn btn-sm btn-outline-danger" @click="openDeleteModal(c)">
    <i class="bi bi-trash"></i> Eliminar
  </button>
</td>
            </tr>
            <tr v-if="!contactos || contactos.length === 0">
              <td colspan="4" class="text-center py-4">
                <i class="bi bi-inbox display-4 d-block text-muted mb-2"></i>
                <span class="text-muted">No se encontraron contactos</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <nav v-if="totalPages > 1" aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">
              Anterior
            </button>
          </li>
          
          <li v-for="page in totalPages" 
              :key="page" 
              class="page-item" 
              :class="{ active: currentPage === page }">
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
      <!-- Modal para agregar contacto -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Agregar Nuevo Contacto</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input 
                  v-model="nuevoContacto.nombre"
                  type="text" 
                  class="form-control" 
                  required
                  placeholder="Nombre completo"
                >
              </div>
              
              <div class="mb-3">
                <label class="form-label">Email *</label>
                <input 
                  v-model="nuevoContacto.email"
                  type="email" 
                  class="form-control" 
                  :class="{ 'is-invalid': emailError }"
                  required
                  placeholder="email@ejemplo.com"
                >
                <div v-if="emailError" class="invalid-feedback">
                  {{ emailError }}
                </div>
                <div v-if="formLoading" class="form-text">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Verificando...</span>
                  </div>
                  Verificando email...
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Teléfono</label>
                <input 
                  v-model="nuevoContacto.telefono"
                  type="tel" 
                  class="form-control" 
                  placeholder="+1 234 567 8900"
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="submitForm"
              :disabled="formLoading  "
            >
              <span v-if="formLoading" class="spinner-border spinner-border-sm" role="status"></span>
              {{ formLoading ? 'Guardando...' : 'Guardar Contacto' }}
            </button>
          </div>
        </div>
      </div>
    </div>

     <!-- Modal para editar contacto -->
    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Contacto</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitEditForm">
              <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input 
                  v-model="contactoEditando.nombre"
                  type="text" 
                  class="form-control" 
                  required
                  placeholder="Nombre completo"
                >
              </div>
              
          <div class="mb-3">
            <label class="form-label">Email *</label>
            <input 
              v-model="contactoEditando.email"
              type="email" 
              class="form-control" 
              disabled  
              required
              placeholder="email@ejemplo.com"
            >
            <div class="form-text text-muted">
              <i class="bi bi-info-circle"></i> El email no se puede modificar
            </div>
          </div>
              
              <div class="mb-3">
                <label class="form-label">Teléfono</label>
                <input 
                  v-model="contactoEditando.telefono"
                  type="tel" 
                  class="form-control" 
                  placeholder="+1 234 567 8900"
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="submitEditForm"
              :disabled="formLoading "
            >
              <span v-if="formLoading" class="spinner-border spinner-border-sm" role="status"></span>
              {{ formLoading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para eliminar contacto -->
    <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar el contacto de <strong>{{ contactoEliminando.nombre }}</strong>?</p>
            <p class="text-danger">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="confirmDelete"
              :disabled="deleteLoading"
            >
              <span v-if="deleteLoading" class="spinner-border spinner-border-sm" role="status"></span>
              {{ deleteLoading ? 'Eliminando...' : 'Sí, Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>