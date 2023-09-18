import dotenv from 'dotenv'
dotenv.config()
// import * as fs from 'fs'

// import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
// import {
//   signerIdentity,
//   createSignerFromKeypair,
// } from '@metaplex-foundation/umi'
// import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'

// Because umi doesn't work for get cNFTs now, we use fetch json-rpc directly instead

import {
  // COLLECTION_MINT,
  // MINT_ITEM_TO,
  COLLECTION_MINT_ADDRESS,
  OWNER_ADDRESS,
} from './config'

const rpcURL =
  (process.env.NODE_ENV === 'production'
    ? process.env.SOLANA_MAINNET_RPC_URL
    : process.env.SOLANA_DEVNET_RPC_URL) || 'https://api.devnet.solana.com'

// const payerKeyFile = process.env.WALLET_FILE || 'key.json'
// const keyData = fs.readFileSync(payerKeyFile, 'utf8')
// const secretKey = new Uint8Array(JSON.parse(keyData))

const run = async () => {
  try {
    // const umi = createUmi(rpcURL).use(mplTokenMetadata()).use(mplBubblegum())

    // const keyPair = umi.eddsa.createKeypairFromSecretKey(secretKey)
    // const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair)
    // umi.use(signerIdentity(signer))
    const assetsByOwner = await getAssetsByOwner()
    console.log('Assets by Owner: ', assetsByOwner.items)
    const assetsByCollection = await getAssetsByCollection()
    console.log('Assets by Collection: ', assetsByCollection.items)
    // const rpcAssetListByOwner = await umi.rpc.getAssetsByOwner({
    //   owner: MINT_ITEM_TO,
    //   page: 1,
    //   limit: 1000,
    // })
    // console.log('rpcAssetList:', rpcAssetListByOwner)
    // const rpcAssetListByCollection = await umi.rpc.getAssetsByGroup({
    //   groupKey: 'collection',
    //   groupValue: COLLECTION_MINT,
    // })
    // console.log('rpcAssetListByCollection:', rpcAssetListByCollection)
  } catch (e) {
    console.error(e)
  }
}

async function getAssetsByOwner() {
  const response = await fetch(rpcURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: OWNER_ADDRESS,
        page: 1,
        limit: 1000,
      },
    }),
  })
  const { result } = await response.json()
  return result
}

async function getAssetsByCollection() {
  const response = await fetch(rpcURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: COLLECTION_MINT_ADDRESS,
        page: 1,
        limit: 1000,
      },
    }),
  })
  const { result } = await response.json()
  return result
}

void run()
