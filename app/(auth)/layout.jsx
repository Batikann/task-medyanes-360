import Image from 'next/image'
import AuthImage from '/public/auth-page-image.jpg'

const AuthLayout = ({ children }) => {
  return (
    <div className=" flex justify-center items-center h-screen bg-gray-100 ">
      <div className="w-1/2  h-screen hidden xl:block relative">
        <Image
          src={AuthImage}
          alt="Placeholder Image"
          className=" w-full h-full object-cover"
          quality={100}
        />
      </div>
      <div className="xl:p-44 md:p-52 sm:20 p-8 w-full xl:w-1/2">
        {children}
      </div>
    </div>
  )
}
export default AuthLayout
