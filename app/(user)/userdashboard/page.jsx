'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../services/fetchAPI'
import getUser from '../../../lib/utils/getUser.js'
import TaskCard from '../../../components/TaskCard'
import Loading from '../../../components/loading'

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

  if (loading) {
    return <Loading />
  }

  //Eğer kullanıcının görev aldığı bir task yok ise böyle bir mesaj gösterilir
  if (tasks.length <= 0) {
    return (
      <p className="h-screen w-screen flex justify-center  mt-5 font-semibold text-2xl">
        Task not found assigned to you !
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          route={`/userdashboard/task/${task.id}`}
        />
      ))}
    </div>
  )
}
export default UserDashboard
