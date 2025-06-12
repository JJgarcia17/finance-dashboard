import { ref, reactive } from 'vue'

export interface ConfirmationOptions {
  type?: 'danger' | 'warning' | 'info'
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  itemName?: string
  itemDescription?: string
  itemColor?: string
  showWarning?: boolean
  warningMessage?: string
}

export function useConfirmationModal() {
  const isOpen = ref(false)
  const loading = ref(false)
  
  const modalConfig = reactive<ConfirmationOptions>({
    type: 'danger',
    title: 'Confirmar acción',
    message: '¿Estás seguro de que deseas continuar?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    showWarning: false,
    warningMessage: 'Esta acción no se puede deshacer.'
  })

  let resolvePromise: ((value: boolean) => void) | null = null

  const openModal = (options: ConfirmationOptions = {}): Promise<boolean> => {
    // Actualizar configuración del modal
    Object.assign(modalConfig, {
      type: 'danger',
      title: 'Confirmar acción',
      message: '¿Estás seguro de que deseas continuar?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      showWarning: false,
      warningMessage: 'Esta acción no se puede deshacer.',
      ...options
    })

    isOpen.value = true
    loading.value = false

    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
  }

  const confirm = () => {
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
    closeModal()
  }

  const cancel = () => {
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
    closeModal()
  }

  const closeModal = () => {
    isOpen.value = false
    loading.value = false
  }

  const setLoading = (state: boolean) => {
    loading.value = state
  }

  // Funciones de conveniencia para tipos específicos
  const confirmDelete = (itemName?: string, itemDescription?: string, itemColor?: string): Promise<boolean> => {
    return openModal({
      type: 'danger',
      title: 'Eliminar elemento',
      message: '¿Estás seguro de que deseas eliminar este elemento?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      itemName,
      itemDescription,
      itemColor,
      showWarning: true,
      warningMessage: 'Esta acción no se puede deshacer.'
    })
  }

  const confirmRestore = (itemName?: string, itemDescription?: string, itemColor?: string): Promise<boolean> => {
    return openModal({
      type: 'info',
      title: 'Restaurar elemento',
      message: '¿Deseas restaurar este elemento?',
      confirmText: 'Restaurar',
      cancelText: 'Cancelar',
      itemName,
      itemDescription,
      itemColor,
      showWarning: false
    })
  }

  const confirmStatusChange = (itemName?: string, isActive?: boolean): Promise<boolean> => {
    const action = isActive ? 'desactivar' : 'activar'
    const actionCap = isActive ? 'Desactivar' : 'Activar'
    
    return openModal({
      type: 'warning',
      title: `${actionCap} elemento`,
      message: `¿Estás seguro de que deseas ${action} este elemento?`,
      confirmText: actionCap,
      cancelText: 'Cancelar',
      itemName,
      showWarning: false
    })
  }

  return {
    // Estados
    isOpen,
    loading,
    modalConfig,
    
    // Métodos
    openModal,
    confirm,
    cancel,
    closeModal,
    setLoading,
    
    // Funciones de conveniencia
    confirmDelete,
    confirmRestore,
    confirmStatusChange
  }
}
