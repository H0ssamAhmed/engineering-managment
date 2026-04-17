import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProjectStagesWithProjects,
  type ProjectStageWithProject,
} from "@/api/stages";
import { WORKFLOW_STAGE_NAMES, type WorkflowStageName } from "@/api/projects";
import type { StageStatusValue } from "@/lib/index";

export type ProjectCompletionFilter = "all" | "completed" | "incomplete";

export type StageStatusFilter = "all" | StageStatusValue;

export type WorkflowNameFilter = "all" | WorkflowStageName;

export function useProjectStagesList() {
  const [stageStatus, setStageStatus] = useState<StageStatusFilter>("all");
  const [workflowName, setWorkflowName] = useState<WorkflowNameFilter>("all");
  const [projectCompletion, setProjectCompletion] =
    useState<ProjectCompletionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["projectStagesWithProjects"],
    queryFn: fetchProjectStagesWithProjects,
  });

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((row) => {
      if (stageStatus !== "all" && row.status !== stageStatus) return false;

      if (workflowName !== "all" && row.name !== workflowName) return false;

      const proj = row.project;
      if (projectCompletion !== "all" && proj) {
        const isProjectCompleted = proj.status === "completed";
        if (projectCompletion === "completed" && !isProjectCompleted)
          return false;
        if (projectCompletion === "incomplete" && isProjectCompleted)
          return false;
      }
      if (projectCompletion !== "all" && !proj) return false;

      if (!q) return true;

      const inStage =
        row.name.toLowerCase().includes(q) ||
        (row.notes && row.notes.toLowerCase().includes(q));
      const inProject =
        proj &&
        (proj.name.toLowerCase().includes(q) ||
          proj.land_plot_number.includes(q) ||
          proj.land_location.toLowerCase().includes(q) ||
          (proj.client?.name && proj.client.name.toLowerCase().includes(q)));

      return Boolean(inStage || inProject);
    });
  }, [data, stageStatus, workflowName, projectCompletion, searchQuery]);

  const resetFilters = useCallback(() => {
    setStageStatus("all");
    setWorkflowName("all");
    setProjectCompletion("all");
    setSearchQuery("");
  }, []);

  return {
    rows: data as ProjectStageWithProject[],
    filteredRows,
    isLoading,
    isFetching,
    isError,
    refetch,
    stageStatus,
    setStageStatus,
    workflowName,
    setWorkflowName,
    workflowStageNames: WORKFLOW_STAGE_NAMES,
    projectCompletion,
    setProjectCompletion,
    searchQuery,
    setSearchQuery,
    resetFilters,
  };
}
