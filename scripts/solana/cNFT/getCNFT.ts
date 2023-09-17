import dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  signerIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi'
import { COLLECTION_MINT, MINT_ITEM_TO } from './config'
import { mplBubblegum, readApi } from '@metaplex-foundation/mpl-bubblegum'

const rpcURL =
  (process.env.NODE_ENV === 'production'
    ? process.env.SOLANA_MAINNET_RPC_URL
    : process.env.SOLANA_DEVNET_RPC_URL) || 'https://api.devnet.solana.com'

const payerKeyFile = process.env.WALLET_FILE || 'key.json'
const keyData = fs.readFileSync(payerKeyFile, 'utf8')
const secretKey = new Uint8Array(JSON.parse(keyData))

const run = async () => {
  try {
    const umi = createUmi(rpcURL).use(mplTokenMetadata()).use(mplBubblegum())

    const keyPair = umi.eddsa.createKeypairFromSecretKey(secretKey)
    const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
    umi.use(signerIdentity(signer))

    const rpcAssetListByOwner = await umi.rpc.getAssetsByOwner({
      owner: MINT_ITEM_TO,
    })
    console.log('rpcAssetList:', rpcAssetListByOwner)
    const rpcAssetListByCollection = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: COLLECTION_MINT,
    })
    console.log('rpcAssetListByCollection:', rpcAssetListByCollection)
  } catch (e) {
    console.error(e)
  }
}

void run()
