import LoginScreen from '@/screens/LoginScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export const defaultRoutes = [
  {
    name: 'Login',
    component: LoginScreen,
  },
]

const Stack = createNativeStackNavigator()

export default function DefaultRoutes() {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {defaultRoutes.map((route) => (
          <Stack.Screen
            key={`DefaultRoutes ${route.name}`}
            name={route.name}
            component={route.component}
          />
        ))}
      </Stack.Navigator>
    </>
  )
}
