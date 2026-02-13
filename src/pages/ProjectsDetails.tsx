import { ProjectStageAccordion } from "@/components/ProjectStageAccordion";
import { useProjects } from "@/hooks/useProjects";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProjectById, updateProjectStage } from "@/api/projects";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProjectStage } from "@/lib";

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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/projects" className="hover:text-foreground">
          المشاريع
        </Link>
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span className="text-foreground font-medium">{projectDetails.name}</span>
      </div>
      <h1 className="text-2xl font-bold">{projectDetails.name}</h1>
      <ProjectStageAccordion
        projectId={projectDetails.id}
        stages={projectDetails.stages}

      />
    </div>
  );
}