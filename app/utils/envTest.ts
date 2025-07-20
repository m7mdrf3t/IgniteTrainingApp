/**
 * Utility to test environment variables
 * You can call this from any screen to verify env vars are working
 */
export const testEnvironmentVariables = () => {
  console.log("🔍 Environment Variables Test:")
  console.log("EXPO_PUBLIC_SUPABASE_URL:", process.env.EXPO_PUBLIC_SUPABASE_URL)
  console.log(
    "EXPO_PUBLIC_SUPABASE_ANON_KEY:",
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set",
  )

  return {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  }
}
