import { FC, useState } from 'react'
import Modal from 'react-modal'

import { useIsMobile } from '@/hooks'
import { Close } from '@/icons'
import { getModalStyles } from '@/styles'

const ModalHeader: FC<{ isFirstVisit: boolean; onRequestClose: () => void }> = ({
  isFirstVisit,
  onRequestClose,
}) => (
  <div className='flex justify-between items-center mb-6 flex-shrink-0'>
    <h2 className='text-xl font-bold text-gray-900'>⚠️ Responsible Gaming</h2>
    {!isFirstVisit && (
      <button
        onClick={onRequestClose}
        className='absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors'
      >
        <Close className='w-6 h-6' />
      </button>
    )}
  </div>
)

const BulletPoint: FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className='flex items-start space-x-2'>
    <span className='text-blue-500 mt-0.5'>•</span>
    <span>{children}</span>
  </li>
)

const InfoList: FC = () => (
  <div className='bg-gray-50 rounded-lg p-4'>
    <ul className='list-none space-y-3'>
      <BulletPoint>
        Eat The Pie is a fully decentralized lottery that operates autonomously on the Ethereum
        blockchain.
      </BulletPoint>
      <BulletPoint>The platform operates without any central authority.</BulletPoint>
      <BulletPoint>All smart contract code is open-source and publicly verifiable.</BulletPoint>
      <BulletPoint>
        Participating in this lottery involves risk, and you take full responsibility for your
        actions.
      </BulletPoint>
      <BulletPoint>
        Transactions cannot be reversed or refunded as all operations are run by immutable smart
        contracts.
      </BulletPoint>
      <BulletPoint>
        Users are responsible for ensuring compliance with their local laws and regulations
        regarding lottery participation.
      </BulletPoint>
      <BulletPoint>
        By participating, users acknowledge that they understand the risks involved in
        interacting with blockchain technology and smart contracts.
      </BulletPoint>
    </ul>
  </div>
)

const WarningBox: FC = () => (
  <div className='p-4 bg-yellow-50 rounded-lg border border-yellow-100'>
    <p className='font-medium text-gray-900'>
      Remember to always practice responsible gaming and never spend more than you can afford to
      lose.
    </p>
  </div>
)

const AcceptanceForm: FC<{
  isChecked: boolean
  setIsChecked: (value: boolean) => void
  onAccept?: () => void
}> = ({ isChecked, setIsChecked, onAccept }) => (
  <div className='space-y-4'>
    <div className='p-4 bg-blue-50 border border-blue-100 rounded-lg'>
      <div className='flex items-center space-x-3'>
        <input
          type='checkbox'
          id='terms'
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className='h-5 w-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500'
        />
        <label
          htmlFor='terms'
          className='text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors'
        >
          I understand and accept the risks involved in participating in this decentralized
          lottery.
        </label>
      </div>
    </div>

    <button
      onClick={onAccept}
      disabled={!isChecked}
      className={`w-full rounded-lg px-4 py-2 text-white transition-colors
        ${isChecked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
    >
      Continue to Application
    </button>
  </div>
)

const CloseButton: FC<{ onRequestClose: () => void }> = ({ onRequestClose }) => (
  <button
    onClick={onRequestClose}
    className='w-full rounded-lg px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors'
  >
    Close
  </button>
)

const Responsible: FC<{
  onRequestClose: () => void
  isFirstVisit?: boolean
  onAccept?: () => void
}> = ({ onRequestClose, isFirstVisit = false, onAccept }) => {
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
      <div className='flex flex-col h-full overflow-hidden'>
        <div className='relative w-full h-full rounded-lg bg-white p-6 flex flex-col overflow-hidden'>
          <ModalHeader isFirstVisit={isFirstVisit} onRequestClose={onRequestClose} />

          <div className='flex-grow overflow-y-auto hide-scrollbar'>
            <div className='space-y-6 text-gray-600'>
              <p className='text-lg font-semibold text-gray-900'>
                Eat The Pie - The World Lottery on World Chain
              </p>

              <div className='space-y-4'>
                <p className='text-sm font-medium text-gray-700'>
                  Please read this important information:
                </p>

                <InfoList />
                <WarningBox />
              </div>
            </div>
          </div>

          <div className='mt-6 flex-shrink-0'>
            {isFirstVisit ? (
              <AcceptanceForm
                isChecked={isChecked}
                setIsChecked={setIsChecked}
                onAccept={onAccept}
              />
            ) : (
              <CloseButton onRequestClose={onRequestClose} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default Responsible
