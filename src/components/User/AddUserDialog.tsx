import React, { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { UserRole, USER_ROLES } from "@/lib/index";
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
import { createUser } from "@/api/users";
import toast from "react-hot-toast";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddUserDialog({ open, onOpenChange, onSuccess }: AddUserDialogProps) {
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const role = formData.get("role") as UserRole;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "البريد الإلكتروني وكلمة المرور مطلوبة.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    const newUser = await createUser({ email, password, name, role });

    if (newUser) {
      await onSuccess();
      toast.success("تم إضافة الموظف الجديد إلى الفريق.")

      onOpenChange(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error("فشل في الإضافة. تأكد من نشر Edge Function وعملك كمدير.",)

    }

    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              إضافة موظف جديد
            </DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الموظف هنا. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                name="name"
                placeholder="مثال: م. أحمد علي"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">الدور الوظيفي</Label>
              <Select name="role" defaultValue="ARCHITECT" dir="rtl">
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
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@office.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <div
                className="flex items-center gap-2 justify-start cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={showPassword}
                  readOnly
                />
                <Label className="cursor-pointer">اظهار كلمة المرور</Label>
              </div>
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
                "إضافة الموظف"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
