import dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  mplTokenMetadata,
  createNft,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi'
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage'
import {
  COLLECTION_NAME,
  COLLECTION_SYMBOL,
  COLLECTION_DESCRIPTION,
  FEE_PERCENT,
  EXTERNAL_URL,
  COLLECTION_IMAGE_URL,
} from './config'

const rpcURL =
  (process.env.NODE_ENV === 'production'
    ? process.env.SOLANA_MAINNET_RPC_URL
    : process.env.SOLANA_DEVNET_RPC_URL) || 'https://api.devnet.solana.com'

const payerKeyFile = process.env.WALLET_FILE || 'key.json'
const keyData = fs.readFileSync(payerKeyFile, 'utf8')
const secretKey = new Uint8Array(JSON.parse(keyData))

const nftStorageToken = process.env.NFT_STORAGE_KEY || ''

const collectionImageBuffer = fs.readFileSync(COLLECTION_IMAGE_URL)

const run = async () => {
  try {
    const umi = createUmi(rpcURL)
      .use(mplTokenMetadata())
      .use(nftStorageUploader({ token: nftStorageToken }))

    const keyPair = umi.eddsa.createKeypairFromSecretKey(secretKey)
    const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
    umi.use(signerIdentity(signer))

    const collectionImageGenericFile = createGenericFile(
      collectionImageBuffer,
      'scripts/solana/cNFT/example/collectionImageGenericFile.png'
    )

    const [collectionImageUri] = await umi.uploader.upload([
      collectionImageGenericFile,
    ])
    console.log('collectionImageUri:', collectionImageUri)
    fs.writeFileSync(
      'scripts/solana/cNFT/example/collectionImageUri.txt',
      collectionImageUri
    )

    const colelctionJsonObject = {
      name: COLLECTION_NAME,
      symbol: COLLECTION_SYMBOL,
      description: COLLECTION_DESCRIPTION,
      seller_fee_basis_points: FEE_PERCENT * 100,
      image: collectionImageUri,
      external_url: EXTERNAL_URL,
      properties: {
        category: 'image',
        files: [
          {
            file: collectionImageUri,
            type: 'image/png',
          },
        ],
      },
    }

    const collectionJsonUri = await umi.uploader.uploadJson(
      colelctionJsonObject
    )
    console.log('collectionJsonUri:', collectionJsonUri)
    fs.writeFileSync(
      'scripts/solana/cNFT/example/collectionJsonUri.txt',
      collectionJsonUri
    )

    const collectionMint = generateSigner(umi)
    await createNft(umi, {
      mint: collectionMint,
      symbol: COLLECTION_SYMBOL,
      name: COLLECTION_NAME,
      uri: collectionJsonUri,
      sellerFeeBasisPoints: percentAmount(FEE_PERCENT),
      isCollection: true,
    }).sendAndConfirm(umi)

    const collectionMintExplolerUrl = `https://explorer.solana.com/address/${
      collectionMint.publicKey
    }${process.env.NODE_ENV !== 'production' && '?cluster=devnet'}`

    console.log('collectionMint:', collectionMintExplolerUrl)
    fs.writeFileSync(
      `scripts/solana/cNFT/example/collectionMint${
        process.env.NODE_ENV === 'production' ? 'Mainnet' : 'Devnet'
      }.txt`,
      collectionMint.publicKey
    )
  } catch (e) {
    console.error(e)
  }
}

void run()
