import { onRequest } from 'firebase-functions/v2/https'
import { publicHttpOption } from '@/routings/options'
import { TypedRequestBody } from '@/types/http'
import { CreateSignInDataParams } from '@/types/http/createSignInDataParams'

export const createSignInData = onRequest(publicHttpOption, async (req: TypedRequestBody<CreateSignInDataParams>, res) => {
  try {
    res.json({
      status: 'success'
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: String(error) })
  }
})
  