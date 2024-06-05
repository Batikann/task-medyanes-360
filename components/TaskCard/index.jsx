import Link from 'next/link'
import { formatDate, priorityLocalization } from '../../lib/utils/formatter.js'
import { FaCalendar } from 'react-icons/fa'
import { GrAttachment } from 'react-icons/gr'
import { BiSolidComment } from 'react-icons/bi'
//Taskimiziz önem derecesine göre önem alanının arka plan rengini değiştiriyoruz
const checkPriority = (priority) => {
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

const taskStatusLocalization = (status) => {
  switch (status) {
    case 'COMPLETED_CHECK_PENDING':
      return (
        <p>
          <span className="mr-2 font-bold">Durum:</span>Proje bitti kontrol
          bekliyor
        </p>
      )
    case 'IN_PROGRESS':
      return (
        <p>
          <span className="mr-2 font-bold">Durum:</span>Çalışma devam ediyor
        </p>
      )
    case 'UPDATE_PENDING':
      return (
        <p>
          <span className="mr-2 font-bold">Durum:</span>Güncelleme için bilgi
          bekliyor
        </p>
      )
    case 'INFO_REQUEST_PENDING':
      return (
        <p>
          <span className="font-bold mr-2">Durum:</span>Eksik bilgi olabilir
          bilgi
        </p>
      )
    case 'CUSTOMER_WAITING':
      return (
        <p>
          <span className="font-bold mr-2">Durum:</span>Müşteri kontrolü
          bekliyor
        </p>
      )
    default:
      return 'Bilinmeyen durum'
  }
}

const TaskCard = ({ task, route }) => {
  return (
    <Link
      href={route}
      className="border p-4 flex flex-col gap-3 hover:shadow-md cursor-pointer rounded-md hover:scale-105 items-start md:items-stretch transition-all ease-in-out duration-500 transform"
    >
      <div className="flex   flex-col  gap-3 items-start flex-wrap">
        <p
          className={`${checkPriority(
            task.priority
          )} text-white p-[7px] px-3 text-sm rounded-full font-bold`}
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
      <p>{taskStatusLocalization(task.status)}</p>
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
