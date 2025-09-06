function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-sm font-medium text-[#2D3436] dark:text-gray-200"
        >
            {children}
        </label>
    );
}

export default FieldLabel;