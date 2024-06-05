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
        route={'/userdashboard?taskStatus=all'}
        title={'Kullanıcı Paneli '}
        navLinks={userNavLinks}
      />
      <div className=" p-7 flex-1  w-full">{children}</div>
      <Footer />
    </div>
  )
}
export default UserLayout
