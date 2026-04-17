import { supabase } from "../../supabase/supabase";
import type { Client, Project, ProjectStage } from "@/lib/index";

/** Row from `project_stages` with joined project and client */
export type ProjectStageWithProject = ProjectStage & {
  project: (Project & { client: Client | null }) | null;
};

/**
 * Loads all stages from `project_stages` with full project and client rows.
 */
export async function fetchProjectStagesWithProjects(): Promise<
  ProjectStageWithProject[]
> {
  const { data, error } = await supabase
    .from("project_stages")
    .select(
      `
      *,
      project:projects (
        *,
        client:clients (*)
      )
    `,
    )
    .order("stage_order", { ascending: true });

  if (error) {
    console.error("Error fetching project stages with projects:", error);
    return [];
  }

  return (data ?? []) as ProjectStageWithProject[];
}
