import { onRequest } from 'firebase-functions/v2/https'
import { publicHttpOption } from '@/routings/options'
import { TypedRequestBody } from '@common/types/http'
import { CreateSignInDataParams } from '@common/types/http/createSignInDataParams'
import { SolanaSignInInput } from '@solana/wallet-standard-features'

export const createSignInData = onRequest(
  publicHttpOption,
  async (req: TypedRequestBody<CreateSignInDataParams>, res) => {
    try {
      const now: Date = new Date()
      const uri = req.headers.origin || ''
      const currentUrl = new URL(uri)
      const domain = currentUrl.host

      const currentDateTime = now.toISOString()
      const signInData: SolanaSignInInput = {
        domain,
        statement:
          'Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.',
        version: '1',
        nonce: 'oBbLoEldZs',
        chainId: 'solana:mainnet',
        issuedAt: currentDateTime,
        resources: ['https://skeet.dev', 'https://phantom.app/'],
      }

      res.json({
        signInData,
      })
    } catch (error) {
      res.status(500).json({ status: 'error', message: String(error) })
    }
  },
)
