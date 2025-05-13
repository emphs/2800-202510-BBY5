import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-reports')({
  component: UserReports,
})

function UserReports() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Your Past Reports</h1>
      <p>This is where your submitted reports will appear.</p>
    </div>
  )
}
