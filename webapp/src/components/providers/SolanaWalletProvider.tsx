import { ReactNode, useMemo, useCallback } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletError, WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import useToastMessage from '@/hooks/useToastMessage'

type Props = {
  children: ReactNode
}

const network = WalletAdapterNetwork.Mainnet
export const solanaEndpoint = 'https://api.mainnet-beta.solana.com'

export default function SolanaWalletProvider({ children }: Props) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new LedgerWalletAdapter(),
    ],
    [],
  )
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

  return (
    <>
      <ConnectionProvider endpoint={solanaEndpoint}>
        <WalletProvider wallets={wallets} onError={onError}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}
