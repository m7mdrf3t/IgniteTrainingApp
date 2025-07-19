import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { WelcomeScreen } from "@/screens/auth/WelcomeScreen"
import { SignInScreen } from "@/screens/auth/SignInScreen"
import { SignUpScreen } from "@/screens/auth/SignUpScreen"
import { PasswordResetScreen } from "@/screens/auth/PasswordResetScreen"
import { useAppTheme } from "@/utils/useAppTheme"

export type AuthStackParamList = {
  Welcome: undefined
  SignIn: undefined
  SignUp: undefined
  PasswordReset: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

export const AuthNavigator = observer(function AuthNavigator() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
    </Stack.Navigator>
  )
})
