import { onRequest } from 'firebase-functions/v2/https'
import { publicHttpOption } from '@/routings/options'
import { TypedRequestBody } from '@/types/http'
import { VerifySIWSParams } from '@/types/http/verifySIWSParams'

export const verifySIWS = onRequest(publicHttpOption, async (req: TypedRequestBody<VerifySIWSParams>, res) => {
  try {
    res.json({
      status: 'success'
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: String(error) })
  }
})
  