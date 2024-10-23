import React, { type SVGProps } from 'react'

export default function Prize(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className='mr-3 h-5 w-5'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='black'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <circle cx='12' cy='8' r='7'></circle>
      <polyline points='8.21 13.89 7 23 12 20 17 23 15.79 13.88'></polyline>
    </svg>
  )
}
