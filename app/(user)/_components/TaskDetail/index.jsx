'use client'

import checkPriority from '../../../../lib/utils/checkPriority'
import { formatDate } from '../../../../lib/utils/formatter'
import Button from '../../../../components/Buttons/Button'
import { useState } from 'react'
import { postAPI } from '../../../../services/fetchAPI'

const TaskDetail = ({
  taskDetail,
  setPage,
  page,
  setRefreshPage,
  refreshPage,
}) => {
  const [subtasks, setSubtasks] = useState(taskDetail.subtasks)

  const handleStatusToggle = async (subtaskId, currentStatus) => {
    const newStatus = !currentStatus
    const data = { subtaskId, status: newStatus }
    try {
      const res = await postAPI('/tasks/subtask/update-subtask-status', data)

      if (res.status === 'success') {
        setSubtasks((prevSubtasks) =>
          prevSubtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, status: newStatus }
              : subtask
          )
        )
        setRefreshPage(!refreshPage)
      } else {
        console.error('Failed to update subtask status')
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const completedSubtasks = subtasks.filter((subtask) => subtask.status).length
  const totalSubtasks = subtasks.length
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
            <p
              className={`${checkPriority(
                taskDetail.priority
              )} text-white p-2 px-4 text-sm rounded-full font-bold`}
            >
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
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold uppercase">Sub-Tasks</h2>
          <span className="text-xl font-bold">
            {completedSubtasks}/{totalSubtasks}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {taskDetail.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex flex-col gap-2 items-start border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <p>Last Date: {formatDate(subtask.createdAt)}</p>
                <p
                  className={` p-1 px-2 text-sm font-semibold text-white rounded-lg ${
                    subtask.status ? 'bg-green-400' : 'bg-orange-300'
                  }`}
                >
                  {subtask.status ? 'done' : 'in progress'}
                </p>
              </div>
              <p>{subtask.title}</p>
              <Button
                title={
                  subtask.status ? 'Subtask as not done' : 'Subtask as done'
                }
                className={`bg-gray-200 p-2 px-4 rounded-lg font-semibold text-sm text-gray-600  hover:text-white ${
                  subtask.status ? 'hover:bg-red-400' : 'hover:bg-green-400'
                }`}
                onClick={() => handleStatusToggle(subtask.id, subtask.status)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default TaskDetail
