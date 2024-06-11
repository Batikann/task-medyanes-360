import TaskCard from '../TaskCard/index'

const TaskList = ({ tasks, loading, dashboard }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-5">
        {tasks.length > 0 ? (
          tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              route={`/${dashboard}/task/${task.id}`}
            />
          ))
        ) : (
          <p className="font-semibold text-xl">Herhangi bir göreviniz yok!</p>
        )}
      </div>
    </div>
  )
}
export default TaskList
