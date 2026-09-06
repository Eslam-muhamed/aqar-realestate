import { useState, useRef } from "react";
import { Upload, X, RefreshCw, Loader2, Image as ImageIcon, Star, Zap } from "lucide-react";
import { storageService } from "@/services/storageService";
import { compressImage, formatFileSize } from "@/utils/imageCompressor";
import { toast } from "sonner";

interface PropertyImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export default function PropertyImageUploader({
    images,
    onChange,
    maxImages = 10,
}: PropertyImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [compressionStats, setCompressionStats] = useState<{
        savedBytes: number;
        originalBytes: number;
        savedPercentage: number;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceInputRef = useRef<HTMLInputElement>(null);
    const targetReplaceIndexRef = useRef<number | null>(null);

    // Handle new images upload with auto compression
    const handleFiles = async (files: FileList | File[]) => {
        const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
        if (fileArray.length === 0) {
            toast.error("يرجى اختيار ملفات صور أو فيديو صالحة (JPG, PNG, WebP, MP4)");
            return;
        }

        const MAX_SIZE_MB = 15;
        const validFiles = fileArray.filter(f => f.size <= MAX_SIZE_MB * 1024 * 1024);
        
        if (validFiles.length < fileArray.length) {
            toast.error(`تم استبعاد بعض الملفات لأن حجمها يتجاوز ${MAX_SIZE_MB} ميجابايت.`);
        }

        if (validFiles.length === 0) return;

        if (images.length + validFiles.length > maxImages) {
            toast.error(`الحد الأقصى لعدد الصور هو ${maxImages} صور.`);
            return;
        }

        setUploading(true);
        const newUploadedUrls: string[] = [];
        let failedCount = 0;
        let totalOriginal = 0;
        let totalCompressed = 0;

        for (let i = 0; i < validFiles.length; i++) {
            const rawFile = validFiles[i];
            
            // Step 1: Compress image on the fly to WebP
            let fileToUpload = rawFile;
            if (rawFile.type.startsWith("image/")) {
                const compToast = toast.loading(`جارٍ ضغط وتحسين الصورة (${i + 1}/${validFiles.length})...`);
                const compResult = await compressImage(rawFile, { maxWidth: 1920, maxHeight: 1080, quality: 0.82 });
                toast.dismiss(compToast);

                fileToUpload = compResult.file;
                totalOriginal += compResult.originalSize;
                totalCompressed += compResult.compressedSize;
            } else {
                totalOriginal += rawFile.size;
                totalCompressed += rawFile.size;
            }

            // Step 2: Upload optimized file to Supabase
            const uploadToast = toast.loading(`جارٍ رفع الملف (${i + 1}/${validFiles.length}) إلى السيرفر...`);
            const res = await storageService.uploadImage(fileToUpload);
            toast.dismiss(uploadToast);

            if (res.success && res.url) {
                newUploadedUrls.push(res.url);
            } else {
                failedCount++;
            }
        }

        setUploading(false);

        if (newUploadedUrls.length > 0) {
            onChange([...images, ...newUploadedUrls]);
            
            // Calculate savings
            const savedBytes = Math.max(0, totalOriginal - totalCompressed);
            const savedPercentage = totalOriginal > 0 ? Math.round((savedBytes / totalOriginal) * 100) : 0;

            if (savedPercentage > 10) {
                setCompressionStats({ savedBytes, originalBytes: totalOriginal, savedPercentage });
                toast.success(
                    `تم رفع ${newUploadedUrls.length} صور بنجاح! تم توفير ${savedPercentage}% من المساحة (${formatFileSize(savedBytes)} توفير)`,
                    { duration: 5000 }
                );
            } else {
                toast.success(`تم رفع ${newUploadedUrls.length} ملف بنجاح إلى Supabase!`);
            }
        }

        if (failedCount > 0) {
            toast.error(`فشل رفع ${failedCount} ملف. يرجى المحاولة مرة أخرى.`);
        }
    };

    // Trigger file input for replacement
    const initiateReplace = (index: number) => {
        targetReplaceIndexRef.current = index;
        if (replaceInputRef.current) {
            replaceInputRef.current.value = "";
            replaceInputRef.current.click();
        }
    };

    // Execute Smart Replacement with Compression
    const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const index = targetReplaceIndexRef.current;
        if (!file || index === null || index === undefined) return;

        const MAX_SIZE_MB = 15;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(`حجم الملف يتجاوز الحد الأقصى (${MAX_SIZE_MB} ميجابايت).`);
            return;
        }

        const oldUrl = images[index];
        setReplacingIndex(index);

        // Compress if image
        let fileToUpload = file;
        if (file.type.startsWith("image/")) {
            const compToast = toast.loading("جارٍ ضغط وتحسين الصورة الجديدة...");
            const compResult = await compressImage(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.82 });
            toast.dismiss(compToast);
            fileToUpload = compResult.file;
        }

        const toastId = toast.loading("جارٍ استبدال الملف في Supabase...");
        const res = await storageService.replaceImage(oldUrl, fileToUpload);
        toast.dismiss(toastId);

        setReplacingIndex(null);
        targetReplaceIndexRef.current = null;

        if (res.success && res.url) {
            const updated = [...images];
            updated[index] = res.url;
            onChange(updated);
            toast.success("تم استبدال الصورة بنجاح وحفظ الحجم المحسن!");
        } else {
            toast.error("فشل استبدال الصورة: " + (res.error || "خطأ غير معروف"));
        }
    };

    // Delete single image from Supabase & state
    const handleDelete = async (index: number) => {
        const urlToDelete = images[index];
        const toastId = toast.loading("جارٍ حذف الصورة من Supabase...");

        await storageService.deleteImage(urlToDelete);
        toast.dismiss(toastId);

        const updated = images.filter((_, i) => i !== index);
        onChange(updated);
        toast.success("تم حذف الصورة من Supabase");
    };

    // Make image cover (index 0)
    const handleSetCover = (index: number) => {
        if (index === 0) return;
        const target = images[index];
        const rest = images.filter((_, i) => i !== index);
        onChange([target, ...rest]);
        toast.success("تم تعيين الصورة كصورة رئيسية للعقار");
    };

    return (
        <div className="space-y-4 text-start">
            {/* Hidden replace input */}
            <input
                ref={replaceInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleReplaceFileChange}
            />

            {/* Hidden upload input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            {/* Auto-Compression & Storage Optimization Notice */}
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-aqar-cyan/5 border border-aqar-cyan/20 text-xs text-aqar-muted">
                <div className="flex items-center gap-2">
                    <Zap size={14} className="text-aqar-cyan shrink-0" />
                    <span>
                        <strong className="text-aqar-cyan font-medium">الضغط الذكي الفوري نشط:</strong> يتم ضغط الصور تلقائياً بصيغة WebP لتوفير 70-90% من استهلاك التخزين وتسريع تحميل الموقع.
                    </span>
                </div>
                {compressionStats && (
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[11px]">
                        وفرت {formatFileSize(compressionStats.savedBytes)} ({compressionStats.savedPercentage}%)
                    </span>
                )}
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
                }}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                        ? "border-aqar-cyan bg-aqar-cyan/10 scale-[0.99]"
                        : "border-aqar-border hover:border-aqar-cyan/50 bg-[#161616]/60 hover:bg-[#1C1C1E]"
                }`}
            >
                {uploading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 size={36} className="text-aqar-cyan animate-spin mb-3" />
                        <p className="text-aqar-text text-sm font-bold">جارٍ رفع الصور إلى Supabase Storage...</p>
                        <p className="text-aqar-muted text-xs mt-1">يتم معالجة وتأمين الصور سحابياً</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-14 h-14 rounded-2xl bg-aqar-cyan/10 border border-aqar-cyan/30 flex items-center justify-center text-aqar-cyan mb-3">
                            <Upload size={24} />
                        </div>
                        <p className="text-aqar-text text-sm font-bold">اسحب وأفلت صور أو فيديوهات العقار هنا، أو اضغط للاختيار</p>
                        <p className="text-aqar-muted text-xs mt-1.5">
                            يتم رفعها مباشرة إلى Supabase Storage (JPG, PNG, WebP, MP4) — متاح حتى {maxImages} ملفات
                        </p>
                    </div>
                )}
            </div>

            {/* Uploaded Images Grid */}
            {images.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-aqar-muted">
                        <span>الصور المرفوعة ({images.length} من {maxImages})</span>
                        <span>الصورة الأولى هي الصورة الرئيسية للغلاف</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((url, index) => {
                            const isReplacing = replacingIndex === index;

                            return (
                                <div
                                    key={`${url}-${index}`}
                                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-aqar-border bg-aqar-base"
                                >
                                    {url.match(/\.(mp4|webm|mov|ogg)$/i) ? (
                                        <video
                                            src={url}
                                            className="w-full h-full object-cover"
                                            controls={false}
                                            autoPlay
                                            muted
                                            loop
                                        />
                                    ) : (
                                        <img
                                            src={url}
                                            alt={`عقار ${index + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    )}

                                    {/* Primary Badge */}
                                    {index === 0 && (
                                        <div className="absolute top-2 right-2 bg-aqar-cyan text-aqar-btnText px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md">
                                            <Star size={10} fill="currentColor" /> الرئيسية
                                        </div>
                                    )}

                                    {/* Replacing Loader Overlay */}
                                    {isReplacing && (
                                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-2 text-center">
                                            <Loader2 size={24} className="text-aqar-cyan animate-spin mb-1" />
                                            <span className="text-[10px] text-aqar-text">جارٍ استبدال الصورة...</span>
                                        </div>
                                    )}

                                    {/* Action buttons overlay */}
                                    {!isReplacing && (
                                        /* Actions overlay - always visible on mobile, hover only on desktop */
                                        <div className="absolute inset-0 bg-black/40 lg:bg-black/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                            {/* Top actions */}
                                            <div className="flex items-center justify-between">
                                                {index !== 0 ? (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSetCover(index);
                                                        }}
                                                        title="تعيين كصورة رئيسية"
                                                        className="p-1.5 bg-aqar-hover/90 hover:bg-aqar-cyan text-aqar-text hover:text-aqar-btnText rounded-lg text-xs transition-colors"
                                                    >
                                                        <Star size={12} />
                                                    </button>
                                                ) : <div />}

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(index);
                                                    }}
                                                    title="حذف نهائي من Supabase"
                                                    className="p-1.5 bg-aqar-danger/80 hover:bg-aqar-danger text-white rounded-lg transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>

                                            {/* Bottom Replace button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    initiateReplace(index);
                                                }}
                                                className="w-full py-1.5 px-2 bg-aqar-cyan hover:bg-aqar-cyan/90 text-aqar-btnText font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                                            >
                                                <RefreshCw size={12} /> استبدال الصورة
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
