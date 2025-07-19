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

interface PasswordResetScreenProps
  extends NativeStackScreenProps<AuthStackParamList, "PasswordReset"> {}

interface PasswordResetFormData {
  email: string
}

const passwordResetSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
})

export const PasswordResetScreen = observer(function PasswordResetScreen(
  _props: PasswordResetScreenProps,
) {
  const { themed } = useAppTheme()
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: yupResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: PasswordResetFormData) => {
    setIsLoading(true)
    authenticationStore.setError(undefined)

    try {
      const response = await authService.resetPassword({
        email: data.email,
      })

      if (response.success) {
        Alert.alert(
          "Success",
          "Password reset email sent successfully! Please check your email for further instructions.",
          [
            {
              text: "OK",
              onPress: () => _props.navigation.navigate("SignIn"),
            },
          ],
        )
      } else {
        authenticationStore.setError(response.error || "Password reset failed")
        Alert.alert("Error", response.error || "Password reset failed")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      authenticationStore.setError(errorMessage)
      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSignIn = () => {
    _props.navigation.navigate("SignIn")
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($containerStyle)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text text="Reset Password" preset="heading" style={themed($titleStyle)} />

      <Text
        text="Enter your email address and we'll send you a link to reset your password."
        preset="subheading"
        style={themed($subtitleStyle)}
      />

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

      <Button
        text="Send Reset Email"
        preset="filled"
        style={themed($buttonStyle)}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      />

      <Button
        text="Back to Sign In"
        preset="default"
        style={themed($buttonStyle)}
        onPress={handleBackToSignIn}
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
  marginBottom: 16,
  textAlign: "center",
}

const $subtitleStyle: TextStyle = {
  marginBottom: 32,
  textAlign: "center",
}

const $inputStyle: ViewStyle = {
  marginBottom: 24,
}

const $buttonStyle: ViewStyle = {
  marginBottom: 16,
  marginTop: 8,
}
