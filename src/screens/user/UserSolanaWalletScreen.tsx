import tw from '@/lib/tailwind'
import { Pressable, Text, View } from 'react-native'
import useColorModeRefresh from '@/hooks/useColorModeRefresh'
import { useTranslation } from 'react-i18next'
import UserLayout from '@/layouts/user/UserLayout'
import useAnalytics from '@/hooks/useAnalytics'
import { ScrollView } from 'react-native-gesture-handler'
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol'
import { APP_IDENTITY } from '../LoginScreen'
import Toast from 'react-native-toast-message'
import SolanaLogo from '@assets/logo/solanaLogoMark.svg'
import clsx from 'clsx'

export default function UserSolanaWalletScreen() {
  useColorModeRefresh()
  useAnalytics()
  const { t } = useTranslation()

  return (
    <>
      <UserLayout>
        <ScrollView
          style={tw`flex h-screen-bar w-full bg-white dark:bg-gray-900`}
        >
          <View style={tw`h-24 w-full bg-white dark:bg-gray-900`}>
            <View
              style={tw`flex flex-row items-center justify-between p-6 md:justify-start md:gap-10`}
            >
              <View style={tw`flex flex-1`}>
                <Text
                  style={tw`font-loaded-bold text-3xl text-gray-900 dark:text-gray-50`}
                >
                  {t('solana.title')}
                </Text>
              </View>
              <View
                style={tw`flex flex-row items-center justify-end gap-6`}
              ></View>
            </View>
          </View>
          <View
            style={tw`flex flex-col items-center justify-center sm:items-start bg-white dark:bg-gray-900 w-full`}
          >
            <View
              style={tw`flex flex-col sm:flex-row items-start max-w-md sm:gap-8 px-4 w-full`}
            >
              <View style={tw`flex flex-col w-full`}>
                <Pressable
                  onPress={async () => {
                    await transact(async (mobileWallet) => {
                      const authorization = await mobileWallet.authorize({
                        cluster: 'devnet',
                        identity: APP_IDENTITY,
                      })
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
                  <SolanaLogo
                    style={tw`${clsx('mr-3 h-6 w-6 flex-shrink-0')}`}
                  />

                  <Text
                    style={tw`text-center font-loaded-bold text-lg text-white`}
                  >
                    Connect your wallet
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </UserLayout>
    </>
  )
}
