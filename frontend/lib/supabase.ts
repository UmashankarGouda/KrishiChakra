import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  })
  
  if (error) {
    console.error('Error signing in with Google:', error)
    return { error }
  }
  
  return { data }
}

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.error('Error signing in with email:', error)
    return { error }
  }
  
  return { data }
}

export const signUpWithEmail = async (email: string, password: string, metadata: any = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  
  if (error) {
    console.error('Error signing up:', error)
    return { error }
  }
  
  return { data }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    return { error }
  }
  window.location.href = '/'
  return { error: null }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

export const createProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, ...profileData })
    .select()
    .single()
  
  return { data, error }
}

// Field Batch functions
export const getFieldBatches = async (userId: string) => {
  const { data, error } = await supabase
    .from('field_batches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createFieldBatch = async (userId: string, fieldData: any) => {
  const { data, error } = await supabase
    .from('field_batches')
    .insert({ user_id: userId, ...fieldData })
    .select()
    .single()
  
  return { data, error }
}

export const updateFieldBatch = async (fieldId: string, updates: any) => {
  const { data, error } = await supabase
    .from('field_batches')
    .update(updates)
    .eq('id', fieldId)
    .select()
    .single()
  
  return { data, error }
}

export const deleteFieldBatch = async (fieldId: string) => {
  const { data, error } = await supabase
    .from('field_batches')
    .delete()
    .eq('id', fieldId)
  
  return { data, error }
}