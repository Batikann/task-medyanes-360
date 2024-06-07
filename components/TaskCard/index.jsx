import Link from 'next/link'
import { formatDate } from '../../lib/utils/formatter.js'
import { FaCalendar } from 'react-icons/fa'
import { GrAttachment } from 'react-icons/gr'
import { BiSolidComment } from 'react-icons/bi'
import {
  priorityLocalization,
  taskStatusLocalization,
} from '../../lib/utils/localizationText.js'
//Taskimiziz önem derecesine göre önem alanının arka plan rengini değiştiriyoruz
export const checkPriority = (priority) => {
  switch (priority) {
    case 'LOW':
      return ' bg-[#CDFAD5] text-[#799351]  '
    case 'MEDIUM':
      return ' bg-[#FFCF96] text-[#FF9A00]'
    case 'HIGH':
      return ' bg-[#EF9595] text-[#FF0000] '
    default:
      return ''
  }
}

const TaskCard = ({ task, route }) => {
  return (
    <Link
      href={route}
      className="border p-4 hover:border-blue-600 flex flex-col gap-3 shadow-lg cursor-pointer rounded-xl hover:scale-105 items-start md:items-stretch transition-all ease-in-out duration-500 transform"
    >
      <div className="flex   flex-col  gap-3 items-start flex-wrap justify-between">
        <p
          className={`${checkPriority(
            task.priority
          )}  p-[7px] px-3 text-sm rounded-full font-bold`}
        >
          <span>{priorityLocalization(task.priority)}</span> ÖNCELİK
        </p>
        <h2 className="text-2xl font-bold hover:text-blue-600 transition-all ease-in-out duration-500 transform">
          {task.title}
        </h2>
      </div>
      <div>
        <p className="text-lg line-clamp-3">{task.description}</p>
      </div>
      <p className="flex items-center">
        <span className="font-bold mr-2">Durum:</span>
        {taskStatusLocalization(task.status)}
      </p>
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-500">
          <FaCalendar />
          <p>{formatDate(task.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <GrAttachment />
          <p>{task.subtasks.length ?? 0}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <BiSolidComment />
          <p>{task.comments.length ?? 0}</p>
        </div>
      </div>
    </Link>
  )
}
export default TaskCard
