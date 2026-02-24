import React, { useState } from "react";
import { Edit2, Loader2 } from "lucide-react";
import { User, UserRole, USER_ROLES } from "@/lib/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/api/users";
import toast from "react-hot-toast";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSuccess: () => void;
}

export default function EditUserDialog({ open, onOpenChange, user, onSuccess }: EditUserDialogProps) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const role = formData.get("role") as UserRole;

    setSaving(true);

    const updated = await updateUser(user.id, { name, role });

    if (updated) {
      await onSuccess();
      toast.success("تم تحديث بيانات الموظف بنجاح.")
      onOpenChange(false);
    } else {
      toast.error("فشل في التحديث.");
    }

    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              تعديل بيانات الموظف
            </DialogTitle>
            <DialogDescription>
              تحديث معلومات الموظف. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">الاسم الكامل</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={user.name}
                placeholder="مثال: م. أحمد علي"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-role">الدور الوظيفي</Label>
              <Select name="role" defaultValue={user.role} dir="rtl">
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(USER_ROLES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-muted-foreground text-sm">البريد الإلكتروني</Label>
              <div className="text-sm bg-muted px-3 py-2 rounded-md">
                {user.email || `${user.id}@office.com`}
              </div>
              <p className="text-xs text-muted-foreground">
                لا يمكن تعديل البريد الإلكتروني بعد إنشاء الحساب
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
