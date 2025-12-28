import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useHealth() {
  return useQuery({
    queryKey: [api.system.health.path],
    queryFn: async () => {
      const res = await fetch(api.system.health.path);
      if (!res.ok) throw new Error("System health check failed");
      return api.system.health.responses[200].parse(await res.json());
    },
    refetchInterval: 30000, // Check every 30s
  });
}
