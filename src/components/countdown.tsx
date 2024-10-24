'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'

import { TIME_FORMAT } from '@/utils/constants'
import { formatTimeUnit } from '@/utils/helpers'
import { TimeParts } from '@/utils/types'

type TimeUnits = TimeParts & { completed: boolean }

const calculateTargetDate = (secondsUntilDraw: number): Date => {
  return new Date(Date.now() + secondsUntilDraw * 1000)
}

const TimeDisplay = ({ days, hours, minutes, seconds }: Omit<TimeUnits, 'completed'>) => {
  const timeUnits = [
    { value: days, shouldShow: days > 0 },
    { value: hours, shouldShow: true },
    { value: minutes, shouldShow: true },
    { value: seconds, shouldShow: true },
  ]

  return (
    <span className='font-mono'>
      {timeUnits
        .filter((unit) => unit.shouldShow)
        .map((unit, index, array) => (
          <React.Fragment key={index}>
            {formatTimeUnit(unit.value)}
            {index < array.length - 1 && TIME_FORMAT.SEPARATOR}
          </React.Fragment>
        ))}
    </span>
  )
}

const CountdownComponent = ({
  secondsUntilDraw,
  displayCompleted = true,
}: {
  secondsUntilDraw?: number
  displayCompleted?: boolean
}) => {
  const [targetDate, setTargetDate] = useState<Date | null>(null)

  useEffect(() => {
    if (typeof secondsUntilDraw === 'number') {
      setTargetDate(calculateTargetDate(secondsUntilDraw))
    }
  }, [secondsUntilDraw])

  const renderCountdown = (timeUnits: TimeUnits) => {
    if (timeUnits.completed) {
      return displayCompleted ? TIME_FORMAT.COMPLETED_TEXT : ''
    }

    return <TimeDisplay {...timeUnits} />
  }

  if (!targetDate) return null

  return <Countdown date={targetDate} renderer={renderCountdown} precision={3} />
}

export default CountdownComponent
