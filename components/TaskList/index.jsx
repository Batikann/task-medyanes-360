import TaskCard from '../TaskCard/index'

const TaskList = ({ tasks, loading, dashboard }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-5">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            route={`/${dashboard}/task/${task.id}`}
          />
        ))}
      </div>
    </div>
  )
}
export default TaskList
