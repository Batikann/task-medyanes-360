import TaskList from '../../components/TaskList'
function getTaskCountByPriority(tasksData, priority) {
  switch (priority) {
    case 'LOW':
      return tasksData?.length ?? 0
    case 'MEDIUM':
      return tasksData?.length ?? 0
    case 'HIGH':
      return tasksData?.length ?? 0
    default:
      return 0
  }
}
const TaskColumn = ({ priority, tasks, loading }) => {
  const filteredTasks = tasks?.filter(
    (task) => task.priority === priority.priority
  )
  return (
    <div>
      <ul className=" mb-8">
        <li
          className="font-bold text-lg uppercase border-b-4  pb-2 flex items-center gap-3"
          style={{ borderBottomColor: priority.color }}
        >
          {priority.name}
          <span className="border border-slate-500 py-1 px-3 rounded-full">
            {getTaskCountByPriority(tasks, priority.priority)}
          </span>
        </li>
      </ul>
      <TaskList
        tasks={filteredTasks}
        dashboard={'userdashboard'}
        loading={loading}
      />
    </div>
  )
}
export default TaskColumn
