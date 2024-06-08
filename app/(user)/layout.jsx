'use client'
import { userNavLinks } from '../../lib/constants/navLinks'
import Navbar from '../../components/Navbar'
import { useRoleRedirect } from '../../lib/utils/useRoleRedirect'
import Loading from '../../components/loading/index'
import Footer from '../../components/Footer'

const UserLayout = ({ children }) => {
  const loading = useRoleRedirect('USER', '/admindashboard')

  if (loading) {
    return <Loading />
  }
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar
        route={'/userdashboard'}
        title={'Kullanıcı Paneli '}
        navLinks={userNavLinks}
      />
      <div className=" pt-7 px-6  flex-1  w-full max-w-[1540px] mx-auto">
        {children}
      </div>
      <Footer />
    </div>
  )
}
export default UserLayout
