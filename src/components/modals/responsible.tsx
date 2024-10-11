import { FC } from 'react'
import Modal from 'react-modal'

import { useIsMobile } from '@/hooks'
import { Close } from '@/icons'
import { getModalStyles } from '@/styles'

type Props = {
  isOpen: boolean
  onRequestClose: () => void
}

const Responsible: FC<Props> = ({ isOpen, onRequestClose }) => {
  const isMobile = useIsMobile()
  const customStyles = getModalStyles(isMobile)

  return (
    <Modal
      id='react-modal'
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <div className='cursor-pointer' onClick={onRequestClose}>
        <Close width={24} />
      </div>
      <div>be responsible</div>
    </Modal>
  )
}

export default Responsible
