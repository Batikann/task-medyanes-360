'use client'

import SearchBar from '../../../../components/Searchbar/index'
import DashboardCard from '../../../../components/DashboardCard/index'
import AdminDashboardTable from '../../../../components/AdminDashboardTable/index'
const DashboardPage = ({
  allTaskCount,
  completedTaskCount,
  inProgressTaskCount,
  inputValue,
  setInputValue,
  tasks,
  loading,
  setStatusType,
  statusType,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard
          bgColor={'bg-[#FEECE2]'}
          textColor={'text-[#FFBE98]'}
          title={'Toplam Görev'}
          count={allTaskCount}
        />
        <DashboardCard
          title={'Tamamlanan Görev'}
          count={completedTaskCount}
          bgColor={'bg-[#D0E7D2]'}
          textColor={'text-[#618264]'}
        />
        <DashboardCard
          title={'Devam Eden Görev'}
          bgColor={'bg-[#FEECE2]'}
          textColor={'text-[#FFBE98]'}
          count={inProgressTaskCount}
        />
      </div>
      <div className="mt-4">
        <SearchBar inputValue={inputValue} setInputValue={setInputValue} />
      </div>
      <AdminDashboardTable
        tasks={tasks}
        loading={loading}
        setStatusType={setStatusType}
        statusType={statusType}
      />
    </div>
  )
}
export default DashboardPage
