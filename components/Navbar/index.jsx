'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import getUser from '../../lib/utils/getUser'
import { useEffect, useState } from 'react'
import MobileNav from '../MobileNav'
import BurgerMenu from '/public/burger-menu.svg'
import Image from 'next/image'

const Navbar = ({ title, navLinks, route }) => {
  const [userMenu, setUserMenu] = useState(false)
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false)
  const user = getUser()
  const router = useRouter()
  const pathName = usePathname()
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
        <div className="relative">
          <p
            className="font-bold text-gray-500 text-lg cursor-pointer "
            onClick={() => setUserMenu(!userMenu)}
          >
            {user.username}
          </p>
          {userMenu && (
            <div className="absolute bg-white shadow-md w-28 p-4 right-5 top-10  z-40">
              <button
                onClick={handleLogout}
                className="hover:text-blue-500 z-50 relative"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <ul className=" gap-4 items-center hidden md:flex">
          {navLinks.map((navLink) => (
            <li
              key={navLink.id}
              className={` hover:text-blue-500  ${
                pathName === navLink.route ? 'text-blue-500' : ''
              }`}
            >
              <Link href={navLink.route}>{navLink.title}</Link>
            </li>
          ))}
        </ul>
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
