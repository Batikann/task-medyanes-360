import { FaSpinner } from 'react-icons/fa' // FaSpinner veya başka bir spinner ikonunu kullanabilirsiniz

const Button = ({ props, title }) => {
  return (
    <button
      type="submit"
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-base font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 transition-all ease-in-out duration-500 transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      disabled={props.isSubmitting}
    >
      {props.isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : title}
    </button>
  )
}

export default Button
