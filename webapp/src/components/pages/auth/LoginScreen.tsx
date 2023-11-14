import { useTranslation } from 'next-i18next'
import clsx from 'clsx'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import SolanaLogoHorizontal from '@/components/common/atoms/SolanaLogoHorizontal'
import { useWallet } from '@solana/wallet-adapter-react'
import useToastMessage from '@/hooks/useToastMessage'
import { useCallback } from 'react'
import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features'
import { fetchSkeetFunctions } from '@/lib/skeet/functions'
import { CreateSignInDataParams } from '@/types/http/skeet/createSignInDataParams'
import { VerifySIWSParams } from '@/types/http/skeet/verifySIWSParams'
import { auth, db } from '@/lib/firebase'
import { signInWithCustomToken, signOut } from 'firebase/auth'
import { User, genUserPath } from '@/types/models'
import { useRecoilState } from 'recoil'
import { defaultUser, userState } from '@/store/user'
import { get } from '@/lib/skeet/firestore'

export default function LoginScreen() {
  const { t } = useTranslation()
  const { connected, signIn } = useWallet()
  const [_user, setUser] = useRecoilState(userState)
  const addToast = useToastMessage()

  const signInWithSolana = useCallback(async () => {
    try {
      if (!signIn) {
        throw new Error('signIn is not defined')
      }
      if (signIn && db && auth) {
        const createResponse =
          await fetchSkeetFunctions<CreateSignInDataParams>(
            'skeet',
            'createSignInData',
            {},
          )
        const signInResponse = await createResponse?.json()
        const input: SolanaSignInInput = signInResponse?.signInData
        const signInResult = await signIn(input)
        const output: SolanaSignInOutput = {
          ...signInResult,
          account: {
            address: signInResult.account.address,
            publicKey: signInResult.account.publicKey,
            chains: signInResult.account.chains,
            features: signInResult.account.features,
            label: signInResult.account.label,
            icon: signInResult.account.icon,
          },
        }
        const verifyResponse = await fetchSkeetFunctions<VerifySIWSParams>(
          'skeet',
          'verifySIWS',
          { input, output },
        )
        addToast({
          title: t('auth:verifyTitle'),
          description: t('auth:verifyDescription'),
          type: 'info',
        })
        const success = await verifyResponse?.json()
        const userCredential = await signInWithCustomToken(auth, success?.token)
        const { email, username, iconUrl } = await get<User>(
          db,
          genUserPath(),
          userCredential.user.uid,
        )
        setUser({
          uid: userCredential.user.uid,
          email,
          username,
          iconUrl,
        })

        return false
      }
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        addToast({
          title: err.name,
          description: err.message,
          type: 'error',
        })
      }
      if (auth) {
        setUser(defaultUser)
        await signOut(auth)
      }
    }
  }, [addToast, signIn, setUser])

  return (
    <>
      <div className="px-6 py-24 lg:px-8 lg:py-48">
        <div className="pa-4 flex h-full flex-col items-center justify-center border-2 border-gray-900 shadow-lg dark:border-white sm:mx-auto sm:w-full sm:max-w-md md:max-w-lg">
          <div className="mt-20">
            <SolanaLogoHorizontal className="mx-auto w-48" />
            <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-gray-500 dark:text-gray-300">
              {t('auth:signInWithSolana')}
            </h2>
          </div>
          <div className="mb-20 mt-12 w-full sm:mx-auto sm:max-w-md">
            <div className="mb-2 flex flex-col items-center justify-center gap-y-10">
              <div
                className={clsx(
                  'flex flex-row items-center justify-center rounded-none bg-gray-900 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700',
                )}
              >
                <WalletMultiButton />
              </div>
              <div
                className={clsx(
                  'flex flex-col items-center justify-center gap-2',
                )}
              >
                <button
                  onClick={async () => {
                    await signInWithSolana()
                  }}
                  disabled={!connected}
                  className={clsx(
                    'px-6 py-2',
                    !connected
                      ? 'bg-gray-300 text-white hover:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
                      : 'bg-green-700 text-white hover:cursor-pointer hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-800',
                  )}
                >
                  {t('auth:signIn')}
                </button>
                {!connected && (
                  <p className="font-light text-gray-500">
                    {t('auth:pleaseConnectWallet')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
