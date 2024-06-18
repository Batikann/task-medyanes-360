'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../../services/fetchAPI'

import { useRouter, useSearchParams } from 'next/navigation'
import { normalizeInput } from '../../../../lib/utils/formatter'
import SearchBar from '../../../../components/Searchbar/index'
import DashboardCard from '../../../../components/DashboardCard/index'
import AdminDashboardTable from '../../../../components/AdminDashboardTable/index'

const DashboardMainPage = () => {
  const [completedTaskCount, setCompletedTaskCount] = useState()
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [statusType, setStatusType] = useState('ALL')
  const [inProgressTaskCount, setInProgressTaskCount] = useState()
  const [allTaskCount, setAllTaskCount] = useState()
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(true)

  const router = useRouter() // Router nesnesi
  const searchParams = useSearchParams()

  useEffect(() => {
    const getTasks = async () => {
      const taskData = await getAPI(`/tasks/get-tasks`)
      if (taskData.status === 'success') {
        const { tasks } = taskData.data
        setTasks(tasks)
        setLoading(false)
      } else {
        // Hata varsa console ekranında göstericek
        console.error('Failed to fetch task counts')
      }
    }
    getTasks()
  }, [])

  useEffect(() => {
    // Veritabanından tüm tasklerin geçerli durumlara göre sayısını getiren fonksiyon
    const filterTasks = (tasks) => {
      try {
        const taskParam = statusType || 'ALL' // task parametresini alır, yoksa 'ALL' kullanır
        const queryParam = searchParams.get('query') || '' // query parametresini alır, yoksa boş string kullanır
        setLoading2(true)

        const normalizedQuery = queryParam.toLowerCase()

        const filtered = tasks.filter((task) => {
          const matchesStatus = taskParam === 'ALL' || task.status === taskParam
          const matchesQuery = normalizedQuery
            ? normalizeInput(task?.title)
                .toLowerCase()
                .includes(normalizedQuery) ||
              task.assignedUsers.some((user) =>
                normalizeInput(user.user?.name)
                  .toLowerCase()
                  .includes(normalizedQuery)
              )
            : true

          return matchesStatus && matchesQuery
        })

        setFilteredTasks(filtered) // Filtered task listesini günceller
        setLoading2(false) // Yüklenme durumunu false yapar
      } catch (error) {
        console.error('Error while filtering tasks:', error)
        setLoading(false) // Yüklenme durumunu false yapar
      }
    }

    filterTasks(tasks)
  }, [statusType, searchParams, tasks])

  useEffect(() => {
    const getDashboardCount = async () => {
      const dashboard = await getAPI('/tasks/get-task-dashboard')
      setCompletedTaskCount(dashboard.completedTaskCount)
      setInProgressTaskCount(dashboard.inProgressTaskCount)
      setAllTaskCount(dashboard.allTaskCount)
    }
    getDashboardCount()
  }, [])

  useEffect(() => {
    const handleURLUpdate = () => {
      const taskParam = normalizeInput(statusType) // task parametresini alır, yoksa 'ALL' kullanır
      const normalizedQuery = normalizeInput(inputValue) // Giriş değerini normalize eder
      if (normalizedQuery) {
        router.push(
          `/admindashboard?task=${taskParam}&query=${normalizedQuery}`,
          undefined,
          { shallow: true }
        ) // URL'yi query ile günceller
      } else {
        router.push(`/admindashboard?task=${taskParam}`, undefined, {
          shallow: true,
        }) // URL'yi query olmadan günceller
      }
    }

    const timer = setTimeout(handleURLUpdate, 500) // 500ms sonra URL'yi günceller

    return () => clearTimeout(timer) // Temizleme fonksiyonu
  }, [inputValue, router, searchParams, statusType])

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard
          bgColor={'bg-[#FFBF78]'}
          textColor={'text-[#FF7D29]'}
          title={'Toplam Proje'}
          count={allTaskCount}
        />
        <DashboardCard
          title={'Tamamlanan Proje'}
          count={completedTaskCount}
          bgColor={'bg-[#D0E7D2]'}
          textColor={'text-[#618264]'}
        />
        <DashboardCard
          title={'Devam Eden Proje'}
          bgColor={'bg-[#A7E6FF]'}
          textColor={'text-[#3572EF]'}
          count={inProgressTaskCount}
        />
      </div>
      <div className="mt-4">
        <SearchBar inputValue={inputValue} setInputValue={setInputValue} />
      </div>
      <AdminDashboardTable
        tasks={filteredTasks}
        loading={loading}
        setStatusType={setStatusType}
        statusType={statusType}
        loading2={loading2}
      />
    </div>
  )
}
export default DashboardMainPage
