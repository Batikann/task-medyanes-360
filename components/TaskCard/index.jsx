import Link from 'next/link'
import { formatDate, priorityLocalization } from '../../lib/utils/formatter.js'

//Taskimiziz önem derecesine göre önem alanının arka plan rengini değiştiriyoruz
const checkPriority = (priority) => {
  switch (priority) {
    case 'LOW':
      return ' bg-green-500 '
    case 'MEDIUM':
      return ' bg-orange-600 '
    case 'HIGH':
      return ' bg-red-600 '
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
      className="border p-4 flex flex-col gap-3 hover:shadow-md cursor-pointer rounded-md hover:scale-105 items-start md:items-stretch"
    >
      <div className="flex lg:items-center lg:justify-between lg:flex-row flex-col  gap-3 items-start flex-wrap">
        <h2 className="text-2xl font-bold hover:text-blue-600">{task.title}</h2>

        <p
          className={`${checkPriority(
            task.priority
          )} text-white p-2 px-4 text-sm rounded-full font-bold`}
        >
          <span>{priorityLocalization(task.priority)}</span> ÖNCELİK
        </p>
      </div>
      <div>
        <p className="text-lg line-clamp-3">{task.description}</p>
      </div>
      <p>{taskStatusLocalization(task.status)}</p>
      <p>{formatDate(task.createdAt)}</p>
    </Link>
  )
}
export default TaskCard
