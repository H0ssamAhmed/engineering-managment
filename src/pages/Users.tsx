import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  UserPlus,
  MoreVertical,
  Edit2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Briefcase,
  Loader2,
} from "lucide-react";
import {
  User,
  UserRole,
  USER_ROLES,
  getRoleLabel,
} from "@/lib/index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers, createUser, updateUser, toggleUserStatus } from "@/api/users";
import { useToast } from "@/components/ui/use-toast";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const { isManager } = useAuth();
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const data = await fetchUsers();
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (userId: string) => {
    const success = await toggleUserStatus(userId);
    if (success) {
      await loadUsers();
      toast({
        title: "تم تحديث الحالة",
        description: "تم تغيير حالة الموظف بنجاح.",
      });
    } else {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الحالة.",
        variant: "destructive",
      });
    }
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const role = formData.get("role") as UserRole;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setSaving(true);

    if (editingUser) {
      const updated = await updateUser(editingUser.id, { name, role });
      if (updated) {
        await loadUsers();
        toast({ title: "تم التحديث", description: "تم تحديث بيانات الموظف بنجاح." });
      } else {
        toast({ title: "خطأ", description: "فشل في التحديث.", variant: "destructive" });
      }
    } else {
      if (!email || !password) {
        toast({ title: "خطأ", description: "البريد الإلكتروني وكلمة المرور مطلوبة.", variant: "destructive" });
        setSaving(false);
        return;
      }
      const newUser = await createUser({ email, password, name, role });
      if (newUser) {
        await loadUsers();
        toast({ title: "تمت الإضافة", description: "تم إضافة الموظف الجديد إلى الفريق." });
        setIsDialogOpen(false);
      } else {
        toast({
          title: "خطأ",
          description: "فشل في الإضافة. تأكد من نشر Edge Function وعملك كمدير.",
          variant: "destructive",
        });
      }
    }

    setSaving(false);
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة فريق العمل</h1>
          <p className="text-muted-foreground mt-1">
            إدارة موظفي المكتب الهندسي، أدوارهم وصلاحيات الوصول.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingUser(null);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!isManager} title={!isManager ? "فقط مدير المكتب يمكنه إضافة موظفين" : undefined}>
              <UserPlus className="w-4 h-4" />
              إضافة موظف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" dir="rtl">
            <form onSubmit={handleSaveUser}>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
                </DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل الموظف هنا. اضغط حفظ عند الانتهاء.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {!editingUser && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="user@office.com"
                        required={!editingUser}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">كلمة المرور</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required={!editingUser}
                        minLength={6}
                      />
                    </div>
                  </>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingUser?.name || ""}
                    placeholder="مثال: م. أحمد علي"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">الدور الوظيفي</Label>
                  <Select name="role" defaultValue={editingUser?.role || "ARCHITECT"}>
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
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin ml-2" /> حفظ...</> : "حفظ التغييرات"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              إجمالي الموظفين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">كادر هندسي وإداري متكامل</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/5 border-green-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-green-600">
              <Shield className="w-5 h-5" />
              الموظفين النشطين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {users.filter(u => u.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">متواجدون حالياً في النظام</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/5 border-orange-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
              <Briefcase className="w-5 h-5" />
              الأدوار الوظيفية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {Object.keys(USER_ROLES).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">تخصصات هندسية وفنية مختلفة</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>قائمة الفريق</CardTitle>
              <CardDescription>عرض وتعديل بيانات جميع أعضاء المكتب.</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن اسم الموظف..."
                className="pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري تحميل الموظفين...
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-right">الموظف</TableHead>
                    <TableHead className="text-right">الدور الوظيفي</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
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
                              onCheckedChange={() => handleToggleStatus(user.id)}
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
                              <DropdownMenuItem onClick={() => openEditDialog(user)} className="gap-2 cursor-pointer">
                                <Edit2 className="w-4 h-4" />
                                تعديل البيانات
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {isManager && (
                                <DropdownMenuItem
                                  className={user.is_active ? "text-destructive gap-2 cursor-pointer" : "text-green-600 gap-2 cursor-pointer"}
                                  onClick={() => handleToggleStatus(user.id)}
                                >
                                  {user.is_active ? (
                                    <><UserX className="w-4 h-4" /> تعطيل الحساب</>
                                  ) : (
                                    <><UserCheck className="w-4 h-4" /> تفعيل الحساب</>
                                  )}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        لا يوجد موظفين يطابقون بحثك.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
