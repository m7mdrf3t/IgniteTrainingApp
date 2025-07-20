import React, { useState } from "react"
import { Alert } from "react-native"
import { Screen, Text, TextField, Button } from "@/components"
import { useStores } from "@/models"
import { spacing } from "@/theme"
import { useNavigation } from "@react-navigation/native"
import { createRequest } from "@/services/edge/createRequest"

export function DoctorNewRequestScreen() {
  const { authenticationStore } = useStores()
  const navigation = useNavigation<any>()
  // const userId = authenticationStore.session?.user?.id // Not needed, handled by edge function
  
  const [deviceName, setDeviceName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    // Validation
    if (!deviceName.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    
    try {
      await createRequest(deviceName.trim(), description.trim())
      // Success - show confirmation and navigate back
      Alert.alert(
        "Success", 
        "Maintenance request created successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      )
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Text 
        text="New Maintenance Request" 
        preset="heading" 
        style={{ marginBottom: spacing.lg }} 
      />
      
      <TextField
        label="Device Name"
        value={deviceName}
        onChangeText={setDeviceName}
        placeholder="Enter device name"
        style={{ marginBottom: spacing.md }}
      />
      
      <TextField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the issue or maintenance needed"
        multiline
        numberOfLines={4}
        style={{ marginBottom: spacing.lg }}
      />
      
      <Button
        text="Create Request"
        preset="filled"
        onPress={handleSubmit}
        disabled={loading}
        style={{ marginTop: spacing.md }}
      />
    </Screen>
  )
} 