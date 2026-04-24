import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, FolderOpen, MapPin, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Project, ProjectType, PROJECT_TYPES, Client } from "@/lib/index";
import { ClientDialog } from "@/components/ClientDialog";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => Promise<Client | null>;
  onSave: (project: Project) => void | Promise<void>;
}

const projectSchema = z.object({
  name: z.string().min(3, "اسم المشروع يجب أن يكون 3 أحرف على الأقل"),
  type: z.string().min(1, "يجب اختيار نوع المشروع"),
  land_plot_number: z.string().min(1, "رقم القطعة مطلوب"),
  land_location: z.string().min(1, "الموقع مطلوب"),
  server_path: z.string().min(1, "مسار السيرفر مطلوب"),
  client_id: z.string().min(1, "يجب اختيار عميل"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectDialog({ open, onOpenChange, project, clients, addClient, onSave }: ProjectDialogProps) {
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      type: "BUILDING_PERMIT",
      land_plot_number: "",
      land_location: "",
      server_path: "",
      client_id: "",
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        type: project.type,
        land_plot_number: project.land_plot_number,
        land_location: project.land_location,
        server_path: project.server_path,
        client_id: project.client_id,
      });
    } else {
      form.reset({
        name: "",
        type: "BUILDING_PERMIT",
        land_plot_number: "",
        land_location: "",
        server_path: "",
        client_id: "",
      });
    }
  }, [project, form, open]);

  const handleSubmit = (values: ProjectFormValues) => {
    const projectData: Project = {
      id: project?.id || Math.random().toString(36).substr(2, 9),
      name: values.name,
      type: values.type as ProjectType,
      land_plot_number: values.land_plot_number,
      land_location: values.land_location,
      server_path: values.server_path,
      client_id: values.client_id,
      current_stage_id: project?.current_stage_id || "",
      created_at: project?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: project?.status || "active",
    };
    onSave(projectData);
    onOpenChange(false);
  };

  const handleNewClientCreated = (newClient: Client) => {
    form.setValue("client_id", newClient.id);
    setIsClientDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-2xl font-bold">
              {project ? "تعديل بيانات المشروع" : "إنشاء مشروع جديد"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="text-right">
                      <FormLabel>اسم المشروع</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: فيلا سكنية - الملقا" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="text-right">
                      <FormLabel>نوع المشروع</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir="rtl">
                          {Object.entries(PROJECT_TYPES).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem className="text-right col-span-full">
                      <FormLabel>العميل</FormLabel>
                      <div className="flex gap-2">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="اختر العميل" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent dir="rtl">
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name} ({client.type === "individual" ? "فرد" : "شركة"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setIsClientDialogOpen(true)}
                          title="إضافة عميل جديد"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="land_plot_number"
                  render={({ field }) => (
                    <FormItem className="text-right">
                      <FormLabel className="flex items-center gap-1">
                        <Hash className="h-3 w-3" /> رقم القطعة
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="رقم قطعة الأرض" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="land_location"
                  render={({ field }) => (
                    <FormItem className="text-right">
                      <FormLabel className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> الموقع
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="الحي أو المنطقة" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="server_path"
                  render={({ field }) => (
                    <FormItem className="text-right">
                      <FormLabel className="flex items-center gap-1">
                        <FolderOpen className="h-3 w-3" /> مسار السيرفر
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="\\\Server\Projects\2026\..." {...field} dir="ltr" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


              </div>

              <DialogFooter className="flex-row-reverse gap-2">
                <Button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground">
                  {project ? "حفظ التغييرات" : "إنشاء المشروع"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto"
                >
                  إلغاء
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ClientDialog
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        onSave={async (clientData) => {
          const newClient = await addClient({
            name: clientData.name,
            phone: clientData.phone,
            type: clientData.type,
          });
          if (newClient) {
            handleNewClientCreated(newClient);
          }
        }}
      />
    </>
  );
}
