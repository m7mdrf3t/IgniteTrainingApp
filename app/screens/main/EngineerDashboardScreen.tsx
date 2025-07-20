import React from "react"
import { Screen, Text } from "@/components"

export function EngineerDashboardScreen() {
  return (
    <Screen preset="auto" safeAreaEdges={["top", "bottom"]}>
      <Text text="Engineer Dashboard" preset="heading" style={{ marginBottom: 24 }} />
      <Text text="Welcome, Engineer!" />
    </Screen>
  )
} 