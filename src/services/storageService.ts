import { supabase } from "@/lib/supabase";

export interface StorageUploadResult {
    success: boolean;
    url: string;
    public_id: string; // Map Supabase path to public_id for compatibility
    error?: string;
}

export const storageService = {
    /**
     * Upload an image file to Supabase Storage
     * Assumes a bucket named "properties" exists and is public
     */
    async uploadImage(file: File, folder = "aqar_properties"): Promise<StorageUploadResult> {
        try {
            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error } = await supabase.storage
                .from('properties')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw error;
            }

            // Get public URL
            const { data } = supabase.storage
                .from('properties')
                .getPublicUrl(filePath);

            return {
                success: true,
                url: data.publicUrl,
                public_id: filePath,
            };
        } catch (error: unknown) {
            console.error("Supabase storage upload error:", error);
            return {
                success: false,
                url: "",
                public_id: "",
                error: error instanceof Error ? error.message : "فشل رفع الصورة إلى التخزين",
            };
        }
    },

    /**
     * Permanently delete an image from Supabase Storage
     */
    async deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
        if (!filePath) {
            return { success: true };
        }

        try {
            // Remove full URL if passed to get just the path
            let path = filePath;
            if (path.includes('supabase.co')) {
               const parts = path.split('/properties/');
               if (parts.length === 2) {
                   path = parts[1];
               }
            }

            const { error } = await supabase.storage
                .from('properties')
                .remove([path]);

            if (error) {
                console.warn("Supabase storage delete response:", error);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error: unknown) {
            console.error("Supabase delete error:", error);
            return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    },

    /**
     * Smart replacement: Deletes the old image and uploads the new one.
     */
    async replaceImage(oldPathOrUrl: string, newFile: File, folder = "aqar_properties"): Promise<StorageUploadResult> {
        try {
            if (oldPathOrUrl) {
                await this.deleteImage(oldPathOrUrl);
            }
            return await this.uploadImage(newFile, folder);
        } catch (error: unknown) {
            console.error("Supabase replace error:", error);
            return {
                success: false,
                url: "",
                public_id: "",
                error: error instanceof Error ? error.message : "فشل استبدال الصورة",
            };
        }
    },
};
