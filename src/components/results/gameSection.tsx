type StatusType = 'completed' | 'inProgress' | 'pending' | 'default'

const StatusBadge = ({
  status,
  className = '',
}: {
  status: StatusType
  className?: string
}) => {
  const styles: Record<StatusType, string> = {
    completed: 'bg-green-100 text-green-800',
    inProgress: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.default} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const GameSection = ({
  title,
  emoji,
  children,
  status,
  className = '',
}: {
  title: string
  emoji: string
  children: React.ReactNode
  status?: string
  className?: string
}) => (
  <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
    <div className='px-5 py-3.5 border-b border-gray-100 flex justify-between items-center'>
      <div className='flex items-center space-x-2'>
        <span className='text-xl'>{emoji}</span>
        <h2 className='text-base font-semibold text-gray-900'>{title}</h2>
      </div>
      {status && <StatusBadge status={status as StatusType} />}
    </div>
    <div className='p-5'>{children}</div>
  </div>
)

export default GameSection
