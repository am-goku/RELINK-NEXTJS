import { isValidURL } from "@/utils/url/url";
import React from "react";
import AnimatedSection from "../ui/AnimatedSection";
import { Globe } from "lucide-react";
import { updateUserLinks } from "@/services/api/user-apis";
import { SanitizedUser } from "@/utils/sanitizer/user";

type ProfileFormData = {
    name: string;
    username: string;
    bio: string;
    gender: string;
    links: string[]; // [website, instagram, linkedin]
};

const MAX_LINKS = 3;

type props = {
    formData: ProfileFormData;
    setFormData: (formData: ProfileFormData) => void
    updateUser: (user: SanitizedUser) => void
}

export function LinksSection({ formData, setFormData, updateUser }: props) {

    const [notValid, setNotValid] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLinkChange = (index: number, value: string) => {
        const updatedLinks = [...(formData.links || [])];
        updatedLinks[index] = value;
        setFormData({ ...formData, links: updatedLinks });
    };

    const handleAddLink = () => {
        if (isValidURL(formData.links[formData.links.length - 1])) {
            setNotValid(false);

            if ((formData.links?.length || 0) < MAX_LINKS) {
                setFormData({
                    ...formData,
                    links: [...(formData.links || []), ""],
                });
            }
        } else {
            setNotValid(true);
        }
    };

    const handleRemoveLink = (index: number) => {
        if (index === 0) return; // Don't remove the first link
        const updatedLinks = [...formData?.links];
        updatedLinks.splice(index, 1);
        setFormData({ ...formData, links: updatedLinks });
    };

    const handleUpdate = async () => {
        if (formData.links.length > 0) {
            setIsLoading(true);
            updateUserLinks({ links: formData.links, updateUser }).finally(() => setIsLoading(false));
        }
    }

    return (
        <AnimatedSection title="Links" icon={Globe}>
            <div className="space-y-3">
                {(formData.links || [""]).map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <div className="flex-1">
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => handleLinkChange(index, e.target.value)}
                                placeholder={
                                    index === 0
                                        ? "https://example.com"
                                        : index === 1
                                            ? "https://instagram.com/yourhandle"
                                            : "https://linkedin.com/in/yourhandle"
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-200"
                            />
                        </div>
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveLink(index)}
                                className="text-red-500 text-sm hover:underline dark:text-red-400"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}

                <div className='flex flex-col items-start ml-2'>

                    {notValid && <span className='text-xs text-red-500'>Invalid link provided</span>}

                    {(formData.links?.length || 0) < MAX_LINKS && (
                        <button
                            type="button"
                            onClick={handleAddLink}
                            className="text-blue-600 text-sm mt-2 hover:underline dark:text-blue-400"
                        >
                            Add another link
                        </button>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleUpdate}
                        className={`mt-4 px-6 py-2 rounded-md bg-[#6C5CE7] text-white hover:bg-[#5A4BD3] dark:bg-[#5A4BD3] dark:hover:bg-[#483ab8] disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving changes...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </AnimatedSection>
    );
}