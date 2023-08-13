import ChatMenu, { ChatRoom } from '@/components/pages/user/chat/ChatMenu'
import ChatBox from '@/components/pages/user/chat/ChatBox'
import { useCallback, useEffect, useState } from 'react'
import { userState } from '@/store/user'
import { useRecoilValue } from 'recoil'
import useToastMessage from '@/hooks/useToastMessage'
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useTranslation } from 'next-i18next'

export default function ChatScreen() {
  const { t } = useTranslation()
  const [isNewChatModalOpen, setNewChatModalOpen] = useState(false)
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(
    null
  )

  const user = useRecoilValue(userState)

  const [chatList, setChatList] = useState<ChatRoom[]>([])
  const [lastChat, setLastChat] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [isDataLoading, setDataLoading] = useState(false)
  const addToast = useToastMessage()

  const getChatRooms = useCallback(async () => {
    if (db && user.uid) {
      try {
        setDataLoading(true)

        const q = query(
          collection(db, `User/${user.uid}/UserChatRoom`),
          orderBy('createdAt', 'desc'),
          limit(15)
        )
        const querySnapshot = await getDocs(q)
        const list: ChatRoom[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          list.push({ id: doc.id, ...data } as ChatRoom)
        })

        setChatList(list)
        setLastChat(querySnapshot.docs[querySnapshot.docs.length - 1])
      } catch (err) {
        console.log(err)
        if (err instanceof Error && err.message.includes('permission-denied')) {
          addToast({
            type: 'error',
            title: t('errorTokenExpiredTitle') ?? 'Token Expired.',
            description: t('errorTokenExpiredBody') ?? 'Please sign in again.',
          })
        } else {
          addToast({
            type: 'error',
            title: t('errorTitle') ?? 'Error',
            description:
              t('errorBody') ?? 'Something went wrong... Please try it again.',
          })
        }
      } finally {
        setDataLoading(false)
      }
    }
  }, [user.uid, setDataLoading, addToast, t])

  useEffect(() => {
    getChatRooms()
  }, [getChatRooms])

  return (
    <>
      <div className="content-height flex w-full flex-col items-start justify-start overflow-auto sm:flex-row">
        <ChatMenu
          isNewChatModalOpen={isNewChatModalOpen}
          setNewChatModalOpen={setNewChatModalOpen}
          currentChatRoomId={currentChatRoomId}
          setCurrentChatRoomId={setCurrentChatRoomId}
          chatList={chatList}
          setChatList={setChatList}
          lastChat={lastChat}
          setLastChat={setLastChat}
          isDataLoading={isDataLoading}
          setDataLoading={setDataLoading}
          getChatRooms={getChatRooms}
        />
        <ChatBox
          setNewChatModalOpen={setNewChatModalOpen}
          currentChatRoomId={currentChatRoomId}
          getChatRooms={getChatRooms}
        />
      </div>
    </>
  )
}
