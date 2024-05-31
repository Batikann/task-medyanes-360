'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAPI } from '../../../../services/fetchAPI/index.js'
import TaskList from '../../../../components/TaskList/index.jsx'
import Loading from '../../../../components/loading'
import { normalizeInput } from '../../../../lib/utils/formatter.js'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const [inputValue, setInputValue] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const getTasks = async () => {
      const taskParam = searchParams.get('task')?.toUpperCase() || 'ALL'
      const queryParam = searchParams.get('query') || ''
      setLoading(true)

      const taskData = await getAPI(`/tasks/${taskParam}/get-tasks`)
      const allTasks = taskData.data.tasks

      const filteredTasks = queryParam
        ? allTasks.filter(
            (task) =>
              normalizeInput(task.title)
                .toLowerCase()
                .includes(queryParam.toLowerCase()) ||
              task.assignedUsers.some((user) =>
                normalizeInput(user.user.username)
                  .toLowerCase()
                  .includes(queryParam.toLowerCase())
              )
          )
        : allTasks

      setTasks(filteredTasks)
      setLoading(false)
    }
    getTasks()
  }, [searchParams])

  useEffect(() => {
    const handleURLUpdate = () => {
      const taskParam = searchParams.get('task') || 'ALL'
      const normalizedQuery = normalizeInput(inputValue)
      if (normalizedQuery) {
        router.push(
          `/admindashboard/task?task=${taskParam}&query=${normalizedQuery}`,
          undefined,
          { shallow: true }
        )
      } else {
        router.push(`/admindashboard/task?task=${taskParam}`, undefined, {
          shallow: true,
        })
      }
    }

    const timer = setTimeout(handleURLUpdate, 500)

    return () => clearTimeout(timer)
  }, [inputValue, router, searchParams])

  // Eğer Veritabanında hiç task yoksa kullanıcıyı bu konuda bilgilendiririz.
  if (tasks.length <= 0 && !loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="text-center border-b pb-4">
          <input
            className="h-12 border w-80 px-4 rounded-full"
            type="text"
            placeholder="Search username or task name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <p>No valid task found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center border-b pb-4">
        <input
          className="h-12 border w-80 px-4 rounded-full"
          type="text"
          placeholder="Search username or task name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <TaskList tasks={tasks} loading={loading} />
    </div>
  )
}

export default TasksPage
