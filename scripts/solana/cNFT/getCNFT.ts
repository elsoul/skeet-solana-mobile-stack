import dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  mplTokenMetadata,
  fetchAllDigitalAssetByOwner,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  signerIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'

import { OWNER_PUBKEY } from './config'

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

    const assetsByOwner = await fetchAllDigitalAssetByOwner(umi, OWNER_PUBKEY)
    console.log('Assets by Owner: ', assetsByOwner)
  } catch (e) {
    console.error(e)
  }
}

void run()
