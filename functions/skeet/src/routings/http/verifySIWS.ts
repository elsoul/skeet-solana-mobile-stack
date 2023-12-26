import { onRequest } from 'firebase-functions/v2/https'
import { publicHttpOption } from '@/routings/options'
import { TypedRequestBody } from '@common/types/http'
import { VerifySIWSParams } from '@common/types/http/verifySIWSParams'
import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features'
import { verifySignIn } from '@solana/wallet-standard-util'
import { getAuth } from 'firebase-admin/auth'
import bs58 from 'bs58'
import { User } from '@common/models'
import { db } from '@/index'
import { gravatarIconUrl } from '@skeet-framework/utils'
import { add, get } from '@skeet-framework/firestore'

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

      const uid = bs58.encode(backendOutput.account.publicKey)
      const userRef = await get<User>(db, 'User', uid)
      const userParams = {
        uid,
        email: '',
        username: uid.slice(0, 8),
        iconUrl: gravatarIconUrl('info@skeet.dev'),
      }
      console.log(userParams)
      if (!userRef) {
        const userRefTmp = db.collection('User').doc(uid)
        await userRefTmp.set(userParams, { merge: true })
        // await add<User>(db, 'User', userParams, uid)
        // Somehow, here gets weird error from firestore with some createdAt timestamp problem.
        // Please check it.
      }

      const token = await getAuth().createCustomToken(uid)

      res.json({
        status: 'success',
        token,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ status: 'error', message: String(error) })
    }
  },
)
