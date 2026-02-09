import { supabase } from "../../supabase/supabase";
import type {
  Project,
  ProjectStage,
  ProjectLog,
  ProjectWithStages,
} from "@/lib/index";

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return (data || []) as Project[];
}

export async function fetchProjectById(
  projectId: string,
): Promise<ProjectWithStages | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_stages (*)
    `,
    )
    .eq("id", projectId)
    .order("stage_order", { foreignTable: "project_stages", ascending: true })
    .single();

  if (error) {
    console.error("Error fetching project by id:", error);
    return null;
  }

  if (!data) return null;

  const projectStages = (data.project_stages || []) as ProjectStage[];
  const { project_stages: _, ...project } = data as Project & {
    project_stages: ProjectStage[];
  };

  return {
    ...project,
    stages: projectStages.sort((a, b) => a.stage_order - b.stage_order),
  } as ProjectWithStages;
}

export async function fetchProjectStages(
  projectId?: string,
): Promise<ProjectStage[]> {
  let query = supabase
    .from("project_stages")
    .select("*")
    .order("stage_order", { ascending: true });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching project stages:", error);
    return [];
  }
  return (data || []) as ProjectStage[];
}

export async function fetchProjectLogs(): Promise<ProjectLog[]> {
  const { data, error } = await supabase
    .from("project_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching project logs:", error);
    return [];
  }
  return (data || []) as ProjectLog[];
}

export type CreateProjectInput = {
  name: string;
  type: string;
  land_plot_number: string;
  land_location: string;
  server_path: string;
  client_id: string;
};

export async function createProject(
  input: CreateProjectInput,
  userId: string,
): Promise<Project | null> {
  const now = new Date().toISOString();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      name: input.name,
      type: input.type,
      land_plot_number: input.land_plot_number,
      land_location: input.land_location,
      server_path: input.server_path,
      client_id: input.client_id,
      // current_stage_id: "",
      status: "active",
      // created_at: now,
      // updated_at: now,
    })
    .select()
    .single();

  if (projectError) {
    console.error("Error creating project:", projectError);
    return null;
  }

  const workflowNames = [
    "الرفع المساحي",
    "تسجيل الصك",
    "التصميم المعماري",
    "التصميم الإنشائي",
    "تصميم الواجهات",
    "التصاميم الميكانيكية",
    "تجهيز ملفات بلدي",
    "التقديم في بلدي",
  ];

  const today = now.split("T")[0];
  const stagesToInsert = workflowNames.map((name, index) => ({
    project_id: project.id,
    name,
    stage_order: index + 1,
    status: index === 0 ? "in_progress" : "not_started",
    planned_start_date: today,
    planned_end_date: today,
    responsible_user_id: userId,
    notes: "",
    last_updated_by: userId,
    last_updated_at: now,
  }));

  const { data: stages, error: stagesError } = await supabase
    .from("project_stages")
    .insert(stagesToInsert)
    .select();

  if (stagesError) {
    console.error("Error creating project stages:", stagesError);
  }

  const firstStageId = stages?.[0]?.id;
  if (firstStageId) {
    await supabase
      .from("projects")
      .update({ current_stage_id: firstStageId, updated_at: now })
      .eq("id", project.id);
  }

  await addProjectLog({
    project_id: project.id,
    user_id: userId,
    action_type: "creation",
    comment: "تم إنشاء المشروع الجديد بنجاح",
  });

  return { ...project, current_stage_id: firstStageId || "" } as Project;
}

export async function updateProject(
  projectId: string,
  updates: Partial<Pick<Project, "current_stage_id" | "status" | "updated_at">>,
): Promise<boolean> {
  const { error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", projectId);

  if (error) {
    console.error("Error updating project:", error);
    return false;
  }
  return true;
}

export async function updateProjectStage(
  stageId: string,
  updates: Partial<ProjectStage>,
  userId: string,
): Promise<boolean> {
  const now = new Date().toISOString();
  const lastUpdatedBy = updates.last_updated_by ?? userId;
  const lastUpdatedAt = updates.last_updated_at ?? now;
  const { error } = await supabase
    .from("project_stages")
    .update({
      ...updates,
      last_updated_by: lastUpdatedBy,
      last_updated_at: lastUpdatedAt,
    })
    .eq("id", stageId);

  if (error) {
    console.error("Error updating project stage:", error);
    return false;
  }
  return true;
}

export type AddProjectLogInput = {
  project_id: string;
  stage_id?: string;
  user_id: string;
  action_type: ProjectLog["action_type"];
  old_value?: string;
  new_value?: string;
  comment: string;
};

export async function addProjectLog(log: AddProjectLogInput): Promise<boolean> {
  const { error } = await supabase.from("project_logs").insert({
    ...log,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error adding project log:", error);
    return false;
  }
  return true;
}
