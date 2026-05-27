import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Employee } from "@/types/api";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => apiFetch<Employee[]>("/employees"),
  });
}

export function useEmployeeLookup(personnelNumber: string) {
  return useQuery({
    queryKey: ["employee", personnelNumber],
    queryFn: () => apiFetch<Employee>(`/employees/${personnelNumber}`),
    enabled: personnelNumber.length >= 3,
    retry: false,
  });
}
