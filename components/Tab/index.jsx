const Tab = ({ page, setPage }) => {
  return (
    <div className="flex gap-5 items-center">
      <button
        className={`bg-gray-200 py-2 px-3 rounded-t-md hover:text-blue-600 ${
          page === 'Task Detail'
            ? 'text-blue-600 border-b-blue-600 border-b-2'
            : ''
        }`}
        onClick={() => setPage('Task Detail')}
      >
        Görev Detay
      </button>
      <button
        className={`bg-gray-200 py-2 px-3 rounded-t-md hover:text-blue-600 ${
          page === 'Activities/Timeline'
            ? 'text-blue-600 border-b-blue-600 border-b-2'
            : ''
        }`}
        onClick={() => setPage('Activities/Timeline')}
      >
        Faaliyetler/Zaman Çizelgesi
      </button>
    </div>
  )
}
export default Tab
