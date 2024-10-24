const TicketNumberInput: React.FC<{
  ticket: number[]
  ticketIndex: number
  numberRange: {
    min: number
    max: number
    etherball_max: number
  }
  handleNumberChange: (ticketIndex: number, numberIndex: number, value: number) => void
}> = ({ ticket, ticketIndex, numberRange, handleNumberChange }) => (
  <div className='bg-gray-100 p-4 rounded-lg mb-4'>
    <h4 className='text-sm font-semibold mb-2'>Ticket {ticketIndex + 1}</h4>
    <div className='grid grid-cols-4 gap-2'>
      {ticket.map((number, numberIndex) => (
        <input
          key={numberIndex}
          type='number'
          min={numberRange.min}
          max={numberIndex === 3 ? numberRange.etherball_max : numberRange.max}
          value={number || ''}
          onChange={(e) =>
            handleNumberChange(ticketIndex, numberIndex, parseInt(e.target.value))
          }
          className='w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder={`${numberRange.min}-${
            numberIndex === 3 ? numberRange.etherball_max : numberRange.max
          }`}
        />
      ))}
    </div>
  </div>
)

export default TicketNumberInput
