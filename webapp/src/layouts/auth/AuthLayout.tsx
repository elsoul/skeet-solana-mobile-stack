import type { ReactNode } from 'react'
import { useEffect, useCallback } from 'react'
import CommonFooter from '@/layouts/common/CommonFooter'
import { User, signOut } from 'firebase/auth'
import AuthHeader from './AuthHeader'
import { useRecoilState } from 'recoil'
import { defaultUser, userState } from '@/store/user'
import { auth, db } from '@/lib/firebase'
import { User as UserModel, genUserPath } from '@common/models/userModels'
import { get } from '@/lib/skeet/firestore'
import useI18nRouter from '@/hooks/useI18nRouter'

type Props = {
  children: ReactNode
}

const mainContentId = 'authMainContent'

export default function AuthLayout({ children }: Props) {
  const { router, routerPush } = useI18nRouter()

  const resetWindowScrollPosition = useCallback(() => {
    const element = document.getElementById(mainContentId)
    if (element) {
      element.scrollIntoView({ block: 'start' })
    }
  }, [])
  useEffect(() => {
    void (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100))
        if (!router.asPath.includes('#')) {
          resetWindowScrollPosition()
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [router.asPath, resetWindowScrollPosition])

  const [_user, setUser] = useRecoilState(userState)

  const onAuthStateChanged = useCallback(
    async (fbUser: User | null) => {
      if (auth && db && fbUser) {
        try {
          const { email, username, iconUrl } = await get<UserModel>(
            db,
            genUserPath(),
            fbUser.uid
          )
          setUser({
            uid: fbUser.uid,
            email,
            username,
            iconUrl,
          })
          await routerPush('/user/vertex-ai')
        } catch (e) {
          console.error(e)
          setUser(defaultUser)
          await signOut(auth)
        }
      } else {
        setUser(defaultUser)
      }
    },
<<<<<<< HEAD
    [setUser, router]
=======
    [setUser, routerPush],
>>>>>>> d8815160c7ec77c3a8e6056ca4df588ac6e7958d
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
