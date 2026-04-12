import { fetchUsers, updateUser } from "@/api/users";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/lib";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
interface UpdatesProps {
  id: string;
  updates: Partial<Pick<User, "name" | "role" | "is_active">>;
}
export const useUsers = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const {
    data: QueredUsers,
    error,
    isLoading,
  } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });
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
    if (QueredUsers && !isLoading && !isPending) {
      setUsers(QueredUsers);
    }
  }, [QueredUsers]);

  return {
    users,
    isLoading,
    isPending,
    error,
    updateUserInfo,
  };
};
