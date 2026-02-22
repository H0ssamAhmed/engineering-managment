import { ProjectStageAccordion } from "@/components/ProjectStageAccordion";
import { useProjects } from "@/hooks/useProjects";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, FileText, Hash, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProjectById, updateProjectStage } from "@/api/projects";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProjectStage, ROUTE_PATHS } from "@/lib";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-select";
import { Badge } from "@/components/ui/badge";

export default function ProjectsDetails() {
  const { id } = useParams();
  const { data: projectDetails, isLoading } = useQuery({
    queryKey: [id], queryFn: () => fetchProjectById(id)
  })
  const { data, error, isPending } = useMutation({
    mutationKey: [id], mutationFn: (
      stageId: Partial<Pick<ProjectStage, "id">>,
      updates: Partial<ProjectStage>,
      userId: string,) => updateProjectStage(stageId, updates, userId)
  })
  console.log(data);

  const { updateStage } = useProjects()
  if (isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        جاري التحميل...
      </div>
    );
  }
  document.title = `مكتب انس حلواني | ${projectDetails.name}`

  if (!projectDetails) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">المشروع غير موجود</p>
        <Button asChild variant="outline">
          <Link to="/projects" className="gap-2">
            <ChevronRight className="w-4 h-4" />
            العودة للمشاريع
          </Link>
        </Button>
      </div>
    );
  }



  return (
    <div className="space-y-6 pb-12" dir="rtl">

      <Card className="w-full max--2xl mx-auto shadow-lg border-t-4 border-t-primary" dir="rtl">
        <div className="flex p-4 items-center gap-2 text-sm text-muted-foreground">
          <Link to={ROUTE_PATHS.PROJECTS} className="hover:text-foreground">
            المشاريع
          </Link>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="text-foreground font-medium">{projectDetails.name}</span>
        </div>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {projectDetails.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                نوع المشروع: {projectDetails.type === "BUILDING_PERMIT" ? "رخصة بناء" : projectDetails.type}
              </CardDescription>
            </div>
            <Badge variant={projectDetails.status === "active" ? "default" : "secondary"} className="px-3 py-1">
              {projectDetails.status === "active" ? "نشط" : projectDetails.status}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-6">

          {/* معلومات الموقع والأرض */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الموقع (الحي)</p>
                <p className="font-medium text-lg">{projectDetails.land_location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Hash className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">رقم القطعة</p>
                <p className="font-medium text-lg">{projectDetails.land_plot_number}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProjectStageAccordion
        projectId={projectDetails.id}
        stages={projectDetails.stages}

      />
    </div>
  );
}