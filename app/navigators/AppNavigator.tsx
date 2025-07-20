/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import * as Screens from "@/screens"
import Config from "../config"
import { useStores } from "../models"
import { DemoTabParamList } from "./DemoNavigator"
import { AuthNavigator } from "./AuthNavigator"
import { MainAppTabs } from "./MainAppTabs"
import { DoctorNavigator } from "./DoctorNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import { ComponentProps, useEffect, useState } from "react"
import { validateUserProfile } from "@/services/edge/validateUserProfile"
import { ActivityIndicator, View } from "react-native"
import { Screen } from "@/components"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Auth: undefined
  MainApp: undefined
  Demo: NavigatorScreenParams<DemoTabParamList>
  CompleteProfile: undefined
  EngineerDashboard: undefined
  Doctor: undefined
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { isAuthenticated, user },
  } = useStores()
  const [profileChecked, setProfileChecked] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(true)

  useEffect(() => {
    console.log("[AppStack] isAuthenticated:", isAuthenticated, "user:", user, "user?.role:", user?.role)
    const checkProfile = async () => {
      if (isAuthenticated && user?.id) {
        const result = await validateUserProfile(user.id)
        console.log("[AppStack] validateUserProfile result:", result)
        setIsProfileComplete(result.isProfileComplete ?? false)
        setProfileChecked(true)
      } else {
        setProfileChecked(true)
      }
    }
    checkProfile()
  }, [isAuthenticated, user?.id, user?.role])

  const {
    theme: { colors },
  } = useAppTheme()

  if (isAuthenticated && (!profileChecked || !user?.role)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={
        !isAuthenticated
          ? "Auth"
          : !isProfileComplete
          ? "CompleteProfile"
          : user?.role === "engineer"
          ? "EngineerDashboard"
          : user?.role === "doctor"
          ? "Doctor"
          : "MainApp"
      }
    >
      {!isAuthenticated && <Stack.Screen name="Auth" component={AuthNavigator} />}
      {isAuthenticated && !isProfileComplete && (
        <Stack.Screen name="CompleteProfile" component={Screens.CompleteProfileScreen} />
      )}
      {isAuthenticated && isProfileComplete && user?.role === "engineer" && (
        <Stack.Screen name="EngineerDashboard" component={Screens.EngineerDashboardScreen} />
      )}
      {isAuthenticated && isProfileComplete && user?.role === "doctor" && (
        <Stack.Screen name="Doctor" component={DoctorNavigator} />
      )}
      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        <Screens.ErrorBoundary catchErrors={Config.catchErrors}>
          <AppStack />
        </Screens.ErrorBoundary>
      </NavigationContainer>
    </ThemeProvider>
  )
})
