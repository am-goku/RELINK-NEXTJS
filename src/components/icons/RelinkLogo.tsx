import Image from 'next/image'
import React from 'react'

type Props = { width: number, height: number, onClick?: () => void }

function RelinkLogo({ width, height, onClick }: Props) {
  return (
    <>
      <Image
        src='/icons/relink.svg'
        alt='Relink'
        width={width}
        height={height}
        onClick={onClick}
        className='cursor-pointer rounded-full' />
    </>
  )
}

export default RelinkLogo