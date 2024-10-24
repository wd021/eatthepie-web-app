import { TIME_FORMAT } from '@/utils/constants'

export const trimAddress = (
  addr: string,
  startLength: number = 4,
  endLength: number = 4,
): string => {
  if (typeof addr !== 'string') {
    throw new Error('Address must be a string')
  }

  if (startLength < 0 || endLength < 0) {
    throw new Error('Start and end lengths must be non-negative')
  }

  if (addr.length <= startLength + endLength) {
    return addr
  }

  return `${addr.slice(0, startLength)}...${addr.slice(-endLength)}`
}

export const truncateString = (str: string, length: number) => {
  if (str.length <= length) return str
  return `${str.slice(0, length)}...`
}

export const convertSecondsToShorthand = (seconds: number): string => {
  if (seconds < 0) {
    throw new Error('Seconds must be non-negative')
  }

  if (seconds < 60) {
    return `${seconds}s`
  }

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`
  }

  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h`
  }

  return `${Math.floor(seconds / 86400)}d`
}

export const formatTimeUnit = (value: number): string => {
  return value.toString().padStart(TIME_FORMAT.PADDING, '0')
}

export const formatNumbers = (numbers: number[]): string => {
  return numbers.map((num) => num.toString().padStart(TIME_FORMAT.PADDING, '0')).join(' - ')
}

export const calculateTargetDate = (secondsUntilDraw: number): Date => {
  return new Date(Date.now() + secondsUntilDraw * 1000)
}
