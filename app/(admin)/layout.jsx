'use client'
import Navbar from '../../components/Navbar'
import { adminNavLinks } from '../../lib/constants/navLinks'
import Footer from '../../components/Footer'
import { ToastContainer } from 'react-toastify'

const AdminLayout = ({ children }) => {
  return (
    <div className="h-screen w-screen flex flex-col ">
      <Navbar
        route={'/admindashboard?task=all'}
        title={'Admin Paneli'}
        navLinks={adminNavLinks}
      />
      <div className="pt-7 flex-1  w-full max-w-[1540px] mx-auto p-5">
        {children}
      </div>
      <Footer />
      <ToastContainer />
    </div>
  )
}
export default AdminLayout
