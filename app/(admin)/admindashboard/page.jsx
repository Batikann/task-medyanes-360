import { Suspense } from 'react'
import DashboardMainPage from './_components/DashboardMainPage'

const AdminDashboard = () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <DashboardMainPage />
    </Suspense>
  )
}
export default AdminDashboard
