'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../../../services/fetchAPI'
import Loading from '../../../../../components/loading'
import checkPriority from '../../../../../lib/utils/checkPriority'
import { formatDate } from '../../../../../lib/utils/formatter'
import Button from '../../../../../components/Buttons/Button'

const TaskDetailPage = ({ params }) => {
  const [taskDetail, setTaskDetail] = useState([])
  useEffect(() => {
    const getTaskDetail = async () => {
      const res = await getAPI(`/tasks/${params.id}/get-task`)
      setTaskDetail(res.task)
      console.log(res.task)
    }

    getTaskDetail()
  }, [])

  if (taskDetail.length <= 0) {
    return <Loading />
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b flex flex-col gap-4 pb-4">
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4 ">
            <h1 className="text-4xl font-bold">{taskDetail.title}</h1>
            <p className={checkPriority(taskDetail.priority)}>
              {taskDetail.priority} <span>PRIORITY</span>
            </p>
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
                <p className="text-sm text-gray-500">{teamMember.user.email}</p>
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
              <Button
                title={'SubTask as done'}
                className={
                  'bg-gray-200 p-2 px-4 rounded-lg font-semibold text-sm text-gray-600 hover:bg-green-400 hover:text-white'
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default TaskDetailPage
