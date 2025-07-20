import React, { useEffect, useState } from "react"
import { View, FlatList, ActivityIndicator } from "react-native"
import { Screen, Text, Button, ListItem, EmptyState } from "@/components"
import { useStores } from "@/models"
import { spacing } from "@/theme"
import { useNavigation } from "@react-navigation/native"
import { getDoctorRequests } from "@/services/edge/getDoctorRequests"

interface Request {
  id: string
  device_name: string
  status: string
  created_at: string
  assigned_engineer?: string
}

export function DoctorDashboardScreen() {
  const { authenticationStore } = useStores()
  const navigation = useNavigation<any>()
  // const userId = authenticationStore.session?.user?.id // Not needed, handled by edge function
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      try {
        const data = await getDoctorRequests()
        setRequests(data || [])
      } catch (error) {
        setRequests([])
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const renderItem = ({ item }: { item: Request }) => (
    <ListItem
      key={item.id}
      text={item.device_name}
      RightComponent={
        <Text size="xs" style={{ color: "#888" }}>
          {item.assigned_engineer ? `Engineer: ${item.assigned_engineer}` : "Unassigned"}
        </Text>
      }
      style={{ marginBottom: spacing.md }}
    >
      <Text size="xs" style={{ color: "#888" }}>
        Status: {item.status} | Created: {new Date(item.created_at).toLocaleString()}
      </Text>
    </ListItem>
  )

  return (
    <Screen preset="auto" safeAreaEdges={["top", "bottom"]}>
      <Text text="My Maintenance Requests" preset="heading" style={{ marginBottom: spacing.lg }} />
      <Button
        text="+ New Request"
        preset="filled"
        style={{ marginBottom: spacing.lg }}
        onPress={() => navigation.navigate("DoctorNewRequestScreen")}
      />
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: spacing.xl }} />
      ) : requests.length === 0 ? (
        <EmptyState
          preset="generic"
          heading="No Requests"
          content="You have no maintenance requests."
        />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
        />
      )}
    </Screen>
  )
} 