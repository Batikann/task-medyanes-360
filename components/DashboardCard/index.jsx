import Loading from '../loading'

const DashboardCard = ({ title, count }) => {
  return (
    <div className="border p-4 rounded-md flex flex-col gap-4">
      <h3 className="text-2xl font-semibold uppercase">{title}</h3>
      <p className="text-3xl">{count}</p>
    </div>
  )
}
export default DashboardCard
