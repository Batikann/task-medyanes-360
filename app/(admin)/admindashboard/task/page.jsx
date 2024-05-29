'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../../services/fetchAPI/index.js'
import TaskCard from '../../../../components/TaskCard/index.jsx'

import Loading from '../../../../components/loading'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  //
  useEffect(() => {
    const getTasks = async () => {
      const taskData = await getAPI('/tasks/get-tasks')
      setTasks(taskData.data.tasks)
      setLoading(false)
    }
    getTasks()
  }, [])

  //Tasklerimiz gelene kadar kullancıyı göstermek üzere bir loading efekti
  if (loading) {
    return <Loading />
  }

  //Eğer Veritabanında hiç task yoksa kullanıcıyı bu konuda bilgilendiririz.
  if (tasks.length <= 0) {
    return <p>No valid task found</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-5 ">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          route={`/admindashboard/task/${task.id}`}
        />
      ))}
    </div>
  )
}
export default TasksPage
