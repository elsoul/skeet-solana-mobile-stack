import { onRequest } from 'firebase-functions/v2/https'
import { publicHttpOption } from '@/routings/options'
import { TypedRequestBody } from '@/types/http'
import { VerifySIWSParams } from '@/types/http/verifySIWSParams'
import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features'
import { verifySignIn } from '@solana/wallet-standard-util'
import { getAuth } from 'firebase-admin/auth'
import bs58 from 'bs58'

export const verifySIWS = onRequest(
  publicHttpOption,
  async (req: TypedRequestBody<VerifySIWSParams>, res) => {
    try {
      const backendInput: SolanaSignInInput = req.body.input
      const { output } = req.body
      const backendOutput: SolanaSignInOutput = {
        account: {
          ...output.account,
          publicKey: new Uint8Array(Object.values(output.account.publicKey)),
        },
        signature: new Uint8Array(Buffer.from(output.signature)),
        signedMessage: new Uint8Array(Buffer.from(output.signedMessage)),
      }

      if (!verifySignIn(backendInput, backendOutput)) {
        console.error('Sign In verification failed!')
        throw new Error('Sign In verification failed!')
      }

      const token = await getAuth().createCustomToken(
        bs58.encode(backendOutput.account.publicKey),
      )

      res.json({
        status: 'success',
        token,
      })
    } catch (error) {
      res.status(500).json({ status: 'error', message: String(error) })
    }
  },
)
