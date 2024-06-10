'use client'

import {
  priorityLocalization,
  taskStatusLocalization,
} from '../../lib/utils/localizationText'
import { formatDate } from '../../lib/utils/formatter'
import { checkPriority } from '../TaskCard'
import { useRouter } from 'next/navigation'
import {
  adminTableValues,
  adminTaskTabValues,
} from '../../lib/constants/tabsValues.js'
import Link from 'next/link'

const Table = ({ tasks, setStatusType, statusType }) => {
  if (!tasks) {
    return (
      <div className="w-full h-full flex justify-center mt-20">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
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
                  className="px-6 py-3 border-b border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {val.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks?.map((task, index) => (
                <tr
                  key={index}
                  className="bg-white even:bg-gray-50 cursor-pointer"
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
        </table>
      </div>
    </div>
  )
}

export default Table
