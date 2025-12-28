import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTenant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTenants() {
  return useQuery({
    queryKey: [api.tenants.list.path],
    queryFn: async () => {
      const res = await fetch(api.tenants.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tenants");
      return api.tenants.list.responses[200].parse(await res.json());
    },
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: [api.tenants.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.tenants.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch tenant details");
      return api.tenants.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTenant) => {
      const res = await fetch(api.tenants.create.path, {
        method: api.tenants.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.tenants.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create tenant");
      }
      return api.tenants.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.tenants.list.path] });
      toast({
        title: "Tenant created",
        description: `Successfully initialized ${data.name} (${data.slug})`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}
