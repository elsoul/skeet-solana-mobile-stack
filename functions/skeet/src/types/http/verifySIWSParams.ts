import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features'

export type VerifySIWSParams = {
  input: SolanaSignInInput
  output: SolanaSignInOutput
}
