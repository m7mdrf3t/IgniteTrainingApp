import React, { useState, useEffect } from "react"
import { View, Alert, ActivityIndicator } from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Screen, Text, Button, TextField } from "@/components"
import { Radio } from "@/components/Toggle/Radio"
import { useAppTheme } from "@/utils/useAppTheme"
import { useStores } from "@/models"
import { supabase } from "@/services/supabase"
import { getUserRole } from "@/services/edge/getUserRole"
import { AppStackParamList } from "@/navigators/AppNavigator"
import { navigationRef } from "@/navigators/navigationUtilities"

interface CompleteProfileScreenProps extends NativeStackScreenProps<AppStackParamList, any> {}

interface ProfileFormData {
  name: string
  role: string
}

const profileSchema = yup.object({
  name: yup.string().required("Full name is required"),
  role: yup.string()
    .test('role-required', 'Role is required', value => value === 'doctor' || value === 'engineer')
    .required('Role is required'),
})

export const CompleteProfileScreen = observer(function CompleteProfileScreen(
  props: CompleteProfileScreenProps,
) {
  // All hooks at the top!
  const { themed } = useAppTheme()
  const { authenticationStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: "", role: "" },
  })

  useEffect(() => {
    const checkSession = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (userError || sessionError || !userData?.user || !sessionData?.session) {
        Alert.alert(
          "Session Error",
          "Your session is missing or expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: () => navigationRef.current?.resetRoot({ index: 0, routes: [{ name: "Auth" }] }),
            },
          ]
        )
      }
      setCheckingSession(false)
    }
    checkSession()
  }, [])

  if (checkingSession) {
    return (
      <Screen preset="auto" safeAreaEdges={["top", "bottom"]}>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </Screen>
    )
  }

  const onSubmit: import("react-hook-form").SubmitHandler<ProfileFormData> = async (data) => {
    setIsLoading(true)
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (userError || sessionError || !userData?.user || !sessionData?.session) {
        Alert.alert("Error", userError?.message || sessionError?.message || "User session not found.")
        navigationRef.current?.resetRoot({ index: 0, routes: [{ name: "Auth" }] })
        return
      }
      // Insert or update into users table
      const { error } = await supabase.from("users").upsert([
        {
          id: userData.user.id,
          email: userData.user.email,
          name: data.name,
          role: data.role,
        },
      ])
      if (error) {
        Alert.alert("Error", error.message)
        return
      }
      // Call edge function to get user role
      const roleResult = await getUserRole(userData.user.id)
      if (!roleResult.success || !roleResult.data?.role) {
        Alert.alert("Error", roleResult.error || "Could not fetch user role.")
        return
      }
      // Save role in authenticationStore
      authenticationStore.setUserRole(roleResult.data.role)
      // Redirect based on role
      if (roleResult.data.role === "doctor") {
        props.navigation.reset({ index: 0, routes: [{ name: "MainApp" }] })
      } else if (roleResult.data.role === "engineer") {
        props.navigation.reset({ index: 0, routes: [{ name: "EngineerDashboard" }] })
      }
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    authenticationStore.logout();
    if (navigationRef.isReady()) {
      navigationRef.resetRoot({ index: 0, routes: [{ name: "Auth" }] })
    } else {
      props.navigation.reset({ index: 0, routes: [{ name: "Auth" }] })
    }
  }

  return (
    <Screen preset="auto" safeAreaEdges={["top", "bottom"]}>
      <Text text="Complete Your Profile" preset="heading" style={{ marginBottom: 24 }} />
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            status={errors.name ? "error" : undefined}
            helper={errors.name?.message}
            style={{ marginBottom: 16 }}
          />
        )}
      />
      <Text text="Role" preset="formLabel" style={{ marginBottom: 8 }} />
      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <Radio
              label="Doctor"
              value={value === "doctor"}
              onPress={() => onChange("doctor")}
              inputOuterStyle={{ marginRight: 24 }}
            />
            <Radio
              label="Engineer"
              value={value === "engineer"}
              onPress={() => onChange("engineer")}
            />
          </View>
        )}
      />
      {errors.role && <Text text={errors.role.message} preset="formHelper" style={{ marginBottom: 8, color: 'red' }} />}
      <Button
        text="Submit"
        preset="filled"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        style={{ marginTop: 8 }}
      />
      <Button
        text="Back to Login"
        preset="default"
        onPress={handleBackToLogin}
        style={{ marginTop: 8 }}
      />
    </Screen>
  )
}) 