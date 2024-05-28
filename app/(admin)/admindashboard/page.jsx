'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../services/fetchAPI'
import DashboardCard from '../../../components/DashboardCard/index'

const AdminDashboard = () => {
  const [completedTaskCount, setCompletedTaskCount] = useState()
  const [inProgressTaskCount, setInProgressTaskCount] = useState()
  const [allTaskCount, setAllTaskCount] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
          // Handle error case
          console.error('Failed to fetch task counts')
        }
      } catch (error) {
        // Handle network or other errors
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
