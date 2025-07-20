import { ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen, Text, Card } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { useStores } from "@/models"

export const HomeScreen = observer(function HomeScreen() {
  const { themed } = useAppTheme()
  const { authenticationStore } = useStores()

  const userEmail = authenticationStore.user?.email || authenticationStore.authEmail
  const userRole = authenticationStore.userRole || "user"

  return (
    <Screen preset="auto" contentContainerStyle={themed($containerStyle)} safeAreaEdges={["top"]}>
      <Text
        text={`Welcome ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}!`}
        preset="heading"
        style={themed($titleStyle)}
      />

      <Card
        style={themed($cardStyle)}
        ContentComponent={
          <>
            <Text text="User Information" preset="subheading" style={themed($cardTitleStyle)} />

            <Text text={`Email: ${userEmail}`} preset="formLabel" style={themed($infoStyle)} />

            <Text text={`Role: ${userRole}`} preset="formLabel" style={themed($infoStyle)} />

            <Text
              text={`User ID: ${authenticationStore.user?.id || "Not available"}`}
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
            <Text text="Session Status" preset="subheading" style={themed($cardTitleStyle)} />

            <Text
              text={`Authenticated: ${authenticationStore.isAuthenticated ? "Yes" : "No"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`Session Active: ${authenticationStore.session ? "Yes" : "No"}`}
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
