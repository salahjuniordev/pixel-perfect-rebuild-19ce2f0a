import { supabase } from "@/integrations/supabase/client";

export type ActivityAction = "create" | "update" | "delete";

export async function logActivity(
  action: ActivityAction,
  resourceType: string,
  resourceId?: string | null,
  details?: Record<string, unknown>,
) {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("activity_log").insert({
      user_id: data.user.id,
      user_email: data.user.email ?? null,
      action,
      resource_type: resourceType,
      resource_id: resourceId ?? null,
      details: (details ?? null) as any,
    });
  } catch {
    /* best-effort */
  }
}
