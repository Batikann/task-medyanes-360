'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../services/fetchAPI'
import getUser from '../../../lib/utils/getUser.js'
import TaskList from '../../../components/TaskList'
import Dropdown from '../../../components/Dropdown'
import { taskStatus } from '../../../lib/constants/taskStatus'

const UserDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState(taskStatus[0].name)
  //Giriş yapan kullanıcının bilgilerini getiren fonksiyonumuz
  const user = getUser()

  useEffect(() => {
    //Gelen kullanıcı bilgilerine göre o kullanıcının görev aldığı taskleri getiren fonksiyonumuz
    const getTaskForUser = async () => {
      try {
        const res = await getAPI(
          `/tasks/${user.id}/get-tasks-user?status=${selectedStatus}`
        )

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
  }, [selectedStatus])

  //Eğer kullanıcının görev aldığı bir task yok ise böyle bir mesaj gösterilir
  if (tasks.length <= 0 && !loading) {
    return (
      <p className="h-screen w-screen flex justify-center  mt-5 font-semibold text-2xl">
        Task not found assigned to you !
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex justify-end">
        <Dropdown
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          taskStatus={taskStatus}
        />
      </div>
      <TaskList tasks={tasks} dashboard={'userdashboard'} loading={loading} />
    </div>
  )
}
export default UserDashboard
