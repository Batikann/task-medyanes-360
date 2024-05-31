import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const DashboardCard = ({ title, count, status }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )
  return (
    <div className="border p-4 rounded-md flex flex-col gap-4">
      <h3 className="text-2xl font-semibold uppercase  hover:text-blue-500">
        <Link
          href={`${pathname}/task` + '?' + createQueryString('task', status)}
        >
          {title}
        </Link>
      </h3>
      <p className="text-3xl">{count}</p>
    </div>
  )
}
export default DashboardCard
