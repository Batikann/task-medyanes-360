import Link from 'next/link'
import { formatDate } from '../../lib/utils/formatter.js'

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

const TaskCard = ({ task, route }) => {
  return (
    <div className="border p-4 flex flex-col gap-3 hover:shadow-md cursor-pointer rounded-md hover:scale-105 items-start md:items-stretch">
      <div className="flex lg:items-center lg:justify-between lg:flex-row flex-col  gap-3 items-start flex-wrap">
        <Link href={route}>
          <h2 className="text-2xl font-bold hover:text-blue-600">
            {task.title}
          </h2>
        </Link>
        <p
          className={`${checkPriority(
            task.priority
          )} text-white p-2 px-4 text-sm rounded-full font-bold`}
        >
          <span>{task.priority}</span> PRIORITY
        </p>
      </div>
      <div>
        <p className="text-lg line-clamp-3">{task.description}</p>
      </div>
      <p>
        <span className="font-bold ">Status:</span> {task.status}
      </p>
      <p>{formatDate(task.createdAt)}</p>
    </div>
  )
}
export default TaskCard
