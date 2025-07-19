import { ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen, Text, Button } from "@/components"
import { AuthStackParamList } from "@/navigators/AuthNavigator"
import { useAppTheme } from "@/utils/useAppTheme"

interface WelcomeScreenProps extends NativeStackScreenProps<AuthStackParamList, "Welcome"> {}

export const WelcomeScreen = observer(function WelcomeScreen(_props: WelcomeScreenProps) {
  const { themed } = useAppTheme()

  const handleSignIn = () => {
    _props.navigation.navigate("SignIn")
  }

  const handleSignUp = () => {
    _props.navigation.navigate("SignUp")
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($containerStyle)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text text="Welcome to Ignite Training App" preset="heading" style={themed($titleStyle)} />

      <Text
        text="Get started by signing in or creating a new account"
        preset="subheading"
        style={themed($subtitleStyle)}
      />

      <Button text="Sign In" preset="filled" style={themed($buttonStyle)} onPress={handleSignIn} />

      <Button text="Sign Up" preset="default" style={themed($buttonStyle)} onPress={handleSignUp} />
    </Screen>
  )
})

const $containerStyle: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
}

const $titleStyle: TextStyle = {
  marginBottom: 16,
  textAlign: "center",
}

const $subtitleStyle: TextStyle = {
  marginBottom: 48,
  textAlign: "center",
}

const $buttonStyle: ViewStyle = {
  marginBottom: 16,
  width: "100%",
  maxWidth: 300,
}
