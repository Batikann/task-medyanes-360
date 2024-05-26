'use client'
import { useEffect, useState } from 'react'
import { getAPI } from '../../../../../services/fetchAPI'
import Loading from '../../../../../components/loading'
import Comments from '../../../_components/Comments'
import CommentForm from '../../../_components/CommentForm'
import TaskDetail from '../../../_components/TaskDetail/index'

const TaskDetailPage = ({ params }) => {
  const [taskDetail, setTaskDetail] = useState([])
  const [page, setPage] = useState('Task Detail')
  const [refreshPage, setRefreshPage] = useState(false)
  const [editComment, setEditComment] = useState(null)

  useEffect(() => {
    const getTaskDetail = async () => {
      const res = await getAPI(`/tasks/${params.id}/get-task`)
      setTaskDetail(res.task)
    }

    getTaskDetail()
  }, [])

  if (taskDetail.length <= 0) {
    return <Loading />
  }
  if (page === 'Task Detail') {
    return <TaskDetail setPage={setPage} page={page} taskDetail={taskDetail} />
  } else {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-5 items-center">
          <button
            className={`bg-gray-200 py-2 px-3 rounded-t-md hover:text-blue-600 ${
              page === 'Task Detail'
                ? 'text-blue-600 border-b-blue-600 border-b-2'
                : ''
            }`}
            onClick={() => setPage('Task Detail')}
          >
            Task Detail
          </button>
          <button
            className={`bg-gray-200 py-2 px-3 rounded-t-md hover:text-blue-600 ${
              page === 'Activities/Timeline'
                ? 'text-blue-600 border-b-blue-600 border-b-2'
                : ''
            }`}
            onClick={() => setPage('Activities/Timeline')}
          >
            Activities/Timeline
          </button>
        </div>
        <div className="flex  justify-between gap-12">
          <Comments
            taskId={taskDetail.id}
            refreshPage={refreshPage}
            setEditComment={setEditComment}
          />
          <CommentForm
            taskID={taskDetail.id}
            setRefreshPage={setRefreshPage}
            refreshPage={refreshPage}
            editComment={editComment}
            setEditComment={setEditComment}
          />
        </div>
      </div>
    )
  }
}
export default TaskDetailPage
