import React from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { useProjects } from "@/hooks/useProjects";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { springPresets, fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
const STAGE_COLORS = {
  not_started: "#E2E8F0",
  in_progress: "#3B82F6",
  waiting: "#F59E0B",
  completed: "#10B981",
};

const STAGE_LABELS: Record<string, string> = {
  waiting: "بانتظار الإجراء",
  not_started: "لم يبدأ",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
};

export default function Dashboard() {
  const { stats, logs, projects } = useProjects();
  document.title = "مكتب انس حلواني | لوحة التحكم"

  // Prepare data for the stage distribution chart
  const chartData = Object.entries(stats.stageDistribution).map(([status, count]) => ({
    name: STAGE_LABELS[status] || status,
    count,
    status,
  }));

  const today = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 pb-10" dir="rtl">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.gentle}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            اليوم: {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20 text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            النظام يعمل بكفاءة
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage Distribution Chart */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-2"
        >
          <Card className="h-full shadow-sm border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                توزيع مراحل العمل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.88 0.02 255)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      orientation="right"
                    />
                    <Tooltip
                      cursor={{ fill: 'oklch(0.95 0.01 255)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50}>
                      {chartData.map((entry, index) => (
                        <Cell
                          style={{ backgroundColor: STAGE_COLORS[entry.status as keyof typeof STAGE_COLORS] }}
                          key={`cell-${index}`}
                          className={STAGE_COLORS[entry.status as keyof typeof STAGE_COLORS]}
                          fill={STAGE_COLORS[entry.status as keyof typeof STAGE_COLORS] || "var(--primary)"}
                        />
                      ))}
                    </Bar>

                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(STAGE_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: STAGE_COLORS[key as keyof typeof STAGE_COLORS] }}
                    />

                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity Log */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card className="h-full shadow-sm border-border/40 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/30">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                آخر التحديثات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40 max-h-[420px] overflow-y-auto">
                {logs.length > 0 ? (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col"
                  >
                    {logs.slice(0, 10).map((log) => {
                      const project = projects.find(p => p.id === log.project_id);
                      return (
                        <motion.div
                          key={log.id}
                          variants={staggerItem}
                          className="p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1.5 rounded-full bg-primary/10 text-primary">
                              {log.action_type === "creation" ? <ArrowUpRight className="h-3 w-3" /> :
                                log.action_type === "status_change" ? <CheckCircle2 className="h-3 w-3" /> :
                                  log.action_type === "stage_completion" ? <CheckCircle2 className="h-3 w-3" /> :
                                    <Activity className="h-3 w-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {project?.name || "مشروع غير معروف"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {log.comment}
                              </p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">
                                {new Date(log.created_at).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="p-8 text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-20" />
                    <p className="text-sm text-muted-foreground">لا توجد تحديثات مؤخراً</p>
                  </div>
                )}
              </div>
              {logs.length > 0 && (
                <div className="p-3 border-t border-border/40 bg-muted/10 text-center">
                  <button className="text-xs font-medium text-primary hover:underline">
                    عرض سجل الأنشطة الكامل
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Project Status Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...springPresets.gentle }}
      >
        <Card className="shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ملخص حالة المشاريع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">المشاريع النشطة</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{stats.activeProjects}</span>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">قيد العمل</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">المشاريع المكتملة</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{stats.completedProjects}</span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">تم الإنجاز</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">مشاريع متأخرة</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-destructive">{stats.lateProjects}</span>
                  <span className="text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">تجاوز الموعد</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">إجمالي الإنجاز</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects) * 100 : 0}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
