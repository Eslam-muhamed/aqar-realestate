/**
 * Cache & Session Management Utility
 * Handles application versioning, stale cache invalidation, and localStorage monitoring.
 */

export const APP_VERSION = "2.1.0";
const VERSION_KEY = "aqar_app_version";
const LAST_ACTIVE_KEY = "aqar_last_active_timestamp";

export interface StorageUsageReport {
    totalBytes: number;
    formattedSize: string;
    itemCount: number;
    breakdown: { key: string; size: number; formattedSize: string }[];
}

export const cacheManager = {
    /**
     * Get current application version
     */
    getVersion(): string {
        return APP_VERSION;
    },

    /**
     * Calculate total localStorage consumption by this application
     */
    getStorageUsage(): StorageUsageReport {
        let totalBytes = 0;
        const breakdown: { key: string; size: number; formattedSize: string }[] = [];

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const value = localStorage.getItem(key) || "";
                    // UTF-16 characters use 2 bytes each
                    const itemSize = (key.length + value.length) * 2;
                    totalBytes += itemSize;
                    breakdown.push({
                        key,
                        size: itemSize,
                        formattedSize: this.formatBytes(itemSize),
                    });
                }
            }
        } catch (e) {
            console.warn("Could not calculate storage usage:", e);
        }

        return {
            totalBytes,
            formattedSize: this.formatBytes(totalBytes),
            itemCount: localStorage.length,
            breakdown: breakdown.sort((a, b) => b.size - a.size),
        };
    },

    /**
     * Inspect version on startup: If app was updated, purge obsolete caches
     * while preserving user session
     */
    checkVersionAndClearStaleCache(): { wasUpdated: boolean; oldVersion: string | null } {
        try {
            const storedVersion = localStorage.getItem(VERSION_KEY);
            
            // Record last activity timestamp
            localStorage.setItem(LAST_ACTIVE_KEY, new Date().toISOString());

            if (!storedVersion || storedVersion !== APP_VERSION) {
                console.log(`[CacheManager] App updated from ${storedVersion || "initial"} to ${APP_VERSION}. Purging stale cache...`);
                
                // Keep auth intact
                const savedUser = localStorage.getItem("aqar_user");
                const savedFavs = localStorage.getItem("aqar_favorites");

                // Purge temporary / obsolete keys
                const preserveKeys = new Set(["aqar_user", "aqar_favorites", "aqar_inquiries"]);
                const keysToRemove: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && !preserveKeys.has(key)) {
                        keysToRemove.push(key);
                    }
                }

                keysToRemove.forEach((k) => localStorage.removeItem(k));

                // Save new version
                localStorage.setItem(VERSION_KEY, APP_VERSION);

                return { wasUpdated: true, oldVersion: storedVersion };
            }

            return { wasUpdated: false, oldVersion: storedVersion };
        } catch (e) {
            console.error("Cache verification error:", e);
            return { wasUpdated: false, oldVersion: null };
        }
    },

    /**
     * One-click manual cache purge: Cleans all cached query results & states and re-syncs
     */
    purgeCacheAndReload(preserveSession = true) {
        try {
            const savedUser = preserveSession ? localStorage.getItem("aqar_user") : null;
            
            // Clear all local storage
            localStorage.clear();
            sessionStorage.clear();

            // Re-store session if requested
            if (savedUser) {
                localStorage.setItem("aqar_user", savedUser);
            }
            localStorage.setItem(VERSION_KEY, APP_VERSION);
            localStorage.setItem(LAST_ACTIVE_KEY, new Date().toISOString());

            // Reload page to re-fetch clean state
            window.location.reload();
        } catch (e) {
            console.error("Failed to purge cache:", e);
        }
    },

    /**
     * Format bytes into readable format
     */
    formatBytes(bytes: number): string {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
};
