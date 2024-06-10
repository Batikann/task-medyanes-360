'use client'

import { useSession } from 'next-auth/react'
import TaskDetailsContent from '../../../../../components/TaskDetailComponent'

const TaskPage = ({ params }) => {
  const { data: session, status } = useSession()
  //Taskin detaylarını kullanıcının rolune göre getiriyor.
  return <TaskDetailsContent role={session?.user.role} taskID={params.id} />
}
export default TaskPage
