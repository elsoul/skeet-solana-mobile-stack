import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import solanaLogoMark from '@/assets/img/logo/solanaLogoMark.svg'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useCallback, useEffect, useState } from 'react'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { solanaEndpoint } from '@/components/providers/SolanaWalletProvider'
import { fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import GridsLoading from '@/components/loading/GridsLoading'

type Nft = {
  name: string
  imgUrl: string
}

export default function SolanaNFTScreen() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [userNfts, setUserNfts] = useState<Nft[]>([])
  const [isNftLoading, setNftLoading] = useState(false)

  const getUserNfts = useCallback(async () => {
    if (publicKey && connection) {
      try {
        setNftLoading(true)
        const umi = createUmi(solanaEndpoint)
        const nfts = await fetchAllDigitalAssetByOwner(
          umi,
          fromWeb3JsPublicKey(publicKey),
        )
        const first20Items = nfts.slice(0, 20)
        const nftList: Nft[] = []
        for await (const nft of first20Items) {
          try {
            if (nft.metadata.uri != '') {
              const metadata = await fetch(nft.metadata.uri)
              const data = await metadata.json()

              if (data) {
                nftList.push({
                  name: data.name,
                  imgUrl: data.image,
                })
              }
            }
          } catch (err) {
            console.error(err)
          }
        }
        setUserNfts(nftList)
      } catch (err) {
        console.error(err)
      } finally {
        setNftLoading(false)
      }
    }
  }, [publicKey, connection])

  useEffect(() => {
    getUserNfts()
  }, [getUserNfts])

  return (
    <>
      <div className="flex flex-row items-center justify-start pb-5">
        <Image
          src={solanaLogoMark}
          alt="SOLANA"
          width={24}
          height={24}
          className="mr-3 h-6 w-6"
        />

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          SOLANA NFT
        </h2>
      </div>
      <div className="flex flex-row items-center pb-8">
        <div className="bg-gray-900">
          <WalletMultiButton />
        </div>
      </div>

      {isNftLoading ? (
        <>
          <GridsLoading />
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 sm:gap-6 md:grid-cols-6 lg:gap-8">
            {userNfts.map((nft, index) => (
              <div
                key={nft.imgUrl}
                className="flex flex-col items-start justify-between"
              >
                <Image
                  src={nft.imgUrl}
                  alt={nft.name}
                  width={168}
                  height={168}
                  unoptimized
                  className="w-full"
                />
                <p className="w-full py-3 text-xs text-gray-900 dark:text-white">
                  {nft.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
