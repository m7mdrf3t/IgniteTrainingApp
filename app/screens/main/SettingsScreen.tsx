import { ViewStyle, TextStyle, Alert } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen, Text, Card, Button } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { useStores } from "@/models"
import { authService } from "@/services/authService"

export const SettingsScreen = observer(function SettingsScreen() {
  const { themed } = useAppTheme()
  const { authenticationStore } = useStores()

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            // Call Supabase sign out
            await authService.signOut()

            // Clear local store
            authenticationStore.logout()

            Alert.alert("Success", "You have been signed out successfully.")
          } catch {
            Alert.alert("Error", "Failed to sign out. Please try again.")
          }
        },
      },
    ])
  }

  const handleClearData = () => {
    Alert.alert("Clear All Data", "This will clear all local data. Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          authenticationStore.logout()
          Alert.alert("Success", "All data has been cleared.")
        },
      },
    ])
  }

  return (
    <Screen preset="auto" contentContainerStyle={themed($containerStyle)} safeAreaEdges={["top"]}>
      <Text text="Settings" preset="heading" style={themed($titleStyle)} />

      <Card
        style={themed($cardStyle)}
        ContentComponent={
          <>
            <Text text="Account Settings" preset="subheading" style={themed($cardTitleStyle)} />

            <Text
              text={`Current User: ${authenticationStore.user?.email || authenticationStore.authEmail}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`Role: ${authenticationStore.userRole || "user"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />
          </>
        }
      />

      <Card
        style={themed($cardStyle)}
        ContentComponent={
          <>
            <Text text="Actions" preset="subheading" style={themed($cardTitleStyle)} />

            <Button
              text="Sign Out"
              preset="filled"
              style={themed($buttonStyle)}
              onPress={handleSignOut}
            />

            <Button
              text="Clear All Data"
              preset="default"
              style={themed($buttonStyle)}
              onPress={handleClearData}
            />
          </>
        }
      />

      <Card
        style={themed($cardStyle)}
        ContentComponent={
          <>
            <Text text="App Information" preset="subheading" style={themed($cardTitleStyle)} />

            <Text text="Ignite Training App" preset="formLabel" style={themed($infoStyle)} />

            <Text text="Version: 1.0.0" preset="formLabel" style={themed($infoStyle)} />

            <Text
              text="Built with React Native & Ignite CLI"
              preset="formLabel"
              style={themed($infoStyle)}
            />
          </>
        }
      />
    </Screen>
  )
})

const $containerStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: 24,
  paddingTop: 24,
}

const $titleStyle: TextStyle = {
  marginBottom: 24,
  textAlign: "center",
}

const $cardStyle: ViewStyle = {
  marginBottom: 16,
}

const $cardTitleStyle: TextStyle = {
  marginBottom: 16,
}

const $infoStyle: TextStyle = {
  marginBottom: 8,
}

const $buttonStyle: ViewStyle = {
  marginBottom: 12,
}
