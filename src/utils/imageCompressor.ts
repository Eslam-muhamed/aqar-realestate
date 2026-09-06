/**
 * Client-Side Image Compression Utility
 * Resizes large photos and converts them to optimized WebP format
 * Saves 70-90% of Supabase Storage space and network bandwidth.
 */

export interface CompressionResult {
    file: File;
    originalSize: number;
    compressedSize: number;
    savedPercentage: number;
    isCompressed: boolean;
}

export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
}

export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<CompressionResult> {
    const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.82,
        mimeType = "image/webp",
    } = options;

    // If file is not an image (e.g. video), return original directly
    if (!file.type.startsWith("image/")) {
        return {
            file,
            originalSize: file.size,
            compressedSize: file.size,
            savedPercentage: 0,
            isCompressed: false,
        };
    }

    // Skip compression for GIFs (to avoid losing animation) or SVGs
    if (file.type === "image/gif" || file.type === "image/svg+xml") {
        return {
            file,
            originalSize: file.size,
            compressedSize: file.size,
            savedPercentage: 0,
            isCompressed: false,
        };
    }

    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let { width, height } = img;

            // Calculate proportional dimensions
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                // Fallback to original if canvas context unavailable
                resolve({
                    file,
                    originalSize: file.size,
                    compressedSize: file.size,
                    savedPercentage: 0,
                    isCompressed: false,
                });
                return;
            }

            // Draw image with high quality smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob || blob.size >= file.size) {
                        // If compression didn't save space, keep original
                        resolve({
                            file,
                            originalSize: file.size,
                            compressedSize: file.size,
                            savedPercentage: 0,
                            isCompressed: false,
                        });
                        return;
                    }

                    // Create new optimized file
                    const baseName = file.name.replace(/\.[^/.]+$/, "");
                    const ext = mimeType === "image/webp" ? ".webp" : ".jpg";
                    const newFileName = `${baseName}_opt${ext}`;

                    const compressedFile = new File([blob], newFileName, {
                        type: mimeType,
                        lastModified: Date.now(),
                    });

                    const savedPercentage = Math.round(
                        ((file.size - blob.size) / file.size) * 100
                    );

                    resolve({
                        file: compressedFile,
                        originalSize: file.size,
                        compressedSize: blob.size,
                        savedPercentage,
                        isCompressed: true,
                    });
                },
                mimeType,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                savedPercentage: 0,
                isCompressed: false,
            });
        };

        img.src = objectUrl;
    });
}

/**
 * Format bytes to human readable format (e.g. 1.2 MB)
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
