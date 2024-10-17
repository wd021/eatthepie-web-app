'use client'

import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown'

interface CountdownProps {
  secondsUntilDraw?: number
}

interface RendererProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}

const CountdownComponent: React.FC<CountdownProps> = ({ secondsUntilDraw }) => {
  const [targetDate, setTargetDate] = useState<Date | null>(null)

  useEffect(() => {
    if (secondsUntilDraw !== undefined) {
      const newTargetDate = new Date(Date.now() + secondsUntilDraw * 1000)
      setTargetDate(newTargetDate)
    }
  }, [secondsUntilDraw])

  const renderer = ({ days, hours, minutes, seconds, completed }: RendererProps) => {
    if (completed) {
      return <span>Completed!</span>
    } else {
      return (
        <span className='font-mono'>
          {days > 0 && `${days.toString().padStart(2, '0')}:`}
          {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </span>
      )
    }
  }

  if (!targetDate) {
    return null
  }

  return <Countdown date={targetDate} renderer={renderer} />
}

export default CountdownComponent
