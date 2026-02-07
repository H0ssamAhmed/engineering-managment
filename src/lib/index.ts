export const ROUTE_PATHS = {
  DASHBOARD: "/",
  PROJECTS: "/projects",
  CLIENTS: "/clients",
  USERS: "/users",
} as const;

export const USER_ROLES = {
  MANAGER: "مدير المكتب",
  SURVEYOR: "مساح",
  ARCHITECT: "مصمم معماري",
  STRUCTURAL: "مهندس إنشائي",
  FACADE: "مصمم واجهات",
  MECHANICAL: "مصمم ميكانيك",
  BALADI: "معقب بلدي",
} as const;

export type UserRole = keyof typeof USER_ROLES;

export const STAGE_STATUS = {
  NOT_STARTED: {
    label: "لم يبدأ",
    value: "not_started",
    color: "text-muted-foreground bg-muted",
  },
  IN_PROGRESS: {
    label: "قيد التنفيذ",
    value: "in_progress",
    color: "text-primary bg-primary/10",
  },
  WAITING: {
    label: "بانتظار الإجراء",
    value: "waiting",
    color: "text-orange-600 bg-orange-100",
  },
  COMPLETED: {
    label: "مكتمل",
    value: "completed",
    color: "text-green-600 bg-green-100",
  },
} as const;

export type StageStatusValue =
  (typeof STAGE_STATUS)[keyof typeof STAGE_STATUS]["value"];

export const PROJECT_TYPES = {
  BUILDING_PERMIT: "رخصة بناء",
  MODIFICATION: "اضافة وتعديل",
  DEMOLITION: "هدم وترميم",
  SURVEY_REPORT: "تقرير مساحي",
} as const;

export type ProjectType = keyof typeof PROJECT_TYPES;

export interface Client {
  id: string;
  name: string;
  phone: string;
  type: "individual" | "company";
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  is_active: boolean;
}

export interface ProjectStage {
  id: string;
  project_id: string;
  name: string;
  stage_order: number;
  status: StageStatusValue;
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  responsible_user_id: string;
  notes: string;
  last_updated_by: string;
  last_updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  land_plot_number: string;
  land_location: string;
  server_path: string;
  current_stage_id: string;
  target_license_date: string;
  client_id: string;
  created_at: string;
  updated_at: string;
  status: "active" | "completed" | "cancelled" | "paused";
}

export interface ProjectLog {
  id: string;
  project_id: string;
  stage_id?: string;
  user_id: string;
  action_type:
    | "status_change"
    | "note_update"
    | "auto_progression"
    | "stage_completion"
    | "creation";
  old_value?: string;
  new_value?: string;
  comment: string;
  created_at: string;
}

/**
 * Utility functions for Engineering ERP
 */

export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

export const getStatusLabel = (statusValue: StageStatusValue) => {
  const status = Object.values(STAGE_STATUS).find(
    (s) => s.value === statusValue,
  );
  return status ? status.label : "غير معروف";
};

export const getRoleLabel = (role: UserRole) => {
  return USER_ROLES[role] || "غير معروف";
};

export const getProjectTypeLabel = (type: ProjectType) => {
  return PROJECT_TYPES[type] || "غير معروف";
};
