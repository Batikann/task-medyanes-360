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
    (task) => task?.priority === priority?.priority
  )
  return (
    <div>
      <ul className=" mb-8 ">
        <li
          className="border-b-4 flex justify-between items-center"
          style={{ borderBottomColor: priority.color }}
        >
          <div className="font-bold text-lg uppercase   pb-2 flex items-center gap-3">
            {priority.name}
            <span className="border border-slate-500 w-9 h-9 flex justify-center items-center rounded-full">
              {getTaskCountByPriority(tasks, priority.priority)}
            </span>
          </div>
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
