import dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'
import * as bs58 from 'bs58'

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
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
  CREATORS,
  NFT_ITEM_IMAGE_URL,
  NFT_ITEM_ATTRIBUTES,
  COLLECTION_MINT,
  NFT_ITEM_NAME,
  MINT_ITEM_TO,
  MERKLE_TREE,
} from './config'
import {
  fetchMerkleTree,
  mintToCollectionV1,
  mplBubblegum,
} from '@metaplex-foundation/mpl-bubblegum'

const rpcURL =
  (process.env.NODE_ENV === 'production'
    ? process.env.SOLANA_MAINNET_RPC_URL
    : process.env.SOLANA_DEVNET_RPC_URL) || 'https://api.devnet.solana.com'

const payerKeyFile = process.env.WALLET_FILE || 'key.json'
const keyData = fs.readFileSync(payerKeyFile, 'utf8')
const secretKey = new Uint8Array(JSON.parse(keyData))

const nftStorageToken = process.env.NFT_STORAGE_KEY || ''

const run = async () => {
  try {
    const umi = createUmi(rpcURL)
      .use(mplTokenMetadata())
      .use(nftStorageUploader({ token: nftStorageToken }))
      .use(mplBubblegum())

    const keyPair = umi.eddsa.createKeypairFromSecretKey(secretKey)
    const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
    umi.use(signerIdentity(signer))

    const merkleTreeAccount = await fetchMerkleTree(umi, MERKLE_TREE)

    const nftItemJsonObject = {
      name: COLLECTION_NAME,
      symbol: COLLECTION_SYMBOL,
      description: COLLECTION_DESCRIPTION,
      seller_fee_basis_points: FEE_PERCENT * 100,
      image: NFT_ITEM_IMAGE_URL,
      external_url: EXTERNAL_URL,
      attributes: NFT_ITEM_ATTRIBUTES,
      properties: {
        category: 'image',
        files: [
          {
            file: NFT_ITEM_IMAGE_URL,
            type: 'image/png',
          },
        ],
        creators: CREATORS,
      },
    }

    const nftItemJsonUri = await umi.uploader.uploadJson(nftItemJsonObject)
    console.log('nftItemJsonUri:', nftItemJsonUri)
    fs.writeFileSync(
      'scripts/solana/cNFT/example/nftItemJsonUri.txt',
      nftItemJsonUri
    )

    const mint = await mintToCollectionV1(umi, {
      leafOwner: MINT_ITEM_TO,
      merkleTree: merkleTreeAccount.publicKey,
      collectionMint: COLLECTION_MINT,
      metadata: {
        name: NFT_ITEM_NAME,
        uri: nftItemJsonUri,
        sellerFeeBasisPoints: FEE_PERCENT * 100,
        collection: { key: COLLECTION_MINT, verified: false },
        creators: CREATORS,
      },
    }).sendAndConfirm(umi)

    const nftItemMintExplolerUrl = `https://explorer.solana.com/tx/${bs58.encode(
      mint.signature
    )}${process.env.NODE_ENV !== 'production' && '?cluster=devnet'}`

    console.log('nftItemMint:', nftItemMintExplolerUrl)
    fs.writeFileSync(
      `scripts/solana/cNFT/example/nftItemMint${
        process.env.NODE_ENV === 'production' ? 'Mainnet' : 'Devnet'
      }.txt`,
      bs58.encode(mint.signature)
    )
  } catch (e) {
    console.error(e)
  }
}

void run()
