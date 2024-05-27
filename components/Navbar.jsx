import Link from 'next/link'
import { useRouter } from 'next/navigation'
import getUser from '../lib/utils/getUser'

const Navbar = ({ title, navLinks, route }) => {
  const user = getUser()
  const router = useRouter()
  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }
  return (
    <div className="  flex justify-between items-center border-b shadow-md p-7">
      <h1 className="text-xl font-semibold">
        <Link href={route}>
          Task<span className="text-blue-700 font-bold">Manager</span> - {title}
        </Link>
      </h1>
      <div className="flex items-center gap-3">
        <ul className="flex gap-4 items-center">
          <li className="font-bold text-gray-500 text-lg">{user.username}</li>
          {navLinks.map((navLink) => (
            <li key={navLink.id}>
              <Link href={navLink.route}>{navLink.title}</Link>
            </li>
          ))}

          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  )
}
export default Navbar
