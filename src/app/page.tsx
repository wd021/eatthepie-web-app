'use client'

import { FC, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import { Countdown } from '@/components'
import { Game as GameModal, Responsible as ResponsibleModal } from '@/components/modals'
import { useLotteryInfo } from '@/hooks'
import { Checkmark } from '@/icons'
import { LotteryInfo } from '@/utils/types'

const TERMS = {
  ACCEPTED_KEY: 'etp-terms-accepted',
  VERSION: '1.0',
} as const

const LINKS = {
  ETHEREUM: 'https://www.ethereum.org',
  VDF_EXPLAINER: 'https://www.youtube.com/watch?v=_-feyaZZjEw',
  ETHEREUM_WALLETS: 'https://ethereum.org/en/wallets/',
  GITHUB: 'https://github.com/eatthepie',
  DOCS: 'https://docs.eatthepie.xyz',
  IPFS: 'https://www.ipfs.io',
  NPM_PACKAGE: 'https://www.npmjs.com/package/eatthepie',
  VDF_PROVER: 'https://github.com/eatthepie/vdf-prover',
} as const

const Section: FC<{
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}> = ({ icon, title, children }) => {
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
          <div className='text-gray-600 leading-relaxed'>{children}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ExternalLink: FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target='_blank' className='underline font-semibold' rel='noopener noreferrer'>
    {children}
  </a>
)

const Hero: FC<{
  lotteryInfo: LotteryInfo | undefined
  onBuyTicket: () => void
  onHowItWorks: () => void
}> = ({ lotteryInfo, onBuyTicket, onHowItWorks }) => {
  const formatPrizePool = (value?: string) => {
    if (!value) return '-'

    const numValue = Number(value)
    const decimalPlaces = numValue >= 10000 ? 0 : 1

    return numValue.toFixed(decimalPlaces)
  }

  return (
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
                <Checkmark />
                Fully transparent and fair
              </li>
              <li className='flex items-center justify-center lg:justify-start'>
                <Checkmark />
                Self-executing
              </li>
              <li className='flex items-center justify-center lg:justify-start'>
                <Checkmark />
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
            className='relative w-[85%] max-w-sm lg:max-w-md cursor-pointer'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={onBuyTicket}
          >
            <img src='/jackpot.png' className='shrink-0 w-full h-full' alt='Jackpot' />
            <div className='absolute w-full h-[50%] top-[50%] flex flex-col items-center justify-center'>
              <div className='text-5xl lg:text-7xl font-bold text-black'>
                {formatPrizePool(Number(lotteryInfo?.prizePool))}Ξ
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
}

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
          <ExternalLink href={LINKS.ETHEREUM}>Ethereum</ExternalLink> and{' '}
          <ExternalLink href={LINKS.VDF_EXPLAINER}>
            Verifiable Delay Functions (VDFs)
          </ExternalLink>
          , we now have that: a decentralized, self-executing lottery that operates autonomously
          forever. No hidden tricks, no human involvement—just pure, verifiable randomness.
        </div>
        <div className='pt-4'>
          Traditional lotteries take up to <b>50% in fees</b>, leaving a fraction of the pool
          for the winners. Eat The Pie takes only <b>1% in fees</b>, capped at 100 ETH. That
          means more of the prize money goes back to where it belongs—into the hands of the
          participants. It&apos;s a global game, accessible to anyone with an{' '}
          <ExternalLink href={LINKS.ETHEREUM_WALLETS}>Ethereum wallet</ExternalLink>.
        </div>
      </Section>

      <Section icon='🔒' title='Unbreakable: Ethereum & VDFs'>
        <div>
          Built on Ethereum&apos;s battle-tested infrastructure, Eat The Pie inherits the
          security of the most decentralized blockchain in the world. This means no single
          entity controls the lottery; every transaction and outcome is verified by thousands of
          independent validators, making it impossible for anyone to manipulate the rules or
          withhold prizes.
        </div>
        <div className='pt-4'>
          At its core, the integrity of any lottery depends on how random numbers are generated.
          That&apos;s why Eat The Pie uses Verifiable Delay Functions (VDFs) to create a crucial
          time gap between when a game is settled and when the winning numbers are known. This
          delay completely removes any advantage Ethereum validators might have, as they
          can&apos;t manipulate an outcome that hasn&apos;t been computed yet.
        </div>
        <div className='pt-4'>
          The result? A lottery that&apos;s not just secure, but mathematically guaranteed to be
          fair.
        </div>
      </Section>

      <Section icon='💻' title='Forever Open-Source, Forever Self-Executing'>
        <div>
          📖<ExternalLink href={LINKS.GITHUB}>Open-source codebase</ExternalLink>: Inspect the
          code.
        </div>
        <div className='pt-4'>
          🔍 <ExternalLink href={LINKS.DOCS}>Documentation</ExternalLink>: Understand how it
          works.
        </div>
        <div className='pt-4'>
          🌐 <ExternalLink href={LINKS.IPFS}>eatthepie.eth on IPFS</ExternalLink>: Access via a
          decentralized frontend.
        </div>
        <div className='pt-4'>
          💻 <ExternalLink href={LINKS.NPM_PACKAGE}>Command line app</ExternalLink>: Interact
          with Eat The Pie from your terminal. (
          <code className='text-xs font-semibold bg-gray-100 px-2 py-1 rounded'>
            npm install -g eatthepie
          </code>
          )
        </div>
        <div className='pt-4'>
          🔐 <ExternalLink href={LINKS.VDF_PROVER}>VDF prover</ExternalLink>: Submit or validate
          proofs to check lottery numbers.
        </div>
      </Section>
    </motion.div>
  </div>
)

export default function Home() {
  const [modal, setModal] = useState<boolean | 'game' | 'responsible'>(false)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const { lotteryInfo } = useLotteryInfo()

  useEffect(() => {
    checkTermsAcceptance()
  }, [])

  const checkTermsAcceptance = () => {
    if (typeof window === 'undefined') return

    const acceptedVersion = localStorage.getItem(TERMS.ACCEPTED_KEY)
    if (!acceptedVersion || acceptedVersion !== TERMS.VERSION) {
      setModal('responsible')
    }
  }

  const handleAcceptTerms = () => {
    localStorage.setItem(TERMS.ACCEPTED_KEY, TERMS.VERSION)
    setModal(false)
  }

  const scrollToHowItWorks = () => {
    if (!howItWorksRef.current) return

    const yOffset = -100
    const y = howItWorksRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
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
        className='py-16 bg-gradient-to-b from-green-100 to-green-200'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <HowItWorks />
      </motion.div>
      {modal === 'game' && <GameModal onRequestClose={() => setModal(false)} />}
      {modal === 'responsible' && (
        <ResponsibleModal
          onRequestClose={() => setModal(false)}
          isFirstVisit={true}
          onAccept={handleAcceptTerms}
        />
      )}
    </>
  )
}
