import { ViewStyle, TextStyle, Alert } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen, Text, Card, Button } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { useStores } from "@/models"

export const DebugScreen = observer(function DebugScreen() {
  const { themed } = useAppTheme()
  const { authenticationStore } = useStores()

  const resetAuthState = () => {
    Alert.alert(
      "Reset Authentication",
      "This will clear all authentication data and return to login screen.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            authenticationStore.forceLogout()
            Alert.alert("Success", "Authentication state has been reset.")
          },
        },
      ],
    )
  }

  return (
    <Screen preset="auto" contentContainerStyle={themed($containerStyle)} safeAreaEdges={["top"]}>
      <Text text="Debug Screen" preset="heading" style={themed($titleStyle)} />

      <Card
        style={themed($cardStyle)}
        ContentComponent={
          <>
            <Text text="Authentication State" preset="subheading" style={themed($cardTitleStyle)} />

            <Text
              text={`Is Authenticated: ${authenticationStore.isAuthenticated ? "Yes" : "No"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`Has Token: ${authenticationStore.authToken ? "Yes" : "No"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`Has Session: ${authenticationStore.session ? "Yes" : "No"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`Has User: ${authenticationStore.user ? "Yes" : "No"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`User Role: ${authenticationStore.userRole || "None"}`}
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
              text="Reset Authentication State"
              preset="filled"
              style={themed($buttonStyle)}
              onPress={resetAuthState}
            />

            <Button
              text="Log Auth State to Console"
              preset="default"
              style={themed($buttonStyle)}
              onPress={() => {
                console.log("🔐 Full Auth State:", {
                  isAuthenticated: authenticationStore.isAuthenticated,
                  authToken: authenticationStore.authToken,
                  session: authenticationStore.session,
                  user: authenticationStore.user,
                  userRole: authenticationStore.userRole,
                  authEmail: authenticationStore.authEmail,
                })
                Alert.alert("Logged", "Check console for auth state details.")
              }}
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
