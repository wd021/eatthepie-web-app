import React, { type SVGProps } from 'react'

export default function Checkmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className='w-6 h-6 mr-2 text-green-500'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M5 13l4 4L19 7'
      ></path>
    </svg>
  )
}
