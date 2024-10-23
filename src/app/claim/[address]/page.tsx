import { ClaimPage } from '@/components'

const Page = ({ params: { address } }: { params: { address: string } }) => {
  return <ClaimPage address={address} />
}

export default Page
