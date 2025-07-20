import { supabase } from "../supabase"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://gizqdfxguwdukyhndabn.supabase.co"

export interface ValidateUserProfileResponse {
  success: boolean
  isProfileComplete?: boolean
  error?: string
}

export const validateUserProfile = async (userId: string): Promise<ValidateUserProfileResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      return { success: false, error: "No valid session found" }
    }
    const response = await fetch(`${supabaseUrl}/functions/v1/validate-user-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ userId }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { success: false, error: errorData.error || `HTTP error! status: ${response.status}` }
    }
    const data = await response.json()
    return { success: true, isProfileComplete: data.isProfileComplete }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
} 