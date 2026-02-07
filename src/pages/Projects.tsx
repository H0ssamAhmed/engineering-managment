import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  MapPin,
  User,
  Calendar,
  FolderOpen,
  ChevronLeft,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  Clipboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ROUTE_PATHS,
  Project,
  STAGE_STATUS,
  formatDate,
  getProjectTypeLabel
} from "@/lib/index";
import { useProjects } from "@/hooks/useProjects";
import { ProjectDialog } from "@/components/ProjectDialog";
import { ProjectStageAccordion } from "@/components/ProjectStageAccordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CURRENT_USER_ID = "u_1"; // Mocking logged in user

export default function Projects() {
  const { projects, stages, clients, updateStage, createProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.land_plot_number.includes(searchQuery);

      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || "عميل غير معروف";
  };

  const getProjectProgress = (projectId: string) => {
    const projectStages = stages.filter((s) => s.project_id === projectId);
    if (projectStages.length === 0) return 0;
    const completed = projectStages.filter((s) => s.status === "completed").length;
    return Math.round((completed / projectStages.length) * 100);
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path)
  };

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">إدارة المشاريع</h1>
          <p className="text-muted-foreground mt-1">
            تتبع مراحل العمل والجدول الزمني لجميع المشاريع الهندسية
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6"
        >
          <Plus className="w-5 h-5" />
          إنشاء مشروع جديد
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="ابحث باسم المشروع أو رقم القطعة..."
            className="pr-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="w-4 h-4" />
            تصفية:
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-10">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-8 w-px bg-border mx-2" />

          <div className="flex bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all_projects" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="all_projects">جميع المشاريع ({filteredProjects.length})</TabsTrigger>
          <TabsTrigger value="my_tasks">مهامي الحالية</TabsTrigger>
        </TabsList>

        <TabsContent value="all_projects" className="m-0">
          {filteredProjects.length === 0 ? (
            <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <CardTitle className="text-muted-foreground">لا توجد مشاريع تطابق بحثك</CardTitle>
              <Button
                variant="link"
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                className="mt-2"
              >
                إعادة ضبط المرشحات
              </Button>
            </Card>
          ) : (
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 xl:grid-cols-2 gap-6"
              : "flex flex-col gap-4"
            }>
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden border-border hover:shadow-md transition-shadow group">
                      <CardHeader className="pb-3 border-b border-border/50 bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {project.name}
                              </CardTitle>
                              <Badge variant={project.status === 'active' ? 'outline' : 'secondary'} className="text-xs">
                                {project.status === 'active' ? 'قيد العمل' : 'مكتمل'}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2 text-sm">
                              <User className="w-3.5 h-3.5" />
                              {getClientName(project.client_id)}
                            </CardDescription>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-none">
                            {getProjectTypeLabel(project.type)}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>الموقع: {project.land_location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                              <FolderOpen className="w-4 h-4" />
                              <span className="font-mono text-xs truncate" dir="ltr">{project.server_path}</span>
                              <span
                                onClick={() => copyPath(project.server_path)}
                                className="grodup  "

                              >
                                <Tooltip delayDuration={0}>
                                  <TooltipTrigger>
                                    <Clipboard className="p-1 rounded-md bg-primary/10 group-hover:bg-primary/80  transition-all cursor-pointer" />

                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>نسخ مسار المشروع</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip >

                                </Tooltip>
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">

                            <div className="flex items-center gap-2 text-sm">
                              {getProjectProgress(project.id) === 100 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-blue-500" />
                              )}
                              <span className="font-medium">
                                الإنجاز: {getProjectProgress(project.id)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-end mb-2">
                            <Link to={`${project.id}`} className="text-xs text-primary bg-secondary p-2 rounded-md">
                              <h4 className="text-sm font-semibold">مراحل المشروع وسير العمل</h4>
                            </Link>
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my_tasks" className="m-0">
          <Card className="p-12 text-center border-dashed">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <CardTitle className="text-muted-foreground">المهام المسندة إليك ستظهر هنا</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              حالياً يتم عرض جميع المشاريع في التبويب الرئيسي
            </p>
          </Card>
        </TabsContent>
      </Tabs>

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(data) => {
          createProject({
            name: data.name,
            type: data.type,
            land_plot_number: data.land_plot_number,
            land_location: data.land_location,
            server_path: data.server_path,
            current_stage_id: "",
            target_license_date: data.target_license_date,
            client_id: data.client_id,
          }, CURRENT_USER_ID);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
