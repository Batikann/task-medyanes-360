import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { checkRole } from './authUtils.js'

// Kullanıcının rolüne göre sayfalar arası korumayı sağladığımız fonksiyon
export const useRoleRedirect = (expectedRole, redirectPath) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'))

    if (!user) {
      router.push('/login')
      setLoading(false)
      return
    }

    const verifyRole = async () => {
      const res = await checkRole()
      if (res.role !== expectedRole) {
        router.push(redirectPath)
      } else {
        setLoading(false)
      }
    }

    verifyRole()
  }, [router, expectedRole, redirectPath])

  return loading
}
