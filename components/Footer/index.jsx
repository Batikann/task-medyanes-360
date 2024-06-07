import Link from 'next/link'
import { socialMediaLinks } from '../../lib/constants/footerLinks'
import Image from 'next/image'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className=" text-slate-200 py-8 border-t shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex md:justify-between items-center md:flex-row-reverse flex-col-reverse gap-4 ">
          {/* Social Media Links */}
          <div className="flex space-x-6">
            {socialMediaLinks.map((link) => (
              <Link
                href={link.route}
                target="_blank"
                className="hover:text-gray-400 relative transition-all ease-in-out duration-500 transform hover:scale-125"
                key={link.id}
              >
                <Image
                  src={link.icon}
                  width={32}
                  height={32}
                  alt={link.route}
                />
              </Link>
            ))}
          </div>
          {/* Designed by Text */}
          <div className="text-base font-semibold text-gray-500">
            Designed by BatikDev © {currentYear}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
