import { supabase } from "../../supabase/supabase";
import type { User, UserRole } from "@/lib/index";

export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return (data || []) as User[];
}

export type CreateUserInput = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
};

/**
 * Creates a new user. Should only be called by managers.
 * Uses Supabase Edge Function or direct signUp. For admin creation,
 * the Edge Function create-user should be used (validates manager role).
 */
export async function createUser(input: CreateUserInput): Promise<User | null> {
  const { data, error } = await supabase.functions.invoke("create-user", {
    body: input,
  });

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  if (data?.error) {
    console.error("Create user error:", data.error);
    return null;
  }

  return data?.user as User;
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<User, "name" | "role" | "is_active">>
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    return null;
  }
  return data as User;
}

export async function toggleUserStatus(id: string): Promise<boolean> {
  const { data: current } = await supabase
    .from("users")
    .select("is_active")
    .eq("id", id)
    .single();

  if (!current) return false;

  const { error } = await supabase
    .from("users")
    .update({ is_active: !current.is_active })
    .eq("id", id);

  if (error) {
    console.error("Error toggling user status:", error);
    return false;
  }
  return true;
}
