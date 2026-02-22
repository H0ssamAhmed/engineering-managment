import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  UserPlus,
  UserCheck,
  Shield,
  Briefcase,
  Loader2,
} from "lucide-react";
import { User } from "@/lib/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers } from "@/api/users";
import { useToast } from "@/components/ui/use-toast";
import { USER_ROLES } from "@/lib/index";
import UserRow from "@/components/User/UserRow";
import AddUserDialog from "@/components/User/AddUserDialog";
import EditUserDialog from "@/components/User/EditUserDialog";


export default function Users() {
  document.title = "مكتب انس حلواني | الموظفين"
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { isManager } = useAuth();

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

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
    setEditingUser(null);
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

        <Button
          className="gap-2"
          disabled={!isManager}
          title={!isManager ? "فقط مدير المكتب يمكنه إضافة موظفين" : undefined}
          onClick={() => setIsAddDialogOpen(true)}
        >
          <UserPlus className="w-4 h-4" />
          إضافة موظف جديد
        </Button>
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
                      <UserRow
                        key={user.id}
                        user={user}
                        onEdit={handleOpenEdit}
                        onStatusChange={loadUsers}
                      />
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

      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={loadUsers}
      />

      {editingUser && (
        <EditUserDialog
          open={isEditDialogOpen}
          onOpenChange={handleCloseEdit}
          user={editingUser}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
}
