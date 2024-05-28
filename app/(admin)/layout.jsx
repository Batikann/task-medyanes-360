'use client'
import Navbar from '../../components/Navbar'
import { adminNavLinks } from '../../lib/constants/navLinks'
import { useRoleRedirect } from '../../lib/utils/useRoleRedirect'
import Loading from '../../components/loading/index'
import Footer from '../../components/Footer'

const AdminLayout = ({ children }) => {
  const loading = useRoleRedirect('ADMIN', '/userdashboard')

  if (loading) {
    return <Loading />
  }
  return (
    <div className="h-screen w-screen flex flex-col ">
      <Navbar
        route={'/admindashboard'}
        title={'Admin Dashboard'}
        navLinks={adminNavLinks}
      />
      <div className="p-7 flex-1 max-w-screen-2xl mx-auto w-full">
        {children}
      </div>
      <Footer />
    </div>
  )
}
export default AdminLayout
