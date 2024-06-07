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
        title={'Admin Paneli'}
        navLinks={adminNavLinks}
      />
      <div className="pt-7 flex-1  w-full max-w-[1540px] mx-auto p-5">
        {children}
      </div>
      <Footer />
    </div>
  )
}
export default AdminLayout
