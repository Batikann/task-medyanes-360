'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../services/fetchAPI'
import DashboardCard from '../../../components/DashboardCard/index'
import { useNotification } from '../../../context/NotificationContext '

const AdminDashboard = () => {
  const [completedTaskCount, setCompletedTaskCount] = useState()
  const [inProgressTaskCount, setInProgressTaskCount] = useState()
  const [allTaskCount, setAllTaskCount] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //Veritabanından tüm tasklerin geçerli durumlara göre sayısını getiren fonksiyon
    const fetchTaskCounts = async () => {
      try {
        const taskData = await getAPI('/tasks/get-tasks')
        if (taskData.status === 'success') {
          const { completedTaskCount, inProgressTaskCount, allTaskCount } =
            taskData.data
          setCompletedTaskCount(completedTaskCount)
          setInProgressTaskCount(inProgressTaskCount)
          setAllTaskCount(allTaskCount)
          setLoading(false)
        } else {
          // Hata varsa console ekranında göstericek
          console.error('Failed to fetch task counts')
        }
      } catch (error) {
        // Ağ hatasını kontrol etmek için
        console.error('Error while fetching task counts:', error)
      }
    }

    fetchTaskCounts()
  }, [])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <DashboardCard title={'Total Task'} count={allTaskCount} />
      <DashboardCard title={'Completed Task'} count={completedTaskCount} />
      <DashboardCard title={'TASK IN PROGRESS'} count={inProgressTaskCount} />
    </div>
  )
}
export default AdminDashboard
