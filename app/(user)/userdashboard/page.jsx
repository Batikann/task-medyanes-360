'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../services/fetchAPI'
import { priorityTabForUser } from '../../../lib/constants/tabsValues'
import TaskColumn from '../../../components/TaskColumn'
import { useSession } from 'next-auth/react'
import Loading from '../../../components/loading'

function getTasksByPriority(allTasks, priority) {
  switch (priority) {
    case 'LOW':
      return allTasks.lowPriorityTasks
    case 'MEDIUM':
      return allTasks.mediumPriorityTasks
    case 'HIGH':
      return allTasks.highPriorityTasks
    default:
      return []
  }
}

const UserDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()

  useEffect(() => {
    //Gelen kullanıcı bilgilerine göre o kullanıcının görev aldığı taskleri getiren fonksiyonumuz
    const getTaskForUser = async () => {
      try {
        const res = await getAPI(`/tasks/${session.user.id}/get-tasks-user`)

        if (res.status === 'success') {
          setTasks(res.tasks)
          setLoading(false)
        } else {
          throw new Error(res.message)
        }
      } catch (error) {
        console.error(error)
      }
    }

    getTaskForUser()
  }, [session])

  //Eğer kullanıcının görev aldığı bir task yok ise böyle bir mesaj gösterilir
  if (tasks.length <= 0) {
    return (
      <div className="   mt-5 ">
        <Loading />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
      {priorityTabForUser.map((priority) => (
        <TaskColumn
          priority={priority}
          tasks={getTasksByPriority(tasks, priority.priority)}
          loading={loading}
        />
      ))}
    </div>
  )
}
export default UserDashboard
