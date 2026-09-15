// src/js/departments.ts
// Automated incident report routing logic.
// Maps incident types to departments and provides notification helpers.

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
}

export type IncidentType = "fire" | "accident" | "flood" | "crime" | "medical" | "other";

export interface DepartmentRouting {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  notificationChannel: string;
}

// Maps incident type to department
export const TYPE_TO_DEPARTMENT: Record<string, DepartmentRouting> = {
  fire: {
    departmentId: "fire",
    departmentName: "Fire Department",
    departmentCode: "fire",
    notificationChannel: "department-fire",
  },
  medical: {
    departmentId: "medical",
    departmentName: "Health / Emergency Medical Services (EMS)",
    departmentCode: "medical",
    notificationChannel: "department-medical",
  },
  crime: {
    departmentId: "crime",
    departmentName: "Police / Local Security",
    departmentCode: "crime",
    notificationChannel: "department-crime",
  },
  flood: {
    departmentId: "flood",
    departmentName: "Disaster Risk Reduction Management (DRRM)",
    departmentCode: "flood",
    notificationChannel: "department-flood",
  },
  other: {
    departmentId: "other",
    departmentName: "Central Dispatch / Admin",
    departmentCode: "other",
    notificationChannel: "department-other",
  },
  accident: {
    departmentId: "other",
    departmentName: "Central Dispatch / Admin",
    departmentCode: "other",
    notificationChannel: "department-other",
  },
};

export function getDepartmentForType(type: string): DepartmentRouting {
  return TYPE_TO_DEPARTMENT[type] ?? TYPE_TO_DEPARTMENT.other;
}

export function getDepartmentCodeForType(type: string): string {
  return getDepartmentForType(type).departmentCode;
}

export function getNotificationChannelForType(type: string): string {
  return getDepartmentForType(type).notificationChannel;
}

// Department metadata for display
export const DEPARTMENT_META: Record<string, { icon: string; color: string; label: string }> = {
  fire:     { icon: "🔥", color: "#FF6B6B", label: "Fire Department" },
  medical:  { icon: "🏥", color: "#2ECC8F", label: "Health / EMS" },
  crime:    { icon: "🚨", color: "#FF9F43", label: "Police / Security" },
  flood:    { icon: "🌊", color: "#7B9EFF", label: "DRRM" },
  other:    { icon: "⚠️", color: "#8fa3be", label: "Central Dispatch" },
};

// Get all department codes for filtering
export const DEPARTMENT_CODES = ["fire", "medical", "crime", "flood", "other"] as const;

// Check if a responder belongs to a department
export function responderMatchesDepartment(responderDepartment: string | null, reportDepartment: string): boolean {
  if (!responderDepartment) return true; // Unassigned responders see all
  return responderDepartment === reportDepartment || responderDepartment === "all";
}

// Real-time notification channel name for a department
export function getDepartmentChannel(departmentCode: string): string {
  return `department-${departmentCode}`;
}
