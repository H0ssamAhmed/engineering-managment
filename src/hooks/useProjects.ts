import { useState, useCallback } from "react";
import {
  Project,
  ProjectStage,
  ProjectLog,
  Client,
  StageStatusValue,
  STAGE_STATUS,
} from "../lib/index";
import { mockProjects, mockProjectStages, mockClients } from "../data/index";

/**
 * Custom hook for managing project state, stage updates, automatic progression, and audit logging.
 * This simulates a database layer using local state.
 */
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [stages, setStages] = useState<ProjectStage[]>(mockProjectStages);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [logs, setLogs] = useState<ProjectLog[]>([]);

  // Utility to add a log entry
  const addLog = useCallback((log: Omit<ProjectLog, "id" | "created_at">) => {
    const newLog: ProjectLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    setLogs((prev) => [newLog, ...prev]);
  }, []);

  // Function to add a new client (used during project creation)
  const addClient = useCallback((client: Omit<Client, "id">) => {
    const newClient: Client = {
      ...client,
      id: `c_${Math.random().toString(36).substr(2, 5)}`,
    };
    setClients((prev) => [...prev, newClient]);
    return newClient;
  }, []);

  // Function to create a new project with its default stages
  const createProject = useCallback(
    (
      projectData: Omit<Project, "id" | "created_at" | "updated_at" | "status">,
      userId: string,
    ) => {
      const projectId = `p_${Math.random().toString(36).substr(2, 5)}`;
      const now = new Date().toISOString();

      const newProject: Project = {
        ...projectData,
        id: projectId,
        created_at: now,
        updated_at: now,
        status: "active",
      };

      // Default workflow stages for Building Permit as per requirements
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

      const newStages: ProjectStage[] = workflowNames.map((name, index) => ({
        id: `ps_${projectId}_${index + 1}`,
        project_id: projectId,
        name,
        stage_order: index + 1,
        status: index === 0 ? "in_progress" : "not_started",
        planned_start_date: now.split("T")[0],
        planned_end_date: now.split("T")[0], // Should be calculated in real app
        actual_start_date: index === 0 ? now.split("T")[0] : undefined,
        responsible_user_id: userId,
        notes: "",
        last_updated_by: userId,
        last_updated_at: now,
      }));

      setProjects((prev) => [...prev, newProject]);
      setStages((prev) => [...prev, ...newStages]);

      addLog({
        project_id: projectId,
        user_id: userId,
        action_type: "creation",
        comment: "تم إنشاء المشروع الجديد بنجاح",
      });

      return newProject;
    },
    [addLog],
  );

  // Handle Stage Updates with Automatic Progression
  const updateStage = useCallback(
    (
      projectId: string,
      stageId: string,
      updates: Partial<ProjectStage>,
      userId: string,
    ) => {
      const now = new Date().toISOString();
      const today = now.split("T")[0];

      setStages((prevStages) => {
        const projectStages = prevStages
          .filter((s) => s.project_id === projectId)
          .sort((a, b) => a.stage_order - b.stage_order);
        const currentStageIndex = projectStages.findIndex(
          (s) => s.id === stageId,
        );

        if (currentStageIndex === -1) return prevStages;

        const currentStage = projectStages[currentStageIndex];
        const updatedStage: ProjectStage = {
          ...currentStage,
          ...updates,
          last_updated_by: userId,
          last_updated_at: now,
        };

        // Logging Status Change
        if (updates.status && updates.status !== currentStage.status) {
          addLog({
            project_id: projectId,
            stage_id: stageId,
            user_id: userId,
            action_type: "status_change",
            old_value: currentStage.status,
            new_value: updates.status,
            comment: `تم تغيير حالة المرحلة "${currentStage.name}" إلى ${STAGE_STATUS[Object.keys(STAGE_STATUS).find((k) => STAGE_STATUS[k as keyof typeof STAGE_STATUS].value === updates.status) as keyof typeof STAGE_STATUS]?.label || updates.status}`,
          });
        }

        // Logging Note Update
        if (
          updates.notes !== undefined &&
          updates.notes !== currentStage.notes
        ) {
          addLog({
            project_id: projectId,
            stage_id: stageId,
            user_id: userId,
            action_type: "note_update",
            new_value: updates.notes,
            comment: `تم تحديث ملاحظات المرحلة "${currentStage.name}"`,
          });
        }

        let finalStages = prevStages.map((s) =>
          s.id === stageId ? updatedStage : s,
        );

        // Automatic Stage Progression Rule
        if (updates.status === "completed") {
          // 1. Mark current stage completion date
          updatedStage.actual_end_date = today;

          addLog({
            project_id: projectId,
            stage_id: stageId,
            user_id: userId,
            action_type: "stage_completion",
            comment: `تم إكمال المرحلة "${currentStage.name}" بنجاح`,
          });

          // 2. Open Next Stage Automatically
          const nextStage = projectStages[currentStageIndex + 1];
          if (nextStage && nextStage.status === "not_started") {
            finalStages = finalStages.map((s) =>
              s.id === nextStage.id
                ? {
                    ...s,
                    status: "in_progress",
                    actual_start_date: today,
                    last_updated_by: userId,
                    last_updated_at: now,
                  }
                : s,
            );

            // Update project current_stage_id
            setProjects((prev) =>
              prev.map((p) =>
                p.id === projectId
                  ? { ...p, current_stage_id: nextStage.id, updated_at: now }
                  : p,
              ),
            );

            addLog({
              project_id: projectId,
              stage_id: nextStage.id,
              user_id: userId,
              action_type: "auto_progression",
              comment: `بدء المرحلة التالية تلقائياً: "${nextStage.name}"`,
            });
          } else if (!nextStage) {
            // Final Stage Handling
            setProjects((prev) =>
              prev.map((p) =>
                p.id === projectId
                  ? { ...p, status: "completed", updated_at: now }
                  : p,
              ),
            );

            addLog({
              project_id: projectId,
              user_id: userId,
              action_type: "stage_completion",
              comment: "تم إكمال المشروع بالكامل",
            });
          }
        }

        return finalStages;
      });
    },
    [addLog],
  );

  // Stats Calculation
  const stats = {
    totalProjects: projects.length,
    pausedProjects: projects.filter((p) => p.status === "paused").length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    lateProjects: projects.filter((p) => {
      const target = new Date(p.target_license_date);
      const now = new Date();
      return p.status === "active" && target < now;
    }).length,
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
    updateStage,
    createProject,
    addClient,
    addLog,
  };
};
