'use client'

import { useEffect, useState } from 'react'
import { getAPI, postAPI } from '../../../../../services/fetchAPI/index.js'
import Loading from '../../../../../components/loading/index.jsx'
import { formatDate } from '../../../../../lib/utils/formatter.js'
import Button from '../../../../../components/Buttons/Button'
import { useRouter } from 'next/navigation'
import checkPriority from '../../../../../lib/utils/checkPriority.js'
import Comments from '../../../../(user)/_components/Comments/index.jsx'

const TaskPage = ({ params }) => {
  const [taskDetail, setTaskDetail] = useState([])
  const [page, setPage] = useState('Task Detail')
  const router = useRouter()
  useEffect(() => {
    const getTask = async () => {
      const res = await getAPI(`/tasks/${params.id}/get-task`)
      setTaskDetail(res.task)
    }
    getTask()
  }, [])
  if (taskDetail.length <= 0) {
    return <Loading />
  }

  const deleteTaskHandler = async (id) => {
    const res = await postAPI(`/tasks/delete-task`, { id })
    if (res.status === 'success') {
      router.push('/admindashboard/task')
    }
  }

  const updateTaskHandler = async (id) => {
    router.push(`/admindashboard/task/${id}/update-task`)
  }

  if (page === 'Task Detail') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-5 items-center">
          <button
            className={`bg-gray-200 py-2 px-3 rounded-t-md hover:text-blue-600 ${
              page === 'Task Detail'
                ? 'text-blue-600 border-b-blue-600 border-b-2'
                : ''
            }`}
            onClick={() => setPage('Task Detail')}
          >
            Task Detail
          </button>
          <button
            className={`bg-gray-200 py-2 px-3 rounded-t-md hover:text-blue-600 ${
              page === 'Activities/Timeline'
                ? 'text-blue-600 border-b-blue-600 border-b-2'
                : ''
            }`}
            onClick={() => setPage('Activities/Timeline')}
          >
            Activities/Timeline
          </button>
        </div>
        <div className="border-b flex flex-col gap-4 pb-4">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4 ">
              <h1 className="text-4xl font-bold">{taskDetail.title}</h1>
              <p className={checkPriority(taskDetail.priority)}>
                {taskDetail.priority} <span>PRIORITY</span>
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                title={'Update'}
                className={
                  'bg-blue-500 text-white p-2 px-4 text-sm rounded-lg hover:bg-blue-400 font-semibold'
                }
                onClick={() => updateTaskHandler(taskDetail.id)}
              />

              <Button
                title={'Delete'}
                className={
                  'bg-red-500 text-white p-2 px-4 text-sm rounded-lg hover:bg-red-400 font-semibold'
                }
                onClick={() => deleteTaskHandler(taskDetail.id)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p>Created Date : {formatDate(taskDetail.createdAt)}</p>
            <p className="font-bold ">
              Status:
              <span className="text-lg font-medium ml-2">
                {taskDetail.status}
              </span>
            </p>
          </div>
          <p className="text-lg">{taskDetail.description}</p>
        </div>
        <div className="flex flex-col gap-4 border-b pb-4">
          <h2 className="uppercase text-2xl font-semibold">Team</h2>
          <div className="flex flex-col gap-3">
            {taskDetail.assignedUsers.map((teamMember) => (
              <div className="flex items-center gap-3" key={teamMember.user.id}>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex justify-center items-center">
                  <span className="text-white font-bold uppercase">
                    {teamMember.user.username.slice(0, 1)}
                  </span>
                </div>
                <div>
                  <p>{teamMember.user.username}</p>
                  <p className="text-sm text-gray-500">
                    {teamMember.user.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold uppercase">Sub-Tasks</h2>
          <div className="flex flex-col gap-2">
            {taskDetail.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex flex-col gap-2 items-start border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <p>Last Date: {formatDate(subtask.createdAt)}</p>
                  <p className="bg-orange-300 p-1 px-2 text-sm font-semibold text-white rounded-lg  ">
                    {subtask.status ? 'done' : 'in progress'}
                  </p>
                </div>
                <p>{subtask.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-5 items-center">
          <button
            className={`bg-gray-200 py-2 px-3 rounded-t-md hover:text-blue-600 ${
              page === 'Task Detail'
                ? 'text-blue-600 border-b-blue-600 border-b-2'
                : ''
            }`}
            onClick={() => setPage('Task Detail')}
          >
            Task Detail
          </button>
          <button
            className={`bg-gray-200 py-2 px-3 rounded-t-md hover:text-blue-600 ${
              page === 'Activities/Timeline'
                ? 'text-blue-600 border-b-blue-600 border-b-2'
                : ''
            }`}
            onClick={() => setPage('Activities/Timeline')}
          >
            Activities/Timeline
          </button>
        </div>
        <div className="flex  justify-between gap-12">
          <Comments taskId={taskDetail.id} />
        </div>
      </div>
    )
  }
}
export default TaskPage
