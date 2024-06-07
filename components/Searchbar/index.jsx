import Image from 'next/image'
import SearchIcon from '/public/search.svg'

const SearchBar = ({ setInputValue, inputValue }) => {
  return (
    <div className="text-center lg:text-start border-b border-b-slate-400 pb-4 relative">
      <div className="relative inline-flex items-center">
        <div className="absolute left-3">
          <div className="w-6 h-6">
            <Image src={SearchIcon} fill />
          </div>
        </div>
        <input
          className="h-12 border w-96 md:w-[500px] pl-12 pr-4 rounded-full border-slate-500"
          type="text"
          placeholder="Kullanıcı adını veya görev adını ara."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </div>
  )
}
export default SearchBar
