import { useState, useRef } from "react";
import { Upload, X, RefreshCw, Loader2, Image as ImageIcon, Star } from "lucide-react";
import { cloudinaryService } from "@/services/cloudinaryService";
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceInputRef = useRef<HTMLInputElement>(null);
    const targetReplaceIndexRef = useRef<number | null>(null);

    // Handle new images upload
    const handleFiles = async (files: FileList | File[]) => {
        const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
        if (fileArray.length === 0) {
            toast.error("يرجى اختيار ملفات صور صالحة (JPG, PNG, WebP)");
            return;
        }

        if (images.length + fileArray.length > maxImages) {
            toast.error(`الحد الأقصى لعدد الصور هو ${maxImages} صور.`);
            return;
        }

        setUploading(true);
        const newUploadedUrls: string[] = [];
        let failedCount = 0;

        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            const toastId = toast.loading(`جارٍ رفع الصورة (${i + 1}/${fileArray.length}) إلى Cloudinary...`);
            const res = await cloudinaryService.uploadImage(file);
            toast.dismiss(toastId);

            if (res.success && res.url) {
                newUploadedUrls.push(res.url);
            } else {
                failedCount++;
            }
        }

        setUploading(false);

        if (newUploadedUrls.length > 0) {
            onChange([...images, ...newUploadedUrls]);
            toast.success(`تم رفع ${newUploadedUrls.length} صورة بنجاح إلى Cloudinary!`);
        }

        if (failedCount > 0) {
            toast.error(`فشل رفع ${failedCount} صورة. يرجى المحاولة مرة أخرى.`);
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

    // Execute Smart Replacement: delete old from Cloudinary and store new
    const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const index = targetReplaceIndexRef.current;
        if (!file || index === null || index === undefined) return;

        const oldUrl = images[index];
        setReplacingIndex(index);

        const toastId = toast.loading("جارٍ حذف الصورة القديمة من Cloudinary ورفع الصورة الجديدة...");
        const res = await cloudinaryService.replaceImage(oldUrl, file);
        toast.dismiss(toastId);

        setReplacingIndex(null);
        targetReplaceIndexRef.current = null;

        if (res.success && res.url) {
            const updated = [...images];
            updated[index] = res.url;
            onChange(updated);
            toast.success("تم استبدال الصورة بنجاح وحذف القديمة من Cloudinary!");
        } else {
            toast.error("فشل استبدال الصورة: " + (res.error || "خطأ غير معروف"));
        }
    };

    // Delete single image from Cloudinary & state
    const handleDelete = async (index: number) => {
        const urlToDelete = images[index];
        const toastId = toast.loading("جارٍ حذف الصورة من Cloudinary...");

        await cloudinaryService.deleteImage(urlToDelete);
        toast.dismiss(toastId);

        const updated = images.filter((_, i) => i !== index);
        onChange(updated);
        toast.success("تم حذف الصورة من Cloudinary");
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
        <div className="space-y-4 text-right" dir="rtl">
            {/* Hidden replace input */}
            <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleReplaceFileChange}
            />

            {/* Hidden upload input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

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
                        <p className="text-aqar-text text-sm font-bold">جارٍ رفع الصور إلى Cloudinary...</p>
                        <p className="text-aqar-muted text-xs mt-1">يتم معالجة وتأمين الصور سحابياً</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-14 h-14 rounded-2xl bg-aqar-cyan/10 border border-aqar-cyan/30 flex items-center justify-center text-aqar-cyan mb-3">
                            <Upload size={24} />
                        </div>
                        <p className="text-aqar-text text-sm font-bold">اسحب وأفلت صور العقار هنا، أو اضغط للاختيار</p>
                        <p className="text-aqar-muted text-xs mt-1.5">
                            يتم رفعها مباشرة إلى Cloudinary (JPG, PNG, WebP) — متاح حتى {maxImages} صور
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
                                    <img
                                        src={url}
                                        alt={`عقار ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Primary Badge */}
                                    {index === 0 && (
                                        <div className="absolute top-2 right-2 bg-aqar-cyan text-[#121212] px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md">
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
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
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
                                                        className="p-1.5 bg-[#2C2C2E]/90 hover:bg-aqar-cyan text-aqar-text hover:text-[#121212] rounded-lg text-xs transition-colors"
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
                                                    title="حذف نهائي من Cloudinary"
                                                    className="p-1.5 bg-[#FF453A]/80 hover:bg-[#FF453A] text-aqar-text rounded-lg transition-colors"
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
                                                className="w-full py-1.5 px-2 bg-aqar-cyan hover:bg-aqar-cyan/90 text-[#121212] font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
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
