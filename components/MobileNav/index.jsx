import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const MobileNav = ({ navLinks, toggleMobileMenu, setToggleMobileMenu }) => {
  const pathName = usePathname()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Eğer tıklanan element MobileNav bileşeninin içinde değilse ve mobil menü açıksa,
      // mobil menüyü kapat.
      if (!event.target.closest('.absolute.top-0') && toggleMobileMenu) {
        setToggleMobileMenu(false)
      }
    }

    // Dışarı tıklandığında olay dinleyiciyi etkinleştir.
    document.addEventListener('mousedown', handleOutsideClick)

    // Temizlik işlevi: bileşen kaldırıldığında olay dinleyicisini kaldır.
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [toggleMobileMenu, setToggleMobileMenu])

  const handleLinkClick = () => {
    // Bağlantıya tıklandığında mobil menüyü kapat.
    setToggleMobileMenu(false)
  }
  return (
    <div
      className={`absolute top-0  bg-white h-screen w-[300px] shadow-md p-4 duration-500 z-50   ${
        toggleMobileMenu ? 'right-0 ' : '-right-80 '
      }`}
    >
      <div className="mt-5 relative">
        <ul className="flex flex-col gap-3">
          {navLinks.map((navLink) => (
            <li
              key={navLink.id}
              className={`text-lg font-bold hover:text-blue-500  ${
                pathName === navLink.route ? 'text-blue-500' : ''
              }`}
            >
              <Link onClick={handleLinkClick} href={navLink.route}>
                {navLink.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="absolute top-3 right-5 text-xl font-bold cursor-pointer"
        onClick={() => setToggleMobileMenu(!toggleMobileMenu)}
      >
        x
      </div>
    </div>
  )
}
export default MobileNav
