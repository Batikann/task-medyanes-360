'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import getUser from '../../lib/utils/getUser'
import { useState } from 'react'
import MobileNav from '../MobileNav'
import BurgerMenu from '/public/burger-menu.svg'
import Image from 'next/image'
import DownArrow from '../../public/down-arrow.svg'
import UpArrow from '../../public/up-arrow.svg'
import { IoIosLogOut } from 'react-icons/io'

const Navbar = ({ title, navLinks, route }) => {
  const [userMenu, setUserMenu] = useState(false)
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false)
  const user = getUser()
  const router = useRouter()
  const pathName = usePathname()

  //Logout işlemini gerçekleştiriyoru kullanıcıyı localstorage den siliyor
  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  return (
    <div className="  flex justify-between items-center border-b shadow-md p-7">
      <h1 className="text-xl font-semibold">
        <Link href={route} className="flex items-center gap-2">
          <div>
            Task<span className="text-blue-700 font-bold">Manager</span>
          </div>
          <span className="hidden md:block">- {title}</span>
        </Link>
      </h1>
      <div className="flex items-center gap-3">
        <ul className=" gap-6 items-center hidden md:flex font-medium text-gray-600">
          {navLinks.map((navLink) => (
            // Hangi sayfadaysak geçerli sayfanın li etiketi rengi değişiyor bu sayede hangi sayfa da olduğumuz anlıyoruz.
            <li
              key={navLink.id}
              className={` hover:text-blue-500  ${
                pathName === navLink.route ? 'text-blue-500' : ''
              }`}
            >
              <Link href={navLink.route} className="flex items-center gap-2">
                {navLink.title}
                <navLink.icon size={15} />
              </Link>
            </li>
          ))}
        </ul>
        <div
          className="relative flex flex-row-reverse gap-2 items-center cursor-pointer "
          onClick={() => setUserMenu(!userMenu)}
        >
          <Image src={userMenu ? UpArrow : DownArrow} width={15} height={15} />
          <p className="flex items-center gap-2 font-medium text-gray-600 ml-2">
            {user?.username}
          </p>
          {userMenu && (
            <div className="absolute bg-white shadow-xl w-36 p-4 right-5 top-10 border  z-40">
              <button
                onClick={handleLogout}
                className="hover:text-blue-500 z-50 relative flex gap-2 items-center text-sm"
              >
                <IoIosLogOut size={20} className="text-gray-600 font-medium" />
                <span className="font-medium text-gray-600">Çıkış Yap</span>
              </button>
            </div>
          )}
        </div>
        {navLinks.length > 0 && (
          <div className="md:hidden flex items-center gap-4">
            <button
              className="cursor-pointer"
              onClick={() => setToggleMobileMenu(!toggleMobileMenu)}
            >
              <Image src={BurgerMenu} className="w-6 h-6" alt="menu-icon" />
            </button>
            <MobileNav
              navLinks={navLinks}
              toggleMobileMenu={toggleMobileMenu}
              setToggleMobileMenu={setToggleMobileMenu}
            />
          </div>
        )}
      </div>
    </div>
  )
}
export default Navbar
