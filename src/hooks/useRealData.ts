import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/propertyService";
import { agentService } from "@/services/agentService";
import type { Property, Agent } from "@/types";

export const useProperties = () => {
    return useQuery<Property[]>({
        queryKey: ["properties"],
        queryFn: () => propertyService.getAll(),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};

export const useProperty = (slug: string) => {
    return useQuery<Property | null>({
        queryKey: ["property", slug],
        queryFn: () => propertyService.getBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    });
};

export const useSimilarProperties = (city: string, currentSlug: string) => {
    return useQuery<Property[]>({
        queryKey: ["properties", "similar", city],
        queryFn: () => propertyService.getSimilar(city, 4),
        enabled: !!city,
        select: (data) => data.filter((p) => p.slug !== currentSlug).slice(0, 3),
        staleTime: 1000 * 60 * 5,
    });
};

export const useAgents = () => {
    return useQuery<Agent[]>({
        queryKey: ["agents"],
        queryFn: () => agentService.getAll(),
        staleTime: 1000 * 60 * 5,
    });
};

export const useAgent = (id: string) => {
    return useQuery<Agent | null>({
        queryKey: ["agent", id],
        queryFn: () => agentService.getById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};
