import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.estudiojuridico.app',
  appName: 'Estudio Jurídico',
  webDir: 'dist',
  server: {
    // Para desarrollo: apuntá a tu IP local con el puerto de Vite
    // url: 'http://192.168.1.X:5173',
    // cleartext: true,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#f8fafc',
  },
  android: {
    backgroundColor: '#f8fafc',
  },
  plugins: {
    StatusBar: {
      style: 'Light',
      backgroundColor: '#ffffff',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
}

export default config
