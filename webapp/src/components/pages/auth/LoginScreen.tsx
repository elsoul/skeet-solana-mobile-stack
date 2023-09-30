import { useTranslation } from 'next-i18next'
import clsx from 'clsx'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import SolanaLogoHorizontal from '@/components/common/atoms/SolanaLogoHorizontal'

export default function LoginScreen() {
  const { t } = useTranslation()

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
            <div className="mb-2 flex flex-row items-center justify-center">
              <div
                className={clsx(
                  'flex flex-row items-center justify-center rounded-none bg-gray-900 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700',
                )}
              >
                <WalletMultiButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
