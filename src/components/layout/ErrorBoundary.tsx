import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-aqar-base flex items-center justify-center p-6 text-start">
                    <div className="max-w-md w-full bg-aqar-surface border border-aqar-border rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-[#FF453A]/10 border border-[#FF453A]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={24} className="text-[#FF453A]" />
                        </div>
                        <h2 className="text-aqar-text font-bold text-xl mb-3">عذراً، حدث خطأ غير متوقع</h2>
                        <p className="text-aqar-muted text-sm mb-8 leading-relaxed">
                            لقد واجهنا مشكلة تقنية أثناء تحميل هذه الصفحة. يرجى محاولة تحديث الصفحة.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-aqar-cyan text-black font-semibold rounded-xl hover:bg-aqar-cyan/90 transition-colors"
                        >
                            <RefreshCcw size={16} />
                            تحديث الصفحة
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
