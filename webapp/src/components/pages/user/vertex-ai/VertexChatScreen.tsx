import VertexChatMenu, {
  ChatRoom,
} from '@/components/pages/user/vertex-ai/VertexChatMenu'
import VertexChatBox from '@/components/pages/user/vertex-ai/VertexChatBox'
import { Suspense, useCallback, useEffect, useState } from 'react'
import UserScreenLoading from '@/components/loading/UserScreenLoading'
import clsx from 'clsx'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'next-i18next'
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
import { useRecoilValue } from 'recoil'
import { userState } from '@/store/user'
import { createFirestoreDataConverter, db } from '@/lib/firebase'
import { VertexChatRoom } from '@/types/models'

export default function VertexChatScreen() {
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
          collection(db, `User/${user.uid}/VertexChatRoom`),
          orderBy('createdAt', 'desc'),
          limit(15)
        ).withConverter(createFirestoreDataConverter<VertexChatRoom>())

        const querySnapshot = await getDocs(q)
        const list: ChatRoom[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          list.push({ id: doc.id, ...data } as ChatRoom)
        })
        console.log(list)
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
      <div className="flex h-full w-full flex-col items-start justify-start overflow-auto sm:flex-row">
        <VertexChatMenu
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
        {!currentChatRoomId && (
          <div className="flex h-full w-full flex-1 flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 p-4">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                {t('vertex-ai:vertexAICustom')}
              </h2>
              <button
                onClick={() => {
                  setNewChatModalOpen(true)
                }}
                className={clsx(
                  'flex w-full flex-row items-center justify-center gap-4 bg-gray-900 px-3 py-2 hover:cursor-pointer hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-400'
                )}
              >
                <PlusCircleIcon className="h-6 w-6 text-white" />
                <span className="text-lg font-bold text-white">
                  {t('vertex-ai:newChat')}
                </span>
              </button>
            </div>
          </div>
        )}
        {currentChatRoomId && (
          <>
            <Suspense fallback={<UserScreenLoading />}>
              <VertexChatBox
                setNewChatModalOpen={setNewChatModalOpen}
                currentChatRoomId={currentChatRoomId}
                getChatRooms={getChatRooms}
              />
            </Suspense>
          </>
        )}
      </div>
    </>
  )
}
