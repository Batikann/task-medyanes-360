import Image from 'next/image'
import SearchIcon from '/public/search.svg'

const SearchBar = ({ setInputValue, inputValue }) => {
  return (
    <div className="text-center border-b pb-4 relative">
      <div className="relative inline-flex items-center">
        <div className="absolute left-3">
          <div className="w-6 h-6">
            <Image src={SearchIcon} fill />
          </div>
        </div>
        <input
          className="h-12 border w-80 pl-10 pr-4 rounded-full"
          type="text"
          placeholder="Search username or task name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </div>
  )
}
export default SearchBar
