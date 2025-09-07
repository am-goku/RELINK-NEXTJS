import { Loader2 } from "lucide-react";

export default function PrimaryCreateButton({ loading, children, onClick }: { loading?: boolean; children: React.ReactNode; onClick?: () => void }) {
    return (
        <button onClick={onClick} disabled={loading} className={`rounded-2xl px-4 py-2 font-semibold ${loading ? "bg-gray-400 text-white" : "bg-[#2D3436] text-white hover:brightness-110"}`}>
            {loading ? <Loader2 className="inline-block h-4 w-4 animate-spin" /> : children}
        </button>
    );
}