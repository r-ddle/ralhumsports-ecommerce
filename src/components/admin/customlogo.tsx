import React from 'react'
import Image from 'next/image'

export const CustomLogo = () => {
  return (
    <Image
      src="/logo.svg"
      alt="Ralhum Brand"
      width={150}
      height={50}
      style={{ objectFit: 'contain' }}
    />
  )
}

export default CustomLogo
