'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../../services/fetchAPI/index.js'
import TaskCard from '../../../../components/TaskCard/index.jsx'

import Loading from '../../../../components/loading'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    const getTasks = async () => {
      const taskData = await getAPI('/tasks/get-tasks')
      setTasks(taskData.data.tasks)
    }
    getTasks()
  }, [])

  if (tasks.length <= 0) {
    return <Loading />
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
