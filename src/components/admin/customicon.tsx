import React from 'react'
import Image from 'next/image'

export const CustomIcon = () => {
  return (
    <Image
      src="/logo.svg"
      alt="Ralhum Brand Icon"
      width={30}
      height={30}
      style={{ objectFit: 'contain' }}
    />
  )
}

export default CustomIcon
