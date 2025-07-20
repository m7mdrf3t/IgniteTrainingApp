import { useState } from "react"
import { ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen, Text, Card, Button } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { useStores } from "@/models"

export const ProfileScreen = observer(function ProfileScreen() {
  const { themed } = useAppTheme()
  const { authenticationStore } = useStores()
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)

  const user = authenticationStore.user
  const session = authenticationStore.session

  const toggleSensitiveInfo = () => {
    setShowSensitiveInfo(!showSensitiveInfo)
  }

  return (
    <Screen preset="auto" contentContainerStyle={themed($containerStyle)} safeAreaEdges={["top"]}>
      <Text text="Profile" preset="heading" style={themed($titleStyle)} />

      <Card
        style={themed($cardStyle)}
        ContentComponent={
          <>
            <Text text="Basic Information" preset="subheading" style={themed($cardTitleStyle)} />

            <Text
              text={`Email: ${user?.email || authenticationStore.authEmail}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`User ID: ${user?.id || "Not available"}`}
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
            <Text text="Session Information" preset="subheading" style={themed($cardTitleStyle)} />

            <Text
              text={`Session ID: ${session?.access_token ? "Available" : "Not available"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`Expires At: ${session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : "Not available"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Button
              text={showSensitiveInfo ? "Hide Token" : "Show Token"}
              preset="default"
              style={themed($buttonStyle)}
              onPress={toggleSensitiveInfo}
            />

            {showSensitiveInfo && session?.access_token && (
              <Text
                text={`Token: ${session.access_token.substring(0, 20)}...`}
                preset="formLabel"
                style={themed($tokenStyle)}
              />
            )}
          </>
        }
      />

      <Card
        style={themed($cardStyle)}
        ContentComponent={
          <>
            <Text text="Account Status" preset="subheading" style={themed($cardTitleStyle)} />

            <Text
              text={`Email Confirmed: ${user?.email_confirmed_at ? "Yes" : "No"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`Created At: ${user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available"}`}
              preset="formLabel"
              style={themed($infoStyle)}
            />

            <Text
              text={`Last Sign In: ${user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Not available"}`}
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
  marginTop: 8,
  marginBottom: 16,
}

const $tokenStyle: TextStyle = {
  marginTop: 8,
  fontFamily: "monospace",
  fontSize: 12,
}
