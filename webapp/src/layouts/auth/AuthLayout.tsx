import type { ReactNode } from 'react'
import { useEffect, useCallback, useState } from 'react'
import CommonFooter from '@/layouts/common/CommonFooter'
import { User, signOut } from 'firebase/auth'

import { useRouter } from 'next/router'
import AuthHeader from './AuthHeader'
import { useRecoilState } from 'recoil'
import { defaultUser, userState } from '@/store/user'
import { auth, db } from '@/lib/firebase'
import { User as UserModel, genUserPath } from '@/types/models/userModels'
import { get } from '@/lib/skeet/firestore'

type Props = {
  children: ReactNode
}

const mainContentId = 'authMainContent'

export default function AuthLayout({ children }: Props) {
  const router = useRouter()

  const resetWindowScrollPosition = useCallback(() => {
    const element = document.getElementById(mainContentId)
    if (element) {
      element.scrollIntoView({ block: 'start' })
    }
  }, [])
  useEffect(() => {
    ;(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (!router.asPath.includes('#')) {
        resetWindowScrollPosition()
      }
    })()
  }, [router.asPath, resetWindowScrollPosition])

  const [_user, setUser] = useRecoilState(userState)

  const onAuthStateChanged = useCallback(
    async (fbUser: User | null) => {
      if (auth && db && fbUser && fbUser.emailVerified) {
        try {
          const { username, iconUrl } = await get<UserModel>(
            db,
            genUserPath(),
            fbUser.uid
          )
          setUser({
            uid: fbUser.uid,
            email: fbUser.email ?? '',
            username,
            iconUrl,
            emailVerified: fbUser.emailVerified,
          })
          router.push('/user/chat')
        } catch (e) {
          console.error(e)
          setUser(defaultUser)
          signOut(auth)
        }
      } else {
        setUser(defaultUser)
      }
    },
    [setUser, router]
  )

  useEffect(() => {
    let subscriber = () => {}

    if (auth) {
      subscriber = auth.onAuthStateChanged(onAuthStateChanged)
    }
    return () => subscriber()
  }, [onAuthStateChanged])

  return (
    <>
      <div className="relative h-full w-full bg-white dark:bg-gray-900">
        <AuthHeader />
        <div id={mainContentId} className="min-h-screen">
          {children}
        </div>
        <CommonFooter />
      </div>
    </>
  )
}
