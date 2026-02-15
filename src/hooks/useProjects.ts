import { useState, useCallback, useEffect } from "react";
import {
  Project,
  ProjectStage,
  ProjectLog,
  Client,
  STAGE_STATUS,
  ProjectWithStages,
} from "../lib/index";
import {
  fetchProjects,
  fetchProjectStages,
  fetchProjectLogs,
  fetchProjectById,
  createProject as createProjectApi,
  updateProject,
  updateProjectStage,
  addProjectLog,
  type CreateProjectInput,
} from "../api/projects";
import {
  fetchClients,
  createClient as createClientApi,
  updateClient as updateClientApi,
  deleteClient as deleteClientApi,
} from "../api/clients";
import { useAuth } from "@/contexts/AuthContext";
import { useQueries, useQuery } from "@tanstack/react-query";

const CURRENT_USER_ID = "82a9eeb0-ddec-470d-ac1c-7e4bb6efa83f";
const loadData = async () => {
  try {
    const [projectsData, stagesData, clientsData, logsData] = await Promise.all(
      [
        fetchProjects(),
        fetchProjectStages(),
        fetchClients(),
        fetchProjectLogs(),
      ],
    );
  } catch (err) {
    console.error("Error loading data:", err);
    // setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
  } finally {
    // setLoading(false);
  }
};

