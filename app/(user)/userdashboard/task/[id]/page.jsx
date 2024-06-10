'use client'

import { useSession } from 'next-auth/react'
import TaskDetailsContent from '../../../../../components/TaskDetailComponent'

const TaskDetailPage = ({ params }) => {
  const { data: session, status } = useSession()
  //Kulanıcının rolüne göre ge.erli tipteki task detail sayfasına yönlendiriyor
  return <TaskDetailsContent role={session?.user.role} taskID={params.id} />
}
export default TaskDetailPage
