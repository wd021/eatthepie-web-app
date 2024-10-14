import React, { type SVGProps } from 'react'

export default function PowerOff(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className='mr-3 h-5 w-5 text-gray-400'
      height='24'
      viewBox='0 0 200 200'
      width='24'
      {...props}
    >
      <path d='M156.31,43.63a9.9,9.9,0,0,0-14,14,60.1,60.1,0,1,1-85,0,9.9,9.9,0,0,0-14-14c-31,31-31,82,0,113s82,31,113,0A79.37,79.37,0,0,0,156.31,43.63Zm-56.5,66.5a10,10,0,0,0,10-10v-70a10,10,0,0,0-20,0v70A10,10,0,0,0,99.81,110.13Z' />
    </svg>
  )
}
