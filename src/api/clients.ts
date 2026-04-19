import { supabase } from "../../supabase/supabase";
import type { Client } from "@/lib/index";

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
  return (data || []) as Client[];
}

export async function createClient(
  input: Omit<Client, "id">,
): Promise<Client | null> {
  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      phone: input.phone,
      type: input.type,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating client:", error);
    return null;
  }
  return data as Client;
}

export async function updateClient(
  id: string,
  input: Partial<Omit<Client, "id">>,
): Promise<Client | null> {
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating client:", error);
    return null;
  }
  return data as Client;
}

export async function deleteClient(id: string): Promise<boolean> {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    console.error("Error deleting client:", error);
    return false;
  }
  return true;
}
