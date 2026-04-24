import { supabase } from "../../supabase/supabase";
import type { Client, Project, ProjectStage } from "@/lib/index";

/** Row from `project_stages` with joined project and client */
export type ProjectStageWithProject = ProjectStage & {
  project: (Project & { client: Client | null }) | null;
};

/**
 * Loads all stages from `project_stages` with full project and client rows.
 */
export async function fetchProjectStagesWithProjects({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<ProjectStageWithProject[]> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

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
      { count: "exact" },
    )
    .range(from, to)
    .order("stage_order", { ascending: true });

  if (error) {
    console.error("Error fetching project stages with projects:", error);
    return [];
  }

  return (data ?? []) as ProjectStageWithProject[];
}
