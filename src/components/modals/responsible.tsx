import { FC, useState } from 'react'
import Modal from 'react-modal'

import { useIsMobile } from '@/hooks'
import { getModalStyles } from '@/styles'

type Props = {
  onRequestClose: () => void
  isFirstVisit?: boolean
  onAccept?: () => void
}

const Responsible: FC<Props> = ({ onRequestClose, isFirstVisit = false, onAccept }) => {
  const isMobile = useIsMobile()
  const customStyles = getModalStyles(isMobile)
  const [isChecked, setIsChecked] = useState(false)

  return (
    <Modal
      id='react-modal'
      ariaHideApp={false}
      isOpen={true}
      onRequestClose={() => {
        if (!isFirstVisit) {
          onRequestClose()
        }
      }}
      style={customStyles}
    >
      {/* Modal Content */}
      <div className='flex min-h-full items-center justify-center'>
        <div
          className='relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold text-gray-900'>⚠️ Responsible Gaming</h2>
            {!isFirstVisit && (
              <button
                onClick={onRequestClose}
                className='rounded-full p-1 hover:bg-gray-100 transition-colors'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className='space-y-4 text-gray-600'>
            <p className='font-semibold text-gray-900'>
              EatThePie - The World Lottery on Ethereum
            </p>

            <div className='space-y-2'>
              <p>Please read this important information:</p>

              <ul className='list-disc pl-5 space-y-2'>
                <li>
                  EatThePie is a fully decentralized lottery that operates autonomously on the
                  Ethereum blockchain.
                </li>
                <li>The platform operates without any central authority.</li>
                <li>All smart contract code is open source and publicly verifiable.</li>
                <li>
                  Participating in this lottery involves risk, and you take full responsibility
                  with your actions.
                </li>
                <li>
                  Transactions cannot be reversed or refunded as all operations are controlled
                  by immutable smart contracts.
                </li>
                <li>
                  Users are responsible for ensuring compliance with their local laws and
                  regulations regarding lottery participation.
                </li>
                <li>
                  By participating, users acknowledge that they understand the risks involved in
                  interacting with blockchain technology and smart contracts.
                </li>
              </ul>
            </div>

            <p className='font-medium text-gray-900'>
              Remember to always practice responsible gaming and never spend more than you can
              afford to lose.
            </p>
          </div>

          {/* Footer */}
          {isFirstVisit ? (
            <div className='mt-6 space-y-4'>
              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id='terms'
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <label htmlFor='terms' className='text-sm text-gray-600 cursor-pointer'>
                  I understand and accept the risks involved in participating in this
                  decentralized lottery
                </label>
              </div>

              <button
                onClick={onAccept}
                disabled={!isChecked}
                className={`w-full rounded-lg px-4 py-2 text-white transition-colors
                    ${
                      isChecked
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
              >
                Continue to Application
              </button>
            </div>
          ) : (
            <div className='mt-6'>
              <button
                onClick={onRequestClose}
                className='w-full rounded-lg px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors'
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default Responsible
