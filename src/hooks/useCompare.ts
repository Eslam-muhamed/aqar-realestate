import { useState, useCallback } from "react";
import { compareStorage } from "@/lib/storage";

export function useCompare() {
    const [compareList, setCompareList] = useState<string[]>(() => compareStorage.get());

    const add = useCallback((id: string): boolean => {
        const success = compareStorage.add(id);
        if (success) setCompareList(compareStorage.get());
        return success;
    }, []);

    const remove = useCallback((id: string) => {
        compareStorage.remove(id);
        setCompareList(compareStorage.get());
    }, []);

    const clear = useCallback(() => {
        compareStorage.clear();
        setCompareList([]);
    }, []);

    const isInCompare = useCallback((id: string) => compareList.includes(id), [compareList]);

    return { compareList, add, remove, clear, isInCompare };
}
