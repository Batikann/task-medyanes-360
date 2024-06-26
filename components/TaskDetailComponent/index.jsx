'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import Loading from '../../components/loading'
import TaskDetail from '..//TaskDetail'
import { getAPI, postAPI } from '../../services/fetchAPI'

import Comments from '../Comments/'
import CommentForm from '../CommentForm'
import Tab from '../Tab'
import { useRouter } from 'next/navigation'
import { useNotification } from '../../context/NotificationContext '
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

const TaskDetailsContent = ({ role, taskID }) => {
  const router = useRouter()
  const [taskDetail, setTaskDetail] = useState([])
  const { data: session, status } = useSession()
  const [page, setPage] = useState('Task Detail')
  const [refreshPage, setRefreshPage] = useState(false)
  const [editComment, setEditComment] = useState(null)

  useEffect(() => {
    //gelen taskId ye göre geçerli taskı getiriyoruz
    const getTaskDetail = async () => {
      const res = await getAPI(`/tasks/${taskID}/get-task`)
      setTaskDetail(res.task)
    }

    getTaskDetail()
  }, [refreshPage, taskID])

  //task detayları için kullanıcı deneyimini iyileştirmek adına veri gelene kadar sayfa da loading componentimiz gözükür
  if (taskDetail.length <= 0) {
    return <Loading width={'h-8'} height={'h-8'} />
  }

  //Task silme fonksiyonumuz (admin için)

  const deleteTaskHandler = async (id) => {
    const res = await postAPI(`/tasks/delete-task`, { id })
    if (res.status === 'success') {
      router.push('/admindashboard?task=all')
      toast.success('Task Başarıyla Silindi')
    }
  }

  //Task güncelleme fonksiyonumuz (admin için)
  const updateTaskHandler = async (id) => {
    router.push(`/admindashboard/task/${id}/update-task`)
  }

  if (page === 'Task Detail') {
    return (
      <TaskDetail
        setPage={setPage}
        page={page}
        taskDetail={taskDetail}
        role={session?.user.role}
        userId={session.user.id}
        setRefreshPage={setRefreshPage}
        refreshPage={refreshPage}
        updateTaskHandler={() => updateTaskHandler(taskDetail.id)}
        deleteTaskHandler={() => deleteTaskHandler(taskDetail.id)}
      />
    )
  } else {
    return (
      <div className="flex flex-col gap-4">
        <Tab page={page} setPage={setPage} />
        <div className="flex  md:justify-between gap-12 flex-col-reverse md:flex-row">
          <Comments
            taskId={taskDetail.id}
            refreshPage={refreshPage}
            setEditComment={setEditComment}
          />
          {/* role alanı user olan kullanıcılar sadece bu alanı görebilir */}
          {role === 'USER' && (
            <CommentForm
              taskID={taskDetail.id}
              setRefreshPage={setRefreshPage}
              refreshPage={refreshPage}
              editComment={editComment}
              setEditComment={setEditComment}
            />
          )}
        </div>
      </div>
    )
  }
}

export default TaskDetailsContent
