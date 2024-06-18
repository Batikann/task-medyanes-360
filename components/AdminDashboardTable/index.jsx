'use client'

import {
  priorityLocalization,
  taskStatusLocalization,
} from '../../lib/utils/localizationText'
import { formatDate } from '../../lib/utils/formatter'
import { checkPriority } from '../TaskCard'
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io'
import { filteredTaskFunc } from '../../lib/utils/filterUtils.js'

import {
  adminTableValues,
  adminTaskTabValues,
} from '../../lib/constants/tabsValues.js'
import Link from 'next/link'
import Loading from '../loading'
import { useEffect, useState } from 'react'

const Table = ({ tasks, setStatusType, statusType, loading, loading2 }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks)
  const [conditions, setConditions] = useState('')

  const [sortDirection, setSortDirection] = useState('desc') // initial sort direction

  useEffect(() => {
    setFilteredTasks(tasks)
  }, [tasks])

  useEffect(() => {
    filteredTaskFunc(conditions, tasks, setFilteredTasks, sortDirection)
  }, [conditions, tasks, sortDirection])

  // Function to toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="flex flex-col gap-8 mt-8">
      <div>
        <ul className="xl:flex items-center justify-between gap-5 grid grid-cols-1 sm:grid-cols-2   text-center">
          {adminTaskTabValues.map((val) => (
            <li
              className={`text-lg font-bold cursor-pointer transition-all duration-500 ease-in-out  ${
                statusType === val.route
                  ? 'text-blue-400'
                  : 'hover:text-blue-400 '
              }`}
              key={val.id}
              onClick={() => setStatusType(val.route)}
            >
              {val.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {adminTableValues.map((val) => (
                <th
                  key={val.id}
                  className="px-2 py-3 border-b border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-400 ease-in-out duration-500 transition-all"
                  onClick={() => {
                    if (conditions === val.conditions) {
                      toggleSortDirection() // Toggle sort direction on header click
                    }
                    setConditions(val.conditions) // Set conditions for sorting
                  }}
                >
                  <span className="w-full flex items-center justify-center gap-1">
                    {val.name}
                    {val.conditions != null &&
                      (conditions == 'desc' ? (
                        <IoMdArrowDropup size={20} />
                      ) : (
                        <IoMdArrowDropdown size={20} />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={adminTableValues.length} className="p-5">
                  <div className="flex justify-center items-center text-center">
                    <Loading />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {!loading2 && filteredTasks.length > 0 ? (
                filteredTasks?.map((task, index) => (
                  <tr
                    key={index}
                    className="bg-white even:bg-gray-50 text-center"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <p className="line-clamp-2">{task.description}</p>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                      <p
                        className={`flex items-center text-center justify-center py-2 px-4 rounded-lg ${checkPriority(
                          task.priority
                        )}`}
                      >
                        {priorityLocalization(task.priority)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {taskStatusLocalization(task.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(task.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <ul className="flex gap-1 flex-col">
                        {task.assignedUsers.map((user, i) => (
                          <li key={i}>{user.user.name}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {task.subtasks.length ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {task.comments.length ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-center">
                      <Link
                        className="bg-blue-600 hover:bg-blue-400 text-white py-2 px-3  font-bold rounded-md transition-all duration-500 ease-in-out"
                        href={`/admindashboard/task/${task.id}`}
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="py-4 text-center text-base font-semibold text-gray-500"
                  >
                    Herhangi bir veri bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  )
}

export default Table
