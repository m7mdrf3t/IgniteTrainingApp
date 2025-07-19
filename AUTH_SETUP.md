# Authentication Setup Guide

This project includes a complete authentication system built with React Native, Ignite CLI (Bowser architecture), TypeScript, and Supabase.

## Features

- ✅ Welcome Screen with Sign In/Sign Up options
- ✅ Sign In Screen with email/password validation
- ✅ Sign Up Screen with password confirmation
- ✅ Password Reset Screen
- ✅ Form validation using react-hook-form and yup
- ✅ Supabase integration for authentication
- ✅ Edge Function integration for user role fetching
- ✅ MobX-State-Tree store management
- ✅ TypeScript support
- ✅ Clean UI using existing Ignite components

## Setup Instructions

### 1. Supabase Configuration

Create a `.env` file in the root directory with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```


### 2. Supabase Edge Function

Create an Edge Function in your Supabase project called `get-user-role`:

```typescript
// supabase/functions/get-user-role/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user role from your users table
    const { data, error } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ role: data?.role || 'user' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

### 3. Database Schema

Create a `users` table in your Supabase database:

```sql
-- Create users table with role column
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Project Structure

```
app/
├── screens/
│   └── auth/
│       ├── WelcomeScreen.tsx
│       ├── SignInScreen.tsx
│       ├── SignUpScreen.tsx
│       └── PasswordResetScreen.tsx
├── navigators/
│   ├── AppNavigator.tsx
│   └── AuthNavigator.tsx
├── services/
│   ├── supabase.ts
│   ├── authService.ts
│   └── edge/
│       └── getUserRole.ts
└── models/
    └── AuthenticationStore.ts
```

## Usage

1. **Welcome Screen**: Entry point with Sign In/Sign Up options
2. **Sign In**: Email/password authentication with validation
3. **Sign Up**: Account creation with password confirmation
4. **Password Reset**: Email-based password reset functionality

## Authentication Flow

1. User signs in with email/password
2. Supabase authenticates the user
3. Edge Function fetches user role
4. User data is stored in MobX-State-Tree store
5. User is redirected to main app (Demo screens)

## Dependencies

- `@supabase/supabase-js`: Supabase client
- `react-hook-form`: Form handling
- `@hookform/resolvers`: Form validation resolvers
- `yup`: Schema validation

## Notes

- The app uses MobX-State-Tree instead of Redux Toolkit as per Ignite Bowser architecture
- All screens follow the Bowser architecture patterns
- Form validation includes email format and password requirements
- Error handling is implemented throughout the authentication flow
- The UI uses existing Ignite components for consistency 