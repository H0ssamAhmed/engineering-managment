import React, { useState, useMemo } from "react";
import { Search, Plus, User, Building2, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Client } from "@/lib/index";
import { useProjects } from "@/hooks/useProjects";
import { ClientDialog } from "@/components/ClientDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

export default function Clients() {
  const { clients, addClient, updateClient, removeClient, loading } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
    );
  }, [clients, searchQuery]);

  const handleAddClient = () => {
    setSelectedClient(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا العميل؟")) {
      await removeClient(id);
    }
  };

  const handleSaveClient = async (client: Client) => {
    if (selectedClient) {
      await updateClient(selectedClient.id, {
        name: client.name,
        phone: client.phone,
        type: client.type,
      });
    } else {
      await addClient({
        name: client.name,
        phone: client.phone,
        type: client.type,
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            إدارة العملاء
          </h1>
          <p className="text-muted-foreground mt-1">
            إدارة بيانات أصحاب المشاريع والشركات المتعاقدة.
          </p>
        </div>
        <Button onClick={handleAddClient} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة عميل جديد
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="بحث عن عميل بالاسم أو رقم الهاتف..."
            className="pr-10 bg-muted/30 border-none"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">جاري التحميل...</div>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">اسم العميل</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {client.type === "individual" ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Building2 className="w-4 h-4" />
                            )}
                          </div>
                          <span>{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={client.type === "company" ? "secondary" : "outline"}
                          className="font-normal"
                        >
                          {client.type === "company" ? "شركة" : "فرد"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{client.phone}</TableCell>
                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel className="text-right">خيارات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditClient(client)}
                              className="flex items-center justify-end gap-2 text-right cursor-pointer"
                            >
                              <span>تعديل</span>
                              <Edit className="w-4 h-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClient(client.id)}
                              className="flex items-center justify-end gap-2 text-right cursor-pointer text-destructive focus:text-destructive"
                            >
                              <span>حذف</span>
                              <Trash2 className="w-4 h-4" />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      لا يوجد عملاء مضافون حالياً يطابقون البحث.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={selectedClient}
        onSave={handleSaveClient}
      />
    </div>
  );
}
