import {
  ChangeNotificationReading,
  fetchNotifications,
} from "@/api/notifications";
import { fetchUsers, updateUser } from "@/api/users";
import { useAuth } from "@/contexts/AuthContext";
import { User, Notification } from "@/lib";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
interface UpdatesProps {
  id: string;
  updates: Partial<Pick<User, "name" | "role" | "is_active">>;
}
type ChangeNotificationPayload = {
  id: string;
  is_read: boolean;
};
export const useUsers = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [userNotifactions, setUserNotifactions] = useState<Notification[]>([]);

  const data = useQueries({
    queries: [
      { queryKey: ["users"], queryFn: fetchUsers },
      {
        queryKey: ["notifications"],
        queryFn: () => fetchNotifications(profile.id),
      },
    ],
    combine(results) {
      return {
        users: results[0].data,
        notifications: results[1].data,
        isLoading: results.some((res) => res.isLoading),
        isError: results.some((res) => res.isError),
      };
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, updates }: UpdatesProps) => updateUser(id, updates),
  });

  const updateUserInfo = async (
    id: string,
    updates: Partial<Pick<User, "name" | "role" | "is_active">>,
  ) => {
    const updated = await mutateAsync({ id, updates });

    if (updated) {
      await onSucces();
      toast.success("تم تحديث بيانات الموظف بنجاح.");
      return true;
    } else {
      toast.error("فشل في التحديث.");
      return false;
    }
  };
  const onSucces = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };
  useEffect(() => {
    if (data.notifications && data.users && !data.isLoading && !data.isError) {
      setUsers(data.users);
      setUserNotifactions(data?.notifications);
    }
  }, [data]);

  const { mutate: changeNotificationState, isPending: isChangingNotifiState } =
    useMutation({
      mutationFn: ({ id, is_read }: ChangeNotificationPayload) =>
        ChangeNotificationReading(id, is_read),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      },

      onError: (error) => {
        console.error("Failed to update notification:", error);
        // optional: toast
        toast.error("فشل تحديث حالة الإشعار");
      },
    });
  return {
    users,
    currentUserNotifaction: userNotifactions,
    // notifactionError,
    // notifactionLoading,
    changeNotificationState,
    isChangingNotifiState,
    isLoading: data.isLoading,
    isPending,
    error: data.isError,
    updateUserInfo,
  };
};
