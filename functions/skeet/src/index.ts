import admin from 'firebase-admin'
import { dotenv } from '@skeet-framework/utils'

dotenv.config()
admin.initializeApp()
export const db = admin.firestore()

export {
  // This part is automatically generated by Skeet Framework.
  // Please do not edit this part.
  // Skeet Doc: https://skeet.dev
  addStreamUserChatRoomMessage,
  addVertexMessage,
  createUserChatRoom,
  addUserChatRoomMessage,
  createSignInData,
  verifySIWS,
} from '@/routings'
