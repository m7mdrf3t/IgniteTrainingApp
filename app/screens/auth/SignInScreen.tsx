import { useState } from "react"
import { ViewStyle, TextStyle, Alert } from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Screen, Text, Button, TextField } from "@/components"
import { AuthStackParamList } from "@/navigators/AuthNavigator"
import { useAppTheme } from "@/utils/useAppTheme"
import { useStores } from "@/models"
import { authService } from "@/services/authService"

interface SignInScreenProps extends NativeStackScreenProps<AuthStackParamList, "SignIn"> {}

interface SignInFormData {
  email: string
  password: string
}

const signInSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
})

export const SignInScreen = observer(function SignInScreen(_props: SignInScreenProps) {
  const { themed } = useAppTheme()
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    authenticationStore.setError(undefined)

    try {
      const response = await authService.signIn({
        email: data.email,
        password: data.password,
      })

      if (response.success && response.data) {
        // Update store with user data
        authenticationStore.setAuthToken(response.data.session.access_token)
        authenticationStore.setUser(response.data.user)
        authenticationStore.setSession(response.data.session)
        authenticationStore.setUserRole(response.data.role)
        authenticationStore.setAuthEmail(data.email)

        // Navigate to main app - we need to navigate to the parent navigator
        _props.navigation.getParent()?.navigate("MainApp" as any)
      } else {
        authenticationStore.setError(response.error || "Sign in failed")
        Alert.alert("Error", response.error || "Sign in failed")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      authenticationStore.setError(errorMessage)
      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    _props.navigation.navigate("PasswordReset")
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
      <Text text="Sign In" preset="heading" style={themed($titleStyle)} />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Email"
            placeholder="Enter your email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            status={errors.email ? "error" : undefined}
            helper={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={themed($inputStyle)}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Password"
            placeholder="Enter your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            status={errors.password ? "error" : undefined}
            helper={errors.password?.message}
            secureTextEntry
            autoComplete="password"
            style={themed($inputStyle)}
          />
        )}
      />

      <Button
        text="Sign In"
        preset="filled"
        style={themed($buttonStyle)}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      />

      <Button
        text="Forgot Password?"
        preset="default"
        style={themed($linkButtonStyle)}
        onPress={handleForgotPassword}
        disabled={isLoading}
      />

      <Text text="Don't have an account?" preset="subheading" style={themed($signUpTextStyle)} />

      <Button
        text="Sign Up"
        preset="default"
        style={themed($buttonStyle)}
        onPress={handleSignUp}
        disabled={isLoading}
      />
    </Screen>
  )
})

const $containerStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: 24,
  paddingTop: 60,
}

const $titleStyle: TextStyle = {
  marginBottom: 32,
  textAlign: "center",
}

const $inputStyle: ViewStyle = {
  marginBottom: 16,
}

const $buttonStyle: ViewStyle = {
  marginBottom: 16,
  marginTop: 8,
}

const $linkButtonStyle: ViewStyle = {
  marginBottom: 32,
}

const $signUpTextStyle: TextStyle = {
  marginBottom: 16,
  textAlign: "center",
}
