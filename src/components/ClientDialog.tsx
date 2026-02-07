import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Client } from "@/lib/index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, Phone, Building2 } from "lucide-react";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  onSave: (client: Client) => void;
}

const clientSchema = z.object({
  name: z.string().min(3, "يجب أن يكون الاسم 3 أحرف على الأقل"),
  phone: z.string().regex(/^[0-9+]{10,14}$/, "رقم الجوال غير صحيح"),
  type: z.enum(["individual", "company"], {
    required_error: "يرجى اختيار نوع العميل",
  }),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export function ClientDialog({
  open,
  onOpenChange,
  client,
  onSave,
}: ClientDialogProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || "",
      phone: client?.phone || "",
      type: client?.type || "individual",
    },
  });

  // Reset form when client changes or dialog opens
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: client?.name || "",
        phone: client?.phone || "",
        type: client?.type || "individual",
      });
    }
  }, [open, client, form]);

  const handleSubmit = (values: ClientFormValues) => {
    const updatedClient: Client = {
      id: client?.id || Math.random().toString(36).substring(2, 11),
      name: values.name,
      phone: values.phone,
      type: values.type,
    };
    onSave(updatedClient);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold">
            {client ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>اسم العميل</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="أدخل اسم العميل الكامل..."
                        className="pr-10 text-right"
                        {...field}
                      />
                      <User className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>رقم الجوال</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="05xxxxxxxx"
                        className="pr-10 text-right"
                        dir="ltr"
                        {...field}
                      />
                      <Phone className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="text-right space-y-3">
                  <FormLabel>نوع العميل</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row-reverse justify-end gap-6"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual" className="cursor-pointer flex items-center gap-2">
                          <User className="h-4 w-4" />
                          فرد
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="company" id="company" />
                        <Label htmlFor="company" className="cursor-pointer flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          شركة
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-row-reverse gap-2 sm:justify-start">
              <Button type="submit" className="w-full sm:w-auto">
                {client ? "تحديث البيانات" : "إضافة العميل"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
