import ClaimPage from '@/components/claims'

const Page = ({ params: { address } }: { params: { address: string } }) => {
  return <ClaimPage address={address} />
}

export default Page
