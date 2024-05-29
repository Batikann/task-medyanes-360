import TaskDetailsContent from '../../../../../components/TaskDetailComponent'

const TaskPage = ({ params }) => {
  //Taskin detaylarını kullanıcının rolune göre getiriyor.
  return <TaskDetailsContent role={'ADMIN'} taskID={params.id} />
}
export default TaskPage
