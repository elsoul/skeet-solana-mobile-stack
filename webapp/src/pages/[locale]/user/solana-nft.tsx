import { ReactElement } from 'react'
import UserLayout from '@/layouts/user/UserLayout'
import siteConfig from '@/config/site'
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic'
import SolanaNFTScreen from '@/components/pages/user/solana-nft/SolanaNFTScreen'

const seo = {
  pathname: '/user/solana-nft',
  title: {
    ja: 'SOLANA NFT',
    en: 'SOLANA NFT',
  },
  description: {
    ja: siteConfig.descriptionJA,
    en: siteConfig.descriptionEN,
  },
  img: null,
}

const getStaticProps = makeStaticProps(['common', 'user', 'solana-nft'], seo)
export { getStaticPaths, getStaticProps }

export default function SolanaNFT() {
  return (
    <>
      <SolanaNFTScreen />
    </>
  )
}

SolanaNFT.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
