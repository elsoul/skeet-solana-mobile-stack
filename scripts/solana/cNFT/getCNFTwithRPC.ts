import dotenv from 'dotenv'
dotenv.config()

import { COLLECTION_MINT_ADDRESS, OWNER_ADDRESS } from './config'

const rpcURL =
  (process.env.NODE_ENV === 'production'
    ? process.env.SOLANA_MAINNET_RPC_URL
    : process.env.SOLANA_DEVNET_RPC_URL) || 'https://api.devnet.solana.com'

const run = async () => {
  try {
    const assetsByOwner = await getAssetsByOwner()
    console.log('Assets by Owner: ', assetsByOwner.items)
    const assetsByCollection = await getAssetsByCollection()
    console.log('Assets by Collection: ', assetsByCollection.items)
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
