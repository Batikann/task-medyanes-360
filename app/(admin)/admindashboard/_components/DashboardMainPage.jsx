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
  const [inputValue, setInputValue] = useState('')
  const [statusType, setStatusType] = useState('ALL')
  const [inProgressTaskCount, setInProgressTaskCount] = useState()
  const [allTaskCount, setAllTaskCount] = useState()
  const [loading, setLoading] = useState(true)
  const router = useRouter() // Router nesnesi
  const searchParams = useSearchParams()

  useEffect(() => {
    //Veritabanından tüm tasklerin geçerli durumlara göre sayısını getiren fonksiyon
    const getTasks = async () => {
      try {
        const taskParam = statusType // task parametresini alır, yoksa 'ALL' kullanır
        const queryParam = searchParams.get('query') || '' // query parametresini alır, yoksa boş string kullanır
        setLoading(true)
        const taskData = await getAPI(`/tasks/${taskParam}/get-tasks`)
        if (taskData.status === 'success') {
          const { tasks } = taskData.data

          const filteredTasks = queryParam
            ? tasks.filter(
                (task) =>
                  normalizeInput(task?.title)
                    .toLowerCase()
                    .includes(queryParam.toLowerCase()) || // Başlıkta arama yapar
                  task.assignedUsers.some(
                    (user) =>
                      normalizeInput(user.user?.name)
                        .toLowerCase()
                        .includes(queryParam.toLowerCase()) // Kullanıcı adında arama yapar
                  )
              )
            : tasks // Filtrelenmiş task listesini oluşturur

          setTasks(filteredTasks) // Task listesini günceller
          setLoading(false) // Yüklenme durumunu false yapar
        } else {
          // Hata varsa console ekranında göstericek
          console.error('Failed to fetch task counts')
        }
      } catch (error) {
        // Ağ hatasını kontrol etmek için
        console.error('Error while fetching task counts:', error)
      }
    }

    getTasks()
  }, [searchParams])

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
          bgColor={'bg-[#A7E6FF]'}
          textColor={'text-[#3572EF]'}
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
export default DashboardMainPage
