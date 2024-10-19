'use client'

import { FC, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import { Countdown } from '@/components'
import { Game as GameModal } from '@/components/modals'
import { useLotteryInfo } from '@/hooks'
import { LotteryInfo } from '@/utils/types'

interface SectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

interface HeroProps {
  lotteryInfo: LotteryInfo | undefined
  onBuyTicket: () => void
  onHowItWorks: () => void
}

const Section: FC<SectionProps> = ({ icon, title, children }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <motion.div
      className='bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out'
      whileHover={{ scale: 1.02 }}
    >
      <div className='p-6 flex items-center cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
        <div className='mr-4 text-2xl'>{icon}</div>
        <h3 className='text-xl font-semibold flex-grow'>{title}</h3>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className='text-xl ml-4'
        >
          ▼
        </motion.span>
      </div>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden'
      >
        <div className='px-6 pb-6'>
          <div className='text-gray-600 text-lg leading-relaxed'>{children}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const Hero: FC<HeroProps> = ({ lotteryInfo, onBuyTicket, onHowItWorks }) => (
  <div className='py-16'>
    <div className='container mx-auto px-4'>
      <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
        <motion.div
          className='text-center lg:text-left lg:max-w-[560px] w-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className='text-4xl lg:text-6xl font-bold mb-6 text-gray-900'>
            The World Lottery
          </h1>
          <ul className='text-xl lg:text-2xl mb-8 text-gray-700 space-y-2'>
            <li className='flex items-center justify-center lg:justify-start'>
              <svg
                className='w-6 h-6 mr-2 text-green-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
              Fully transparent and fair
            </li>
            <li className='flex items-center justify-center lg:justify-start'>
              <svg
                className='w-6 h-6 mr-2 text-green-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
              Self-executing
            </li>
            <li className='flex items-center justify-center lg:justify-start'>
              <svg
                className='w-6 h-6 mr-2 text-green-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
              Secured by Ethereum
            </li>
          </ul>
          <div className='flex flex-col sm:flex-row gap-4 justify-center sm:justify-center lg:justify-start w-full'>
            <motion.button
              className='bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors duration-300'
              onClick={onBuyTicket}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Buy Ticket - {lotteryInfo?.ticketPrice}ETH
            </motion.button>
            <motion.button
              className='border-2 border-gray-400 hover:border-gray-600 text-gray-800 font-bold py-4 px-8 rounded-full text-xl transition-colors duration-300'
              onClick={onHowItWorks}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              How It Works
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className='relative w-full max-w-sm lg:max-w-md cursor-pointer'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={onBuyTicket}
        >
          <img src='/jackpot.png' className='shrink-0 w-full h-full' alt='Jackpot' />
          <div className='absolute w-full h-[50%] top-[50%] flex flex-col items-center justify-center'>
            <div className='text-5xl lg:text-7xl font-bold text-black'>
              {lotteryInfo?.prizePool ? Number(lotteryInfo?.prizePool).toFixed(1) : ''}Ξ
            </div>
            <div className='text-lg lg:text-3xl text-black font-semibold mt-2'>
              <Countdown
                secondsUntilDraw={lotteryInfo?.secondsUntilDraw}
                displayCompleted={false}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
)

const HowItWorks = () => (
  <div className='max-w-2xl mx-auto px-4'>
    <motion.h2
      className='text-4xl font-bold text-center mb-12'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      How It Works
    </motion.h2>
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Section icon='🌎' title='A Trustless and Fair World Lottery'>
        <div>
          Imagine a global lottery where everyone plays on equal footing, free from manipulation
          or unfair advantages. Thanks to the power of{' '}
          <a
            href='https://www.ethereum.org'
            target='_blank'
            className='underline font-semibold'
          >
            Ethereum
          </a>{' '}
          and{' '}
          <a
            href='https://www.youtube.com/watch?v=_-feyaZZjEw'
            target='_blank'
            className='underline font-semibold'
          >
            Verifiable Delay Functions (VDFs)
          </a>
          , we now have that: a decentralized, self-executing lottery that operates autonomously
          forever. No hidden tricks, no human involvement—just pure, verifiable randomness.
        </div>
        <div className='pt-4'>
          Traditional lotteries take up to <b>50% in fees</b>, leaving a fraction of the pool
          for the winners. Our lottery takes only <b>1% in fees</b>, capped at 100 ETH. That
          means more of the prize money goes back to where it belongs—into the hands of the
          participants. It&apos;s a global game, accessible to anyone with an{' '}
          <a
            href='https://ethereum.org/en/wallets/'
            target='_blank'
            className='underline font-semibold'
          >
            Ethereum wallet
          </a>
          .
        </div>
      </Section>

      <Section icon='🔒' title='Unbreakable: Ethereum & VDFs'>
        <div>
          The lottery runs on the Ethereum blockchain, a decentralized network powered by
          thousands of validators around the world. This robust infrastructure not only secures
          cryptocurrencies but also serves as the foundation for our lottery’s integrity.
        </div>
        <div className='pt-4'>
          We took it a step further by incorporating Verifiable Delay Functions (VDFs) into the
          process of generating random lottery numbers. VDFs introduce a required time delay,
          ensuring that even if validators tried to collude, they wouldn’t be able to predict or
          manipulate the outcome.
        </div>
        <div className='pt-4'>
          This combination makes the lottery tamper proof — mathematically guaranteed,
          autonomous, and resistant to manipulation.
        </div>
      </Section>

      <Section icon='💻' title='Open Source, Self-Executing, and Runs Forever'>
        <div>
          All{' '}
          <a href='https://www.github.com' target='_blank' className='underline font-semibold'>
            code is open
          </a>{' '}
          and publicly available for anyone to review, audit, and verify.
        </div>
        <div className='pt-4'>
          Want to dive deeper into how the lottery works?{' '}
          <a
            href='https://docs.eatthepie.xyz'
            target='_blank'
            className='underline font-semibold'
          >
            Explore our docs
          </a>{' '}
          for a detailed breakdown.
        </div>
        <div className='pt-4'>
          We’ve also taken decentralization a step further by hosting this{' '}
          <a href='https://www.ipfs.com' target='_blank' className='underline font-semibold'>
            website on IPFS
          </a>
          . You can also access it via <b>eatthepie.eth</b> on browsers that support IPFS
          (brave).
        </div>
      </Section>
    </motion.div>
    <motion.div
      className='mt-12 text-center'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <p className='text-gray-600 mb-6'>
        For a more in-depth understanding, check out the documentation.
      </p>
      <motion.a
        href='https://docs.eatthepie.xyz'
        target='_blank'
        className='bg-gray-800 text-white px-6 py-3 rounded-full font-semibold inline-block'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Read the Docs
      </motion.a>
    </motion.div>
  </div>
)

export default function Home() {
  const [modal, setModal] = useState<boolean | 'game'>(false)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const { lotteryInfo } = useLotteryInfo()

  const scrollToHowItWorks = () => {
    if (howItWorksRef.current) {
      const yOffset = -100
      const y = howItWorksRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.div
        className='flex flex-col items-center justify-center border-b border-gray-300'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero
          lotteryInfo={lotteryInfo}
          onBuyTicket={() => setModal('game')}
          onHowItWorks={scrollToHowItWorks}
        />
      </motion.div>
      <motion.div
        ref={howItWorksRef}
        className='py-16 bg-gradient-to-b from-green-50 to-green-100'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <HowItWorks />
      </motion.div>
      {modal === 'game' && <GameModal onRequestClose={() => setModal(false)} />}
    </>
  )
}
