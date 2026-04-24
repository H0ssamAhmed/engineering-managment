import React, { useEffect, useState } from "react";
import { Filter, Plus, Search, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardTitle } from "@/components/ui/card";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { ProjectStageCard } from "@/components/projects/ProjectStageCard";
import { useProjects } from "@/hooks/useProjects";
import {
    useProjectStagesList,
    type StageStatusFilter,
    type ProjectCompletionFilter,
    type WorkflowNameFilter,
} from "@/hooks/useProjectStagesList";
import { STAGE_STATUS } from "@/lib/index";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ProjectsPagination from "@/components/projects/ProjectsPagination";

const ProjectsStages = () => {
    document.title = "مكتب انس حلواني | مراحل المشاريع";
    const { clients, createProject, addClient } = useProjects();
    const {
        filteredRows,
        isLoading,
        stageStatus,
        setStageStatus,
        workflowName,
        setWorkflowName,
        workflowStageNames,
        projectCompletion,
        setProjectCompletion,
        searchQuery,
        setSearchQuery,
        resetFilters,
        setSearchParams,
        page,
        limit,
    } = useProjectStagesList();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { isUserActive, profile } = useAuth();

    const handleOpenDialog = () => {
        if (!isUserActive) {
            toast.error("حسابك غير نشط ،يرجي التواصل مع المدير.");
            return;
        }
        setIsDialogOpen(true);
    };

    const changeLimit = (newLimit: number) => {
        setSearchParams({
            page: "1", // reset page (important)
            limit: String(newLimit),
        });
    }


    const goToPage = (newPage: number) => {
        setSearchParams({
            page: String(newPage),
            limit: String(limit),
        });
    };
    return (
        <div className="space-y-6 pb-12" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        إدارة المراحل & المشاريع
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        تتبع مراحل العمل والجدول الزمني لجميع المشاريع الهندسية
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={handleOpenDialog}
                    className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6"
                >
                    <Plus className="w-5 h-5" />
                    إنشاء مشروع جديدt
                </Button>
            </div>


            <div className="flex flex-col gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
                    <div className="relative w-full xl:max-w-lg">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="ابحث باسم المرحلة أو المشروع أو رقم القطعة..."
                            className="pr-10 h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Filter className="w-4 h-4 shrink-0" />
                            تصفية:
                        </div>
                        <Select
                            dir="rtl"
                            value={stageStatus}
                            onValueChange={(v) => setStageStatus(v as StageStatusFilter)}
                        >
                            <SelectTrigger className="w-full sm:w-[200px] h-10">
                                <SelectValue placeholder="حالة المرحلة" />
                            </SelectTrigger>
                            <SelectContent

                            >
                                <SelectItem value="all">كل حالات المراحل</SelectItem>
                                {Object.values(STAGE_STATUS).map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            dir="rtl"
                            value={workflowName}
                            onValueChange={(v) => setWorkflowName(v as WorkflowNameFilter)}
                        >
                            <SelectTrigger className="w-full sm:w-[220px] h-10">
                                <SelectValue placeholder="مرحلة سير العمل" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">كل مراحل سير العمل</SelectItem>
                                {workflowStageNames.map((name) => (
                                    <SelectItem key={name} value={name}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            dir="rtl"
                            value={projectCompletion}
                            onValueChange={(v) =>
                                setProjectCompletion(v as ProjectCompletionFilter)
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[200px] h-10">
                                <SelectValue placeholder="حالة إنجاز المشروع" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">كل المشاريع</SelectItem>
                                <SelectItem value="completed">مشاريع مكتملة</SelectItem>
                                <SelectItem value="incomplete">مشاريع غير مكتملة</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
                    <p className="text-muted-foreground">جاري التحميل...</p>
                </Card>
            ) : filteredRows.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
                    <FolderOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <CardTitle className="text-muted-foreground">
                        لا توجد مراحل تطابق عوامل التصفية
                    </CardTitle>
                    <Button variant="link" onClick={resetFilters} className="mt-2">
                        إعادة ضبط المرشحات
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredRows.map((row) => (
                            <motion.div
                                key={row.id}
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ProjectStageCard row={row} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <div className="flex items-cent justify-sta gap-3 p-2">
                <ProjectsPagination
                    goToPage={goToPage}
                    page={page}
                    limit={limit}
                    length={filteredRows.length}
                />
                <Select
                    value={String(limit)}
                    onValueChange={(value) => changeLimit(Number(value))}
                >
                    <SelectTrigger className=" w-fit">
                        <SelectValue placeholder="اختر العدد" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>

            </div>

            <ProjectDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                clients={clients}
                addClient={addClient}
                onSave={async (data) => {
                    await createProject(
                        {
                            name: data.name,
                            type: data.type,
                            land_plot_number: data.land_plot_number,
                            land_location: data.land_location,
                            server_path: data.server_path,
                            current_stage_id: "",
                            client_id: data.client_id,
                        },
                        profile?.id ?? "",
                    );
                }}
            />
        </div>
    );
};

export default ProjectsStages;
