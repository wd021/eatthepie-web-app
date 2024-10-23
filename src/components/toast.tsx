'use client'

import React, { useCallback, useEffect, useState } from 'react'

interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

const ANIMATION_DURATION = 300 // ms

const Toast: React.FC<ToastProps> = ({ message, duration = 2500, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  const hideToast = useCallback(() => {
    setIsVisible(false)
    setTimeout(onClose, ANIMATION_DURATION)
  }, [onClose])

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(hideToast, duration)

    return () => clearTimeout(timer)
  }, [duration, hideToast])

  return (
    <div
      className={`
        z-[1000] fixed left-1/2 transform -translate-x-1/2 
        bg-gray-100 border-gray-900 px-6 py-3 rounded-lg shadow-lg
        transition-all duration-300 ease-in-out
        max-w-[80%] lg:max-w-md w-full text-center text-lg font-semibold
        ${isVisible ? 'bottom-8 translate-y-2' : 'translate-y-full'}
      `}
    >
      {message}
    </div>
  )
}

export default Toast
