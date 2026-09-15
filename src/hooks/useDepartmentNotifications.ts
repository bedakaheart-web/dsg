// src/hooks/useDepartmentNotifications.ts
// Real-time notifications for department-specific incident reports.
// Uses Supabase Realtime channels to notify responders when a new
// report is submitted to their department.

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "../js/supabase";
import { getDepartmentChannel, getNotificationChannelForType } from "../js/departments";

interface DepartmentNotification {
  reportId: string;
  department: string;
  type: string;
  status: string;
  createdAt: string;
}

export function useDepartmentNotifications(
  userDepartment: string | null,
  userId: string | null,
) {
  const [notifications, setNotifications] = useState<DepartmentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Listen for real-time notifications on the user's department channel
  useEffect(() => {
    if (!userDepartment || !userId) return;

    const channel = supabase.channel(`department-${userDepartment}`);
    channelRef.current = channel;

    channel.on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "reports",
    }, (payload) => {
      const report = payload.new as {
        id: string;
        department: string | null;
        type: string;
        status: string;
        created_at: string;
      };

      if (report.department === userDepartment || !report.department) {
        const notification: DepartmentNotification = {
          reportId: report.id,
          department: report.department ?? "other",
          type: report.type,
          status: report.status,
          createdAt: report.created_at,
        };
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [userDepartment, userId]);

  // Also subscribe to a general "new-reports" channel for fallback
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel("new-reports-global");

    channel.on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "reports",
    }, (payload) => {
      const report = payload.new as { department: string | null };
      // Notify all responders if the report has no department assigned
      if (!report.department) {
        setNotifications(prev => [{
          reportId: payload.new.id,
          department: "other",
          type: (payload.new as { type: string }).type,
          status: (payload.new as { status: string }).status,
          createdAt: payload.new.created_at,
        }, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, markAsRead, clearNotifications };
}

// Hook for a specific department channel (used by responder dashboards)
export function useDepartmentChannel(departmentCode: string | null) {
  const [newReportCount, setNewReportCount] = useState(0);

  useEffect(() => {
    if (!departmentCode) return;

    const channel = supabase.channel(getDepartmentChannel(departmentCode));

    channel.on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "reports",
    }, () => {
      setNewReportCount(prev => prev + 1);
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [departmentCode]);

  return { newReportCount };
}
