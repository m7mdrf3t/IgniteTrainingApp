import { supabase } from "../supabase"

// Get the Supabase URL from environment or use a default
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"

export interface EdgeFunctionResponse {
  success: boolean
  data?: any
  error?: string
}

export const getUserRole = async (userId: string): Promise<EdgeFunctionResponse> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      return {
        success: false,
        error: "No valid session found",
      }
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/get-user-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error || `HTTP error! status: ${response.status}`,
      }
    }

    const data = await response.json()

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