export const useProjects = () => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stages, setStages] = useState<ProjectStage[] | unknown>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [logs, setLogs] = useState<ProjectLog[]>([]);

  const data =
    //  { projects, projectStages, clients, projectLogs, isLoading, isError }
    useQueries({
      queries: [
        { queryKey: ["projects"], queryFn: fetchProjects },
        { queryKey: ["projectStages"], queryFn: fetchProjects },
        { queryKey: ["clients"], queryFn: fetchClients },
        { queryKey: ["projectLogs"], queryFn: fetchProjectLogs },
      ],
      combine(results) {
        return {
          projects: results[0].data,
          projectStages: results[1].data,
          clients: results[2].data,
          projectLogs: results[3].data,
          // ممكن كمان تجمع حالة التحميل لكل الطلبات في متغير واحد
          isLoading: results.some((res) => res.isLoading),
          isError: results.some((res) => res.isError),
        };
      },
    });
  useEffect(() => {
    if (!data.isError && !data.isLoading) {
      setProjects(data.projects);
      setStages(data?.projectStages);
      setClients(data.clients);
      setLogs(data.projectLogs);
    }
  }, [data]);

  // const loadData = useCallback(async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  // const [projectsData, stagesData, clientsData, logsData] =
  //   await Promise.all([
  //     fetchProjects(),
  //     fetchProjectStages(),
  //     fetchClients(),
  //     fetchProjectLogs(),
  //   ]);
  // setProjects(projectsData);
  // setStages(stagesData);
  // setClients(clientsData);
  // setLogs(logsData);
  //   } catch (err) {
  //     console.error("Error loading data:", err);
  //     setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   loadData();
  // }, [loadData]);

  const addLog = useCallback(
    async (log: Omit<ProjectLog, "id" | "created_at">) => {
      const success = await addProjectLog({
        project_id: log.project_id,
        stage_id: log.stage_id,
        user_id: CURRENT_USER_ID,
        action_type: log.action_type,
        old_value: log.old_value,
        new_value: log.new_value,
        comment: log.comment,
      });
      if (success) {
        const newLog: ProjectLog = {
          ...log,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        };
        setLogs((prev) => [newLog, ...prev]);
      }
    },
    [],
  );

  const addClient = useCallback(
    async (client: Omit<Client, "id">): Promise<Client | null> => {
      const newClient = await createClientApi(client);
      if (newClient) {
        setClients((prev) => [...prev, newClient]);
        return newClient;
      }
      return null;
    },
    [],
  );

  const updateClient = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Client, "id">>,
    ): Promise<Client | null> => {
      const updated = await updateClientApi(id, updates);
      if (updated) {
        setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
        return updated;
      }
      return null;
    },
    [],
  );

  const removeClient = useCallback(async (id: string): Promise<boolean> => {
    const success = await deleteClientApi(id);
    if (success) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      return true;
    }
    return false;
  }, []);

  const createProject = useCallback(
    async (
      projectData: Omit<Project, "id" | "created_at" | "updated_at" | "status">,
      userId: string,
    ) => {
      const input: CreateProjectInput = {
        name: projectData.name,
        type: projectData.type,
        land_plot_number: projectData.land_plot_number,
        land_location: projectData.land_location,
        server_path: projectData.server_path,
        client_id: projectData.client_id,
      };
      const newProject = await createProjectApi(input, userId);
      if (newProject) {
        setProjects((prev) => [newProject, ...prev]);
        await loadData();
        return newProject;
      }
      return null;
    },
    [loadData],
  );

  const updateStage = useCallback(
    async (
      projectId: string,
      stageId: string,
      updates: Partial<ProjectStage>,
    ) => {
      const projectStages = stages
        .filter((s) => s.project_id === projectId)
        .sort((a, b) => a.stage_order - b.stage_order);
      const currentStageIndex = projectStages.findIndex(
        (s) => s.id === stageId,
      );
      const currentStage = projectStages[currentStageIndex];

      if (!currentStage) return;

      if (updates.status && updates.status !== currentStage.status) {
        await addLog({
          project_id: projectId,
          stage_id: stageId,
          user_id: CURRENT_USER_ID,
          action_type: "status_change",
          old_value: currentStage.status,
          new_value: updates.status,
          comment: `تم تغيير حالة المرحلة "${currentStage.name}" إلى ${Object.values(STAGE_STATUS).find((s) => s.value === updates.status)?.label || updates.status}`,
        });
      }

      if (updates.notes !== undefined && updates.notes !== currentStage.notes) {
        await addLog({
          project_id: projectId,
          stage_id: stageId,
          user_id: CURRENT_USER_ID,
          action_type: "note_update",
          new_value: updates.notes,
          comment: `تم تحديث ملاحظات المرحلة "${currentStage.name}"`,
        });
      }

      const now = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Riyadh",
      });
      const currentUserName = profile?.name || "النظام";

      let finalUpdates: Partial<ProjectStage> = {
        ...updates,
        last_updated_by: currentUserName,
        last_updated_at: now,
      };

      if (updates.status === "completed") {
        finalUpdates = { ...finalUpdates };

        await addLog({
          project_id: projectId,
          stage_id: stageId,
          user_id: CURRENT_USER_ID,
          action_type: "stage_completion",
          comment: `تم إكمال المرحلة "${currentStage.name}" بنجاح`,
        });

        const nextStage = projectStages[currentStageIndex + 1];
        if (nextStage && nextStage.status === "not_started") {
          await updateProjectStage(
            nextStage.id,
            {
              status: "in_progress",
              last_updated_by: currentUserName,
              last_updated_at: now,
            },
            CURRENT_USER_ID,
          );
          await updateProject(projectId, {
            current_stage_id: nextStage.id,
          });
          await addLog({
            project_id: projectId,
            stage_id: nextStage.id,
            user_id: CURRENT_USER_ID,
            action_type: "auto_progression",
            comment: `بدء المرحلة التالية تلقائياً: "${nextStage.name}"`,
          });
        } else if (!nextStage) {
          await updateProject(projectId, { status: "completed" });
          await addLog({
            project_id: projectId,
            user_id: CURRENT_USER_ID,
            action_type: "stage_completion",
            comment: "تم إكمال المشروع بالكامل",
          });
        }
      }

      const success = await updateProjectStage(
        stageId,
        finalUpdates,
        CURRENT_USER_ID,
      );
      if (success) {
        await loadData();
      }
    },
    [stages, addLog, loadData, profile?.name],
  );

  const refreshClients = useCallback(() => {
    fetchClients().then(setClients);
  }, []);

  const getProjectById = useCallback(
    async (projectId: string): Promise<ProjectWithStages | null> => {
      return fetchProjectById(projectId);
    },
    [],
  );

  const stats = {
    totalProjects: projects.length,
    pausedProjects: projects.filter((p) => p.status === "paused").length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    cancelledProjects: projects.filter((p) => p.status === "cancelled").length,
    lateProjects: projects.filter((p) => p.status === "active").length,

    stageDistribution: stages.reduce(
      (acc, stage) => {
        acc[stage.status] = (acc[stage.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };

  return {
    projects,
    stages,
    clients,
    logs,
    stats,
    isLoading: data.isLoading,
    isError: data.isError,
    loadData,
    updateStage,
    createProject,
    addClient,
    updateClient,
    removeClient,
    addLog,
    refreshClients,
    getProjectById,
  };
};
