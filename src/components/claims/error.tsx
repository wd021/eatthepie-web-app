const ClaimError: React.FC<{ message: string }> = ({ message }) => (
  <div className='flex items-center p-4 mb-6 text-red-800 border-l-4 border-red-600 bg-red-50'>
    <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
    <span>{message}</span>
  </div>
)

export default ClaimError
