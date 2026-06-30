import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logActivity } from "./activity";

export function useCrud<T extends { id: string }>(
  table: string,
  orderBy = "created_at",
  asc = false,
  resourceLabel?: string,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const resource = resourceLabel ?? table;

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(table as any)
      .select("*")
      .order(orderBy as any, { ascending: asc });
    if (error) toast.error(error.message);
    else setRows((data as unknown as T[]) ?? []);
    setLoading(false);
  }, [table, orderBy, asc]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const save = async (record: Partial<T> & { id?: string }) => {
    const { id, ...rest } = record as any;
    if (id) {
      const { error } = await supabase.from(table as any).update(rest).eq("id", id);
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Updated");
      logActivity("update", resource, id, { fields: Object.keys(rest) });
    } else {
      const { data, error } = await supabase.from(table as any).insert(rest).select("id").single();
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Created");
      logActivity("create", resource, (data as any)?.id, { fields: Object.keys(rest) });
    }
    await refetch();
    return true;
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    logActivity("delete", resource, id);
    await refetch();
  };

  return { rows, loading, refetch, save, remove };
}
