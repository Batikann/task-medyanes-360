import TaskDetailsContent from '../../../../../components/TaskDetailComponent'

const TaskDetailPage = ({ params }) => {
  //Kulanıcının rolüne göre ge.erli tipteki task detail sayfasına yönlendiriyor
  return <TaskDetailsContent role={'USER'} taskID={params.id} />
}
export default TaskDetailPage
