import dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi'
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage'

import { createTree, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'

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

    const merkleTree = generateSigner(umi)
    const builder = await createTree(umi, {
      merkleTree,
      maxDepth: 14,
      maxBufferSize: 64,
    })
    await builder.sendAndConfirm(umi)

    console.log('merkleTree:', merkleTree.publicKey)
    fs.writeFileSync(
      `scripts/solana/cNFT/example/merkleTree${
        process.env.NODE_ENV === 'production' ? 'Mainnet' : 'Devnet'
      }.txt`,
      merkleTree.publicKey
    )
  } catch (e) {
    console.error(e)
  }
}

void run()
