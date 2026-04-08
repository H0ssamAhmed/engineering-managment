import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Users,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { STAGE_STATUS, USER_ROLES } from "@/lib/index";

export function DashboardStats() {
  const { stages, stats } = useProjects();
  const engineerWorkload = useMemo(() => {
    const workload: Record<string, number> = {};
    stages?.forEach((stage) => {
      if (stage.status === "in_progress" || stage.status === "waiting") {
        workload[stage.responsible_user_id] = (workload[stage.responsible_user_id] || 0) + 1;
      }
    });

    return workload;
  }, [stages]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-r-4 border-r-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاريع</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeProjects} نشط | {stats.completedProjects} مكتمل
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مراحل لم تبدأ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notStartedStages.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              تجاوزت تاريخ الرخصة المستهدف
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بانتظار الإجراء</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">

              {stats.waitingStages.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              مراحل تتطلب تدخل فوري
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الإنجاز</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProjects > 0
                ? Math.round((stats.completedProjects / stats.totalProjects) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              من إجمالي المشاريع المسجلة
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              حالات مراحل العمل الحالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(STAGE_STATUS).map((status) => (
                <div key={status.value} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{status.label}</span>
                    <span className="text-muted-foreground">
                      {stats.stageDistribution[status.value] || 0} مرحلة
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${status.value === "completed" ? "bg-green-500" :
                        status.value === "in_progress" ? "bg-primary" :
                          status.value === "waiting" ? "bg-orange-500" : "bg-slate-300"
                        }`}
                      style={{
                        width: `${(stats.stageDistribution[status.value] || 0) / (stages.length || 1) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engineer Workload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              ضغط العمل لكل تخصص
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[350px] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {Object.entries(USER_ROLES).map(([key, label]) => {
                const count = Object.values(engineerWorkload).reduce((acc, val, idx) => {
                  return (idx % 7 === Object.keys(USER_ROLES).indexOf(key)) ? acc + val : acc;
                }, 0);

                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border/50">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{label}</span>
                      <span className="text-xs text-muted-foreground">مهام قيد التنفيذ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${count > 5 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
