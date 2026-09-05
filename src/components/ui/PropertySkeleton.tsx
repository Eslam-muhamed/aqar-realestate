export default function PropertySkeleton() {
    return (
        <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl overflow-hidden">
            <div className="skeleton aspect-[4/3] w-full" />
            <div className="p-5 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-5 w-1/3 rounded" />
                <div className="flex gap-4 pt-3 border-t border-[#2C2C2E]">
                    <div className="skeleton h-3 w-12 rounded" />
                    <div className="skeleton h-3 w-12 rounded" />
                    <div className="skeleton h-3 w-16 rounded" />
                </div>
            </div>
        </div>
    );
}
