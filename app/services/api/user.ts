
import { supabase } from '../../lib/supabase'

export interface UserRow {
  id: string
  auth_id: string
  email: string
  name: string
  role: string
  created_at: string
  updated_at: string
}

export interface UserInput {
  email: string
  password: string
  name: string
}

// Signup a user and insert into 'users' table
export const signupUser = async (
  data: UserInput,
): Promise<UserRow> => {

const { data: signupData, error: signupError } = await supabase.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    data: {
      name: data.name,
    }
  }
})
if (signupError) throw signupError

return signupData as unknown as UserRow

}

export const createUserIfNotExists = async (user: { id: string; email: string; user_metadata?: any }) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .maybeSingle(); // use maybeSingle to avoid PGRST116

  if (error) throw error;

  if (data) return; // already exists

  const { error: insertError } = await supabase
    .from('users')
    .insert([
      {
        auth_id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email,
      },
    ])
    .maybeSingle();

  if (insertError) throw insertError;
};

// Login
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Get the logged-in user from session, not by auth_id
  const user = data.user; // this is your logged-in user
  if (!user) throw new Error("User not returned after login");

  await createUserIfNotExists(user as any); // pass the whole user object
  return data;
};


// Fetch all users
export const getUsers = async (): Promise<UserRow[]> => {
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data || []
}

// Fetch a single user by ID
export const getUserByUserId = async (id: string): Promise<UserRow> => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
  if (error) throw error
  return data
}
export const getUserById = async (): Promise<UserRow> => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw authError ?? new Error("No auth user found");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authData.user.id) // map auth → users
    .single();

  if (error) throw error;
  return data; // full row from "users"
};


// Update user
export const updateUser = async (id: string, updates: Partial<UserRow>): Promise<UserRow> => {
  const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
}


export const getAuthUser = async (): Promise<any | null> => {
  const data = await supabase.auth.getUser();
  return data;
};

// Forgot password (send reset link)
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}reset-password`,
  })

  if (error) throw error
  return { message: "Password reset email sent" }
}

// Reset password (update to new password)
export const resetPassword = async (password: string): Promise<{ message: string }> => {
  const { data, error } = await supabase.auth.updateUser({ password })

  if (error) throw error
  return { message: "Password updated successfully" }
}