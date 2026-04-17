import { Link } from "react-router-dom";
import {
  MapPin,
  Hash,
  FolderOpen,
  User,
  Layers,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectStageWithProject } from "@/api/stages";
import {
  STAGE_STATUS,
  getStatusLabel,
  getProjectTypeLabel,
  ProjectStatusEnum,
  formatDate,
  formatDateTime,
  ROUTE_PATHS,
} from "@/lib/index";

function stageStatusClasses(status: ProjectStageWithProject["status"]) {
  return (
    Object.values(STAGE_STATUS).find((s) => s.value === status)?.color ??
    "text-muted-foreground bg-muted"
  );
}

type ProjectStageCardProps = {
  row: ProjectStageWithProject;
};

export function ProjectStageCard({ row }: ProjectStageCardProps) {
  const project = row.project;
  const stageStatusClass = stageStatusClasses(row.status);

  return (
    <Card dir="" className="overflow-hidden border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Layers className="w-4 h-4 text-primary shrink-0" />
              <span className="font-semibold text-lg truncate">{row.name}</span>
              <Badge className={`shrink-0 text-xs font-medium ${stageStatusClass}`}>
                {getStatusLabel(row.status)}
              </Badge>
            </div>
            {project && (
              <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground">
                  {project.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  {ProjectStatusEnum[project.status]}
                </Badge>
              </p>
            )}
          </div>
          {project && (
            <Button variant="outline" size="sm" className="shrink-0 gap-1.5" asChild>
              <Link to={`${ROUTE_PATHS.PROJECTS}/${project.id}`}>
                <span>تفاصيل المشروع</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">/
            <p className="text-muted-foreground text-xs font-medium">المشروع</p>
            {!project ? (
              <p className="text-destructive text-sm">لا يوجد بيانات مشروع مرتبطة</p>
            ) : (
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>
                    العميل:{" "}
                    {project.client?.name ?? "—"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-primary/10 text-primary border-none shrink-0">
                    {getProjectTypeLabel(project.type)}
                  </Badge>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{project.land_location}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>رقم القطعة: {project.land_plot_number}</span>
                </li>
                <li className="flex items-start  gap-2 min-w-0 text-end col-span-2">
                  <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-mono text-xs break-all" dir="ltr">
                    {project.server_path}
                  </span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>
                    إنشاء المشروع: {formatDate(project.created_at)} — آخر تحديث:{" "}
                    {formatDate(project.updated_at)}
                  </span>
                </li>
              </ul>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">المرحلة</p>
            <ul className="space-y-2">
              <li>ترتيب المرحلة: {row.stage_order}</li>
              {row.notes ? (
                <li className="text-muted-foreground whitespace-pre-wrap">
                  ملاحظات: {row.notes}
                </li>
              ) : (
                <li className="text-muted-foreground">لا ملاحظات</li>
              )}
              {row.last_updated_at && (
                <li className="text-xs text-muted-foreground">
                  آخر تحديث للمرحلة: {formatDateTime(row.last_updated_at)}
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
