import { reactive } from 'vue'

export interface IAlert {
  type: 'error' | 'success' | 'info'
  message: string
  duration?: number
}

const alertState: { alert?: IAlert } = reactive({
  alert: undefined,
})

const alertService = {
  addAlert(alert: IAlert) {
    alertState.alert = alert

    setTimeout(() => {
      this.removeAlert()
    }, alert.duration || 3000)
  },

  showError(message: string, duration?: number) {
    this.addAlert({ type: 'error', message: message ? message : "Algo deu errado", duration })
  },

  showSuccess(message: string, duration?: number) {
    this.addAlert({ type: 'success', message, duration })
  },

  showInfo(message: string, duration?: number) {
    this.addAlert({ type: 'info', message, duration })
  },

  removeAlert() {
    alertState.alert = undefined
  },

  getAlerts() {
    return alertState.alert
  },
}

export default alertService
