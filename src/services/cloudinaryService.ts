import CryptoJS from "crypto-js";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "f7brqc2b";
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || "677431376722924";
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || "97MfJxH9yW1uAF3r3KvWEfl2cMM";

export interface CloudinaryUploadResult {
    success: boolean;
    url: string;
    public_id: string;
    error?: string;
}

export const cloudinaryService = {
    /**
     * Extracts the public_id from a Cloudinary URL
     * Example: https://res.cloudinary.com/f7brqc2b/image/upload/v1788628457/aqar_properties/photo123.jpg
     * Output: "aqar_properties/photo123"
     */
    extractPublicId(urlOrId: string): string | null {
        if (!urlOrId) return null;
        if (!urlOrId.startsWith("http://") && !urlOrId.startsWith("https://")) {
            // Already a public_id
            return urlOrId;
        }

        if (!urlOrId.includes("cloudinary.com")) {
            // External image (e.g. Unsplash), cannot be deleted from Cloudinary
            return null;
        }

        try {
            // Match path after /image/upload/(v[0-9]+/)? and before extension
            const match = urlOrId.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        } catch (e) {
            console.warn("Could not parse Cloudinary URL for public_id:", urlOrId, e);
        }

        return null;
    },

    /**
     * Upload an image file to Cloudinary with SHA-1 signature
     */
    async uploadImage(file: File, folder = "aqar_properties"): Promise<CloudinaryUploadResult> {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const stringToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
            const signature = CryptoJS.SHA1(stringToSign).toString();

            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", API_KEY);
            formData.append("timestamp", timestamp.toString());
            formData.append("folder", folder);
            formData.append("signature", signature);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error?.message || "Failed to upload image to Cloudinary");
            }

            return {
                success: true,
                url: data.secure_url,
                public_id: data.public_id,
            };
        } catch (error: any) {
            console.error("Cloudinary upload error:", error);
            return {
                success: false,
                url: "",
                public_id: "",
                error: error.message || "فشل رفع الصورة إلى Cloudinary",
            };
        }
    },

    /**
     * Permanently delete an image from Cloudinary using Destroy API
     */
    async deleteImage(publicIdOrUrl: string): Promise<{ success: boolean; error?: string }> {
        const publicId = this.extractPublicId(publicIdOrUrl);
        if (!publicId) {
            // Nothing to delete or external photo
            return { success: true };
        }

        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
            const signature = CryptoJS.SHA1(stringToSign).toString();

            const formData = new FormData();
            formData.append("public_id", publicId);
            formData.append("api_key", API_KEY);
            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || data.result !== "ok") {
                console.warn("Cloudinary destroy response:", data);
            }

            return { success: data.result === "ok" || data.result === "not found" };
        } catch (error: any) {
            console.error("Cloudinary delete error:", error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Smart replacement: Deletes the old image from Cloudinary and uploads the new one in its place.
     * Prevents duplicate files and eliminates orphan storage.
     */
    async replaceImage(oldUrl: string, newFile: File, folder = "aqar_properties"): Promise<CloudinaryUploadResult> {
        try {
            // 1. Delete old image first if it exists on Cloudinary
            if (oldUrl) {
                await this.deleteImage(oldUrl);
            }

            // 2. Upload the new image
            return await this.uploadImage(newFile, folder);
        } catch (error: any) {
            console.error("Cloudinary replace error:", error);
            return {
                success: false,
                url: "",
                public_id: "",
                error: error.message || "فشل استبدال الصورة في Cloudinary",
            };
        }
    },
};
