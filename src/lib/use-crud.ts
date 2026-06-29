import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useCrud<T extends { id: string }>(table: string, orderBy = "created_at", asc = false) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { refetch(); }, [refetch]);

  const save = async (record: Partial<T> & { id?: string }) => {
    const { id, ...rest } = record as any;
    const op = id
      ? supabase.from(table as any).update(rest).eq("id", id)
      : supabase.from(table as any).insert(rest);
    const { error } = await op;
    if (error) { toast.error(error.message); return false; }
    toast.success(id ? "Updated" : "Created");
    await refetch();
    return true;
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    await refetch();
  };

  return { rows, loading, refetch, save, remove };
}
