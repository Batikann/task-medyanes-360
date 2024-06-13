'use client'

import {
  priorityLocalization,
  taskStatusLocalization,
} from '../../lib/utils/localizationText'
import { formatDate } from '../../lib/utils/formatter'
import { checkPriority } from '../TaskCard'

import {
  adminTableValues,
  adminTaskTabValues,
} from '../../lib/constants/tabsValues.js'
import Link from 'next/link'
import Loading from '../loading'

const Table = ({ tasks, setStatusType, statusType, loading, loading2 }) => {
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
                  className="px-6 py-3 border-b border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {val.name}
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
              {!loading2 && tasks.length > 0 ? (
                tasks?.map((task, index) => (
                  <tr
                    key={index}
                    className="bg-white even:bg-gray-50 text-center"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {task.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.title}
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
