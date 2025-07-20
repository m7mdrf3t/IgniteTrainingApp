import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { observer } from "mobx-react-lite"
import { HomeScreen } from "../screens/main/HomeScreen"
import { ProfileScreen } from "../screens/main/ProfileScreen"
import { SettingsScreen } from "../screens/main/SettingsScreen"
import { useAppTheme } from "@/utils/useAppTheme"
import { Icon } from "@/components"

export type MainAppTabParamList = {
  Home: undefined
  Profile: undefined
  Settings: undefined
}

const Tab = createBottomTabNavigator<MainAppTabParamList>()

export const MainAppTabs = observer(function MainAppTabs() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Icon icon="components" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <Icon icon="community" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => <Icon icon="settings" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  )
})
