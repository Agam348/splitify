import Store from 'electron-store'

interface SettingsSchema {
  lastOutputDirectory: string
}

export class SettingsService {
  private readonly store = new Store<SettingsSchema>({
    name: 'settings',
    defaults: {
      lastOutputDirectory: '',
    },
  })

  getLastOutputDirectory() {
    return this.store.get('lastOutputDirectory') || null
  }

  updateLastOutputDirectory(directory: string) {
    this.store.set('lastOutputDirectory', directory)
  }
}
