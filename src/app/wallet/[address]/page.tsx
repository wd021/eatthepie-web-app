import { WalletPage } from '@/components'

const Page = ({ params: { address } }: { params: { address: string } }) => {
  return <WalletPage address={address} />
}

export default Page
