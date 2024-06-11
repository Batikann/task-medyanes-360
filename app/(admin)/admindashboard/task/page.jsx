import { Suspense } from 'react'
import MainTaskPage from './_components/MainTaskPage'

const TasksPage = () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <MainTaskPage />
    </Suspense>
  )
}

export default TasksPage
