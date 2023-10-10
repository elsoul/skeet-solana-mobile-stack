import { Pressable, Text, View } from 'react-native'
import DefaultLayout from '@/layouts/default/DefaultLayout'
import tw from '@/lib/tailwind'
import { useTranslation } from 'react-i18next'
import useColorModeRefresh from '@/hooks/useColorModeRefresh'
import LogoHorizontal from '@/components/common/atoms/LogoHorizontal'
import { useNavigation } from '@react-navigation/native'
import { useCallback, useState, useEffect, useMemo } from 'react'
import Toast from 'react-native-toast-message'
import useAnalytics from '@/hooks/useAnalytics'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import clsx from 'clsx'
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol'
import SolanaLogo from '@assets/logo/solanaLogoMark.svg'

export const APP_IDENTITY = {
  name: 'Skeet Dev',
  uri: 'https://skeet.dev/',
  icon: 'favicon.png', // resolves to uri/icon like https://skeet.dev/favicon.png in this example
}

export default function LoginScreen() {
  useColorModeRefresh()
  useAnalytics()
  const { t } = useTranslation()
  const navigation = useNavigation<any>()
  const [isLoading, setLoading] = useState(false)

  return (
    <>
      <DefaultLayout>
        <View
          style={tw`flex h-full flex-col items-center justify-start py-12 sm:px-6 lg:px-8`}
        >
          <View style={tw`sm:mx-auto sm:w-full sm:max-w-md`}>
            <View style={tw`mx-auto`}>
              <LogoHorizontal className="w-24" />
            </View>
            <Text
              style={tw`font-loaded-bold mt-6 text-center text-3xl tracking-tight text-gray-900 dark:text-white`}
            >
              Solana Mobile Stack
            </Text>
          </View>
          <View style={tw`w-full sm:mx-auto sm:max-w-md pt-8`}>
            <View style={tw`px-4 py-6 sm:px-10 gap-6`}>
              <Pressable
                onPress={async () => {
                  await transact(async (mobileWallet) => {
                    const authorization = await mobileWallet.authorize({
                      cluster: 'devnet',
                      identity: APP_IDENTITY,
                    })
                    console.log(authorization)
                    Toast.show({
                      type: 'success',
                      text1: 'Welcome to Skeet Dev🎉',
                      text2: `You signed with ${authorization.accounts[0].address}`,
                    })
                  })
                }}
                style={tw`${clsx(
                  'flex flex-row items-center justify-center w-full px-3 py-2 bg-gray-900 dark:bg-gray-600'
                )}`}
              >
                <SolanaLogo style={tw`${clsx('mr-3 h-6 w-6 flex-shrink-0')}`} />

                <Text
                  style={tw`text-center font-loaded-bold text-lg text-white`}
                >
                  Sign In With Solana
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </DefaultLayout>
    </>
  )
}
