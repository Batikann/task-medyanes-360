import TaskDetailsContent from '../../../../../components/TaskDetailComponent'

const TaskDetailPage = ({ params }) => {
  return <TaskDetailsContent role={'USER'} taskID={params.id} />
}
export default TaskDetailPage
