const ChangePageButton = ({ title, onClick, pageName }) => {
  return (
    <button
      className={`bg-gray-200 py-2 px-3 rounded-t-md hover:text-blue-600 ${
        page == { pageName } ? 'text-blue-600 border-b-blue-600 border-b-2' : ''
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  )
}
export default ChangePageButton
