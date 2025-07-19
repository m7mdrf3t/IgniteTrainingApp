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

interface SignUpScreenProps extends NativeStackScreenProps<AuthStackParamList, "SignUp"> {}

interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
}

const signUpSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
})

export const SignUpScreen = observer(function SignUpScreen(_props: SignUpScreenProps) {
  const { themed } = useAppTheme()
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    authenticationStore.setError(undefined)

    try {
      const response = await authService.signUp({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })

      if (response.success && response.data) {
        // Update store with user data
        authenticationStore.setAuthToken(response.data.session?.access_token)
        authenticationStore.setUser(response.data.user)
        authenticationStore.setSession(response.data.session)
        authenticationStore.setAuthEmail(data.email)

        Alert.alert(
          "Success",
          "Account created successfully! Please check your email to verify your account.",
          [
            {
              text: "OK",
              onPress: () => _props.navigation.navigate("SignIn"),
            },
          ],
        )
      } else {
        authenticationStore.setError(response.error || "Sign up failed")
        Alert.alert("Error", response.error || "Sign up failed")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      authenticationStore.setError(errorMessage)
      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = () => {
    _props.navigation.navigate("SignIn")
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($containerStyle)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text text="Create Account" preset="heading" style={themed($titleStyle)} />

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
            autoComplete="new-password"
            style={themed($inputStyle)}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            status={errors.confirmPassword ? "error" : undefined}
            helper={errors.confirmPassword?.message}
            secureTextEntry
            autoComplete="new-password"
            style={themed($inputStyle)}
          />
        )}
      />

      <Button
        text="Sign Up"
        preset="filled"
        style={themed($buttonStyle)}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      />

      <Text text="Already have an account?" preset="subheading" style={themed($signInTextStyle)} />

      <Button
        text="Sign In"
        preset="default"
        style={themed($buttonStyle)}
        onPress={handleSignIn}
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

const $signInTextStyle: TextStyle = {
  marginBottom: 16,
  textAlign: "center",
}
