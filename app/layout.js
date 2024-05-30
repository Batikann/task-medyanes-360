import { Inter } from 'next/font/google'
import './globals.css'
import { NotificationProvider } from '../context/NotificationContext .jsx'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskManager',
  description: 'TaskManager for profesional',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  )
}
