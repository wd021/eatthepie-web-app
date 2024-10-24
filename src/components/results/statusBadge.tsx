import { FC } from 'react'

const StatusBadge: FC<{ status: number }> = ({ status }) => {
  const getStatusString = (status: number) => {
    switch (status) {
      case 0:
        return 'In Play'
      case 1:
        return 'Drawing'
      case 2:
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-blue-100 text-blue-800'
      case 1:
        return 'bg-yellow-100 text-yellow-800'
      case 2:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}
    >
      {getStatusString(status)}
    </span>
  )
}

export default StatusBadge
