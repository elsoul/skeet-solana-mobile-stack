import { ReactNode, useMemo, useCallback } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletError, WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import useToastMessage from '@/hooks/useToastMessage'
import type { Adapter } from '@solana/wallet-adapter-base'
import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features'

type Props = {
  children: ReactNode
}

export const solanaNetwork = WalletAdapterNetwork.Mainnet
export const solanaEndpoint = 'https://api.mainnet-beta.solana.com'

export default function SolanaWalletProvider({ children }: Props) {
  const wallets = useMemo(() => [], [])
  const addToast = useToastMessage()

  const onError = useCallback(
    (error: WalletError) => {
      addToast({
        title: error.name,
        description: error.message,
        type: 'error',
      })
      console.error(error)
    },
    [addToast],
  )

  const autoSignIn = useCallback(async (adapter: Adapter) => {
    console.log('triggered autoSignIn')
    if (!('signIn' in adapter)) return true

    // Fetch the signInInput from the backend
    /*
    const createResponse = await fetch("/backend/createSignInData");
    const input: SolanaSignInInput = await createResponse.json();
    */
    // const input: SolanaSignInInput = await createSignInData()

    // Send the signInInput to the wallet and trigger a sign-in request
    // const output = await adapter.signIn(input)
    // const constructPayload = JSON.stringify({ input, output })

    // Verify the sign-in output against the generated input server-side
    /*
    const verifyResponse = await fetch("/backend/verifySIWS", {
      method: "POST",
      body: strPayload,
    });
    const success = await verifyResponse.json();
    */

    return false
  }, [])

  const autoConnect = useCallback(
    async (adapter: Adapter) => {
      console.log(adapter)
      adapter.autoConnect().catch((e) => {
        return autoSignIn(adapter)
      })
      return false
    },
    [autoSignIn],
  )

  return (
    <>
      <ConnectionProvider endpoint={solanaEndpoint}>
        <WalletProvider
          wallets={wallets}
          onError={onError}
          autoConnect={autoConnect}
        >
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}
