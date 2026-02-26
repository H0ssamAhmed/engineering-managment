import React, { useState } from "react";
import {
  MoreVertical,
  Edit2,
  UserCheck,
  UserX,
  Mail,
} from "lucide-react";
import { User, getRoleLabel } from "@/lib/index";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { toggleUserStatus } from "@/api/users";
import toast from "react-hot-toast";
import LoadingRowSkeleton from "../LoadingRowSkeleton";
import { useQueryClient } from "@tanstack/react-query";

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onStatusChange: () => void;
}

export default function UserRow({ user, onEdit, onStatusChange }: UserRowProps) {
  const queryClient = useQueryClient()
  const { isManager } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleToggleStatus = async () => {
    setIsLoading(true)
    const success = await toggleUserStatus(user.id);

    if (success) {
      await onStatusChange();
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("تم تحديث الحالة")

    } else {
      toast.error("فشل في تحديث الحالة.")
    }
    setIsLoading(false)

  };

  if (isLoading) {
    return <LoadingRowSkeleton />
  }
  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {user.email || `${user.id}@office.com`}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant="outline" className="font-medium">
          {getRoleLabel(user.role)}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Switch

            dir="ltr"
            checked={user.is_active}
            onCheckedChange={handleToggleStatus}
            disabled={!isManager || user.role == "MANAGER"}
          />
          <span className={user.is_active ? "text-green-600 text-sm" : "text-muted-foreground text-sm"}>
            {user.is_active ? "نشط" : "معطل"}
          </span>
        </div>
      </TableCell>

      <TableCell className="text-left">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit(user)}
              className="gap-2 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              تعديل البيانات
            </DropdownMenuItem>

            {isManager && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={user.is_active ? "text-destructive gap-2 cursor-pointer" : "text-green-600 gap-2 cursor-pointer"}
                  onClick={handleToggleStatus}
                >
                  {user.is_active ? (
                    <>
                      <UserX className="w-4 h-4" />
                      تعطيل الحساب
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      تفعيل الحساب
                    </>
                  )}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
