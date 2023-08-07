import tw from '@/lib/tailwind'
import { Text, View } from 'react-native'
import useColorModeRefresh from '@/hooks/useColorModeRefresh'
import { useTranslation } from 'react-i18next'
import UserLayout from '@/layouts/user/UserLayout'
import useAnalytics from '@/hooks/useAnalytics'
import { ScrollView } from 'react-native-gesture-handler'
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol'
import Button from '@/components/common/atoms/Button'
import { APP_IDENTITY } from '../LoginScreen'

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
                <Button
                  onPress={() => {
                    transact(async (mobileWallet) => {
                      const authorization = await mobileWallet.authorize({
                        cluster: 'devnet',
                        identity: APP_IDENTITY,
                      })
                      console.log(authorization)
                    })
                  }}
                >
                  <Text
                    style={tw`text-center font-loaded-bold text-lg text-white`}
                  >
                    Solana Wallet Connect
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </UserLayout>
    </>
  )
}
