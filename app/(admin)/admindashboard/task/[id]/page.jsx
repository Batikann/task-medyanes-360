import TaskDetailsContent from '../../../../../components/TaskDetailComponent'

const TaskPage = ({ params }) => {
  return <TaskDetailsContent role={'ADMIN'} taskID={params.id} />
}
export default TaskPage
