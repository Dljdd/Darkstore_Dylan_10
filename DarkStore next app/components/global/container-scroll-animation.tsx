/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useRef } from 'react'
import { useScroll, motion } from 'framer-motion'
import Image from 'next/image'

export const ContainerScroll = ({
  titleComponent,
}: {
  titleComponent: string | React.ReactNode
}) => {
  const containerRef = useRef<any>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <div
      className="w-full flex flex-col items-center justify-start relative px-4 pb-8 md:px-20"
      ref={containerRef}
    >
      <div className="w-full max-w-7xl mx-auto">
        <Header titleComponent={titleComponent} />
        <div className="mt-8 md:mt-12">
          <Card scale={1} />
        </div>
      </div>
    </div>
  )
}

export const Header = ({ titleComponent }: any) => {
  return (
    <motion.div className="w-full text-center mb-12">
      {titleComponent}
    </motion.div>
  )
}

export const Card = ({
  scale,
}: {
  scale: any
}) => {
  return (
    <motion.div
      style={{
        scale: 1,
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
      className="w-full aspect-[16/9] bg-[#222222] rounded-[30px] shadow-2xl overflow-hidden"
    >
      <div className="h-full w-full p-6">
        <div className="bg-gray-100 h-full w-full rounded-2xl overflow-hidden relative">
          <Image
            src="/hm2.png"
            fill
            alt="bannerImage"
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
        </div>
      </div>
    </motion.div>
  )
}