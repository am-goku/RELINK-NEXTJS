import { Loader2 } from "lucide-react";
import React from "react";
export default function LoadingContent({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) {
    return (
        <React.Fragment>
            {
                isLoading ? (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-[#6C5CE7]" />
                            <p className="text-[#6C5CE7] text-lg font-medium animate-pulse">
                                Loading...
                            </p>
                        </div>
                    </div>
                ) : children
            }
        </React.Fragment>
    );
}