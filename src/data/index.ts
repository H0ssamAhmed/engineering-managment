import { User } from "../lib/index";

/**
 * Mock data - Users are not yet integrated with Supabase.
 * Projects, stages, and clients now use real Supabase data.
 */

export const mockUsers: User[] = [
  { id: "u1", name: "م. فهد التميمي", role: "MANAGER", is_active: true },
  { id: "u2", name: "ياسر العتيبي", role: "SURVEYOR", is_active: true },
  { id: "u3", name: "م. مريم القحطاني", role: "ARCHITECT", is_active: true },
  { id: "u4", name: "م. خالد الحربي", role: "STRUCTURAL", is_active: true },
  { id: "u5", name: "م. سلطان الرويلي", role: "FACADE", is_active: true },
  { id: "u6", name: "م. محمد الدوسري", role: "MECHANICAL", is_active: true },
  { id: "u7", name: "سعد الشهري", role: "BALADI", is_active: true },
];
