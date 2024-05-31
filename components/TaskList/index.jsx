import TaskCard from '../TaskCard/index'
import Loading from '../loading'

const TaskList = ({ tasks, loading }) => {
  // Tasklerimiz gelene kadar kullanıcıyı göstermek üzere bir loading efekti
  if (loading) {
    return <Loading />
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          route={`/admindashboard/task/${task.id}`}
        />
      ))}
    </div>
  )
}
export default TaskList
