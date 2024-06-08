'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../services/fetchAPI'
import getUser from '../../../lib/utils/getUser.js'
import { priorityTabForUser } from '../../../lib/constants/tabsValues'
import TaskColumn from '../../../components/TaskColumn'

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

  //Giriş yapan kullanıcının bilgilerini getiren fonksiyonumuz
  const user = getUser()

  useEffect(() => {
    //Gelen kullanıcı bilgilerine göre o kullanıcının görev aldığı taskleri getiren fonksiyonumuz
    const getTaskForUser = async () => {
      try {
        const res = await getAPI(`/tasks/${user.id}/get-tasks-user`)
        if (res.status === 'success') {
          setTasks(res.tasks)
        } else {
          throw new Error(res.message)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getTaskForUser()
  }, [])

  //Eğer kullanıcının görev aldığı bir task yok ise böyle bir mesaj gösterilir
  if (tasks.length <= 0 && !loading) {
    return (
      <div>
        <p className="h-screen w-screen flex justify-center  mt-5 font-semibold text-2xl">
          Herhangi bir göreviniz yok!
        </p>
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
