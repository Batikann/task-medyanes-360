const DashboardCard = ({ title, count, bgColor, textColor }) => {
  return (
    <div className={`border p-4 rounded-lg flex flex-col gap-4 ${bgColor} `}>
      <h3 className="text-xl mt-3 font-semibold uppercase  text-black transition-all ease-in-out duration-500 transform">
        {title}
      </h3>
      <p className={`text-3xl  font-bold ${textColor}`}>{count}</p>
    </div>
  )
}
export default DashboardCard
