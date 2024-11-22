import React, { type SVGProps } from 'react'

export default function Clock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' {...props}>
      <path
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='2'
        d='M12 6v6l4 2m6-2A10 10 0 1 1 12 2a10 10 0 0 1 10 10z'
      />
    </svg>
  )
}
