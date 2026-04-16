import { supabase } from "../../supabase/supabase";
import type { Notification } from "@/lib/index";

export type CreateNotificationInput = {
  user_id: string;
  type:
    | "stage_assignment"
    | "status_change"
    | "comment_added"
    | "project_completed";
  title: string;
  message?: string;
  project_id?: string;
  stage_id?: string;
  assigned_by_user_id?: string;
  action_url?: string;
};

// Fetch unread notifications for current user
export async function fetchUnreadNotifications(
  userId: string,
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      *,
      assigned_by_user:users!assigned_by_user_id (name, id)
    `,
    )
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return (data || []) as Notification[];
}

// Fetch all notifications (with pagination)
export async function fetchNotifications(
  userId: string,
  limit: number = 20,
  offset: number = 0,
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      *,
      assigned_by_user:users!assigned_by_user_id (name, id)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return (data || []) as Notification[];
}

// Create a new notification
export async function createNotification(
  input: CreateNotificationInput,
): Promise<Notification | null> {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: input.user_id,
      type: input.type,
      title: input.title,
      message: input.message,
      project_id: input.project_id,
      stage_id: input.stage_id,
      assigned_by_user_id: input.assigned_by_user_id,
      action_url: input.action_url,
    })
    .select(
      `
      *,
      assigned_by_user:users!assigned_by_user_id (name, id)
    `,
    )
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    return null;
  }
  return data as Notification;
}

// Mark notification as read
export async function markNotificationAsRead(
  notificationId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
  return true;
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
  return true;
}

// Delete notification
export async function deleteNotification(
  notificationId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) {
    console.error("Error deleting notification:", error);
    return false;
  }
  return true;
}
