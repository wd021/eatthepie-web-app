import React, { type SVGProps } from 'react'

export default function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' {...props}>
      <path
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='2'
        d='m6 9 6 6 6-6'
      />
    </svg>
  )
}
