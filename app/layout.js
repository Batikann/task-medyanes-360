import { Inter } from 'next/font/google'
import './globals.css'
import { NotificationProvider } from '../context/NotificationContext .jsx'
const inter = Inter({ subsets: ['latin'] })
import AuthProvider from '../context/AuthProvider.jsx'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
export const metadata = {
  title: 'TaskManager',
  description: 'TaskManager for profesional',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          <AuthProvider>{children}</AuthProvider>
        </NotificationProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
