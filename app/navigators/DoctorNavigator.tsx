import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { DoctorDashboardScreen } from "../screens/main/DoctorDashboardScreen"
import { DoctorNewRequestScreen } from "../screens/main/DoctorNewRequestScreen"
import { useAppTheme } from "@/utils/useAppTheme"

export type DoctorStackParamList = {
  DoctorHomeScreen: undefined
  DoctorNewRequestScreen: undefined
}

const Stack = createNativeStackNavigator<DoctorStackParamList>()

export const DoctorNavigator = observer(function DoctorNavigator() {
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
      initialRouteName="DoctorHomeScreen"
    >
      <Stack.Screen name="DoctorHomeScreen" component={DoctorDashboardScreen} />
      <Stack.Screen name="DoctorNewRequestScreen" component={DoctorNewRequestScreen} />
    </Stack.Navigator>
  )
}) 