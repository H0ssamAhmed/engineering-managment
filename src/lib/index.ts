import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserSquare,
  ChartNoAxesColumnDecreasing,
} from "lucide-react";

export const ROUTE_PATHS = {
  DASHBOARD: "/",
  LOGIN: "/login",
  PROJECTS: "/projects",
  CLIENTS: "/clients",
  USERS: "/users",
  USER_DATA: "/users-info",
  PROJECTS_STATGES: "/projects-stages",
} as const;

export const USER_ROLES = {
  ARCHITECT: "مهندس معماري",
  ARCHITECTURAL_DESIGNER: "مصمم معماري",
  STRUCTURAL: "مهندس إنشائي",
  SURVEYOR: "مساح",
  FACADE_DESIGNER: "مصمم واجهات",
  MECHANICAL: "مهندس ميكانيك",
  BALADI_SUBMITTER: "مسؤول رفع معاملات بلدي",
  BALADI: "معقب بلدي",
  MANAGER: "مدير المكتب",
} as const;
export type UserRole = keyof typeof USER_ROLES;
export type WorkflowStageName = (typeof WORKFLOW_STAGE_NAMES)[number];

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

export type CreateProjectInput = {
  name: string;
  type: string;
  land_plot_number: string;
  land_location: string;
  server_path: string;
  client_id: string;
};

/** Default workflow stage titles inserted for each new project — also used for list filters */
export const WORKFLOW_STAGE_NAMES = [
  "الرفع المساحي",
  "تسجيل الصك",
  "التصميم المعماري",
  "التصميم الإنشائي",
  "تصميم الواجهات",
  "التصاميم الميكانيكية",
  "تجهيز ملفات بلدي",
  "التقديم في بلدي",
] as const;

export type StageStatusValue =
  (typeof STAGE_STATUS)[keyof typeof STAGE_STATUS]["value"];

export const PROJECT_TYPES = {
  BUILDING_PERMIT: "رخصة بناء",
  MODIFICATION: "اضافة وتعديل",
  Transfer_ownership: "نقل ملكية",
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
  email?: string;
  role: UserRole;
  is_active: boolean;
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
export interface ProjectStage {
  id: string;
  project_id: string;
  name: string;
  stage_order: number;
  status: StageStatusValue;
  responsible_user_id: string;
  notes: string;
  last_updated_by_user?: { name: string; id: string };
  last_updated_by?: string;
  last_updated_at?: string;
}
export type ProjectStatus = "active" | "completed" | "cancelled" | "paused";
export const ProjectStatusEnum = {
  active: "نشط",
  completed: "مكتمل",
  cancelled: "ملغي",
  paused: "متوقف",
};

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  land_plot_number: string;
  land_location: string;
  server_path: string;
  current_stage_id: string;
  client_id: string;
  created_at: string;
  updated_at: string;
  status: ProjectStatus;
}

export type ProjectWithStages = Project & { stages: ProjectStage[] };

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

/** Full date + time in 12-hour format (e.g. "٩ فبراير ٢٠٢٦، ٣:٤٥ م") */
export const formatDateTime = (dateString: string) => {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
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

export const navigation = [
  {
    name: "لوحة التحكم",
    href: ROUTE_PATHS.DASHBOARD,
    icon: LayoutDashboard,
    isDisplayed: (role: string) => role || true,
  },
  {
    name: "المشاريع الهندسية",
    href: ROUTE_PATHS.PROJECTS,
    icon: Briefcase,
    isDisplayed: (role: string) => role || true,
  },
  {
    name: "مراحل المشاريع",
    href: ROUTE_PATHS.PROJECTS_STATGES,
    icon: ChartNoAxesColumnDecreasing,
    isDisplayed: (role: string) => role || true,
  },
  {
    name: "قاعدة العملاء",
    href: ROUTE_PATHS.CLIENTS,
    icon: UserSquare,
    isDisplayed: (role: string) => role || true,
  },
  {
    name: "إدارة الموظفين",
    href: ROUTE_PATHS.USERS,
    icon: Users,
    isDisplayed: (role: string) => role == "MANAGER",
  },
  {
    name: "معلوماتي",
    href: ROUTE_PATHS.USER_DATA,
    icon: Users,
    isDisplayed: (role: string) => role || true,
  },
];

export interface Notification {
  id: string;
  user_id: string;
  type:
    | "stage_assignment"
    | "status_change"
    | "comment_added"
    | "project_completed";
  title: string;
  message?: string;

  // Related entities
  project_id?: string;
  stage_id?: string;
  assigned_by_user_id?: string;
  assigned_by_user?: { name: string; id: string };

  // UI state
  is_read: boolean;
  action_url?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

type NotificationType =
  | "stage_assignment"
  | "status_change"
  | "comment_added"
  | "project_completed";
