'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'

interface CountdownProps {
  secondsUntilDraw?: number
  displayCompleted?: boolean
}

interface TimeUnits {
  days: number
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}

const TIME_FORMAT = {
  PADDING: 2,
  SEPARATOR: ':',
  COMPLETED_TEXT: 'Completed!',
} as const

const formatTimeUnit = (value: number): string => {
  return value.toString().padStart(TIME_FORMAT.PADDING, '0')
}

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

/**
 * Countdown component that displays time remaining until a target date
 * @param secondsUntilDraw - Number of seconds until the draw
 * @param displayCompleted - Whether to display 'Completed!' when countdown ends
 */
const CountdownComponent = ({ secondsUntilDraw, displayCompleted = true }: CountdownProps) => {
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
