'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import MobileNav from '../MobileNav'
import BurgerMenu from '/public/burger-menu.svg'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import DropdownNavbar from '../../components/DropdownNavbar'
import Loading from '../loading'

const Navbar = ({ title, navLinks, route }) => {
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false)

  const handleLogout = () => {
    signOut()
  }

  const pathName = usePathname()

  const { data: session, status } = useSession()

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
          {status === 'authenticated' ? (
            <DropdownNavbar
              name={session.user.name}
              logoutFunc={handleLogout}
            />
          ) : (
            <Loading width={'h-6'} height={'h-6'} />
          )}
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
