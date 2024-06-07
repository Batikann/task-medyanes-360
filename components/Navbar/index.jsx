'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import getUser from '../../lib/utils/getUser'
import { useState } from 'react'
import MobileNav from '../MobileNav'
import BurgerMenu from '/public/burger-menu.svg'
import Image from 'next/image'
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md'
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
    <div className="   border-b shadow-md p-7   w-full">
      <div className="max-w-[1540px] mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          <Link href={route} className="flex items-center gap-2">
            <div>
              Task<span className="text-blue-700 font-bold">Manager</span>
            </div>
            <span className="hidden md:block">- {title}</span>
          </Link>
        </h1>
        <div className="flex items-center gap-3 ">
          <ul className=" gap-6 items-center hidden md:flex font-medium text-gray-600">
            {navLinks.map((navLink) => (
              // Hangi sayfadaysak geçerli sayfanın li etiketi rengi değişiyor bu sayede hangi sayfa da olduğumuz anlıyoruz.
              <li
                key={navLink.id}
                className={` hover:text-blue-500 transition-all duration-500 ease-in-out  ${
                  pathName === navLink.route ? 'text-blue-500' : ''
                }`}
              >
                <Link href={navLink.route} className="flex items-center gap-3">
                  {navLink.title}
                  <navLink.icon size={20} />
                </Link>
              </li>
            ))}
          </ul>
          <div
            className="relative flex flex-row-reverse gap-2 items-center cursor-pointer "
            onClick={() => setUserMenu(!userMenu)}
          >
            <div className="flex gap-1 group">
              <p className="flex items-center gap-2 font-medium text-gray-600 ml-2 group-hover:text-blue-500 transition-all duration-500 ease-in-out">
                {user?.username}
              </p>
              {!userMenu ? (
                <MdArrowDropDown
                  size={25}
                  className="group-hover:text-blue-500 transition-all duration-500 ease-in-out"
                />
              ) : (
                <MdArrowDropUp
                  size={25}
                  className="group-hover:text-blue-500 transition-all duration-500 ease-in-out hover:scale-105"
                />
              )}
            </div>
            {userMenu && (
              <div className="absolute bg-white shadow-xl w-36 p-4 -right-5 top-10 border  z-40">
                <button
                  onClick={handleLogout}
                  className="group relative flex gap-2 items-center text-sm z-50"
                >
                  <span className="font-medium text-gray-600 group-hover:text-red-500">
                    Çıkış Yap
                  </span>
                  <IoIosLogOut
                    size={20}
                    className="text-gray-600 font-medium group-hover:text-red-500"
                  />
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
    </div>
  )
}
export default Navbar
