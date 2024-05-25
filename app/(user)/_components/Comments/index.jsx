const Comments = () => {
  return (
    <div className="flex flex-col gap-4 border w-full p-4">
      <h2 className="text-xl font-semibold text-gray-500">Activities</h2>
      <div className="flex gap-4">
        <div>icon</div>
        <div>
          <h3>Username</h3>
          <span>Status Type</span>
          <p>content</p>
        </div>
      </div>
    </div>
  )
}
export default Comments
