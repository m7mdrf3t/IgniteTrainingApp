import { supabase } from "./supabase"
import { getUserRole } from "./edge/getUserRole"

export interface AuthResponse {
  success: boolean
  data?: any
  error?: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  confirmPassword: string
}

export interface PasswordResetRequest {
  email: string
}

export const authService = {
  async signIn({ email, password }: SignInCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      if (data.user && data.session) {
        // Get user role from Edge Function
        const roleResponse = await getUserRole(data.user.id)

        return {
          success: true,
          data: {
            user: data.user,
            session: data.session,
            role: roleResponse.success ? roleResponse.data?.role : "user", // default role
          },
        }
      }

      return {
        success: false,
        error: "Authentication failed",
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  },

  async signUp({ email, password, confirmPassword }: SignUpCredentials): Promise<AuthResponse> {
    try {
      if (password !== confirmPassword) {
        return {
          success: false,
          error: "Passwords do not match",
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  },

  async resetPassword({ email }: PasswordResetRequest): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "ignitetrainingapp://reset-password",
      })

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: true,
        data: { message: "Password reset email sent successfully" },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: true,
        data: { message: "Signed out successfully" },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  },

  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: true,
        data: { session },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    }
  },
}

export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("role, name, email")
    .eq("id", userId)
    .single()
  if (error) throw error
  return data
}
