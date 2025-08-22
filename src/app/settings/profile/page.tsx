'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  Image as ImageIcon,
  Globe,
  ChevronDown,
  ChevronUp,
  Text,
  Pencil,
} from 'lucide-react';
import ProfilePicUpdater from '@/components/ProfilePicUpdater';
import CoverPicUpdater from '@/components/CoverPicUpdater';
import { getProfileData, updateUserProfile } from '@/services/api/user-apis';
import LoadingContent from '@/components/loaders/LoadingContent';
import { useUser } from '@/providers/UserProvider';

type ProfileFormData = {
  name: string;
  username: string;
  bio: string;
  gender: string;
  links: string[]; // [website, instagram, linkedin]
};

function ProfileSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 text-[#2D3436] font-semibold">
          <Icon className="text-[#6C5CE7]" size={20} />
          <h2>{title}</h2>
        </div>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {open && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
}

export default function EditProfilePage() {
  // State Management
  const {user, setUser} = useUser()

  // Util states
  const [error, setError] = useState<string>('');
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [originalData, setOriginalData] = useState<Partial<ProfileFormData>>({ ...user });
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    username: '',
    bio: '',
    gender: '',
    links: ['', '', ''],
  });
  const [profilePic, setProfilePic] = useState<string>('')
  const [coverPic, setCoverPic] = useState<string>('')

  // Fetching Current User Data 
  useEffect(() => {
    if (user) {
      getProfileData({ setCoverPic, setProfilePic, setFormData, setError, setOriginalData, setIsLoading: setPageLoading });
    }
  }, [user]);

  // Error Handling
  useEffect(() => {
    if (error) {
      alert(error);
      setError('');
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <LoadingContent isLoading={pageLoading}>
      <div className="max-w-2xl mx-auto py-10 px-4 md:px-0 text-[#2D3436]">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <ProfileSection title="Photos" icon={ImageIcon}>
          <div className="space-y-4">
            <ProfilePicUpdater image={profilePic} />
            <CoverPicUpdater cover={coverPic} />
          </div>
        </ProfileSection>

        <ProfileSection title="Basic Info" icon={User}>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </ProfileSection>

        <ProfileSection title="Bio" icon={Text}>
          <textarea
            rows={3}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us something about you..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
          />
        </ProfileSection>

        <ProfileSection title="Gender" icon={Pencil}>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select your gender
            </option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </ProfileSection>

        <LinksSection formData={formData} setFormData={setFormData} />

        <div className="flex justify-end">
          <button
            onClick={() => updateUserProfile({ formData, originalData, updateUser:setUser, setError, setIsLoading })}
            className="mt-4 px-6 py-2 rounded-md bg-[#6C5CE7] text-white hover:bg-[#5A4BD3]"
            disabled={isLoading}
          >
            {isLoading ? 'Saving changes...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </LoadingContent>
  );
}



const MAX_LINKS = 3;

type props = {
  formData: ProfileFormData;
  setFormData: (formData: ProfileFormData) => void
}

function LinksSection({ formData, setFormData }: props) {
  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...(formData.links || [])];
    updatedLinks[index] = value;
    setFormData({ ...formData, links: updatedLinks });
  };

  const handleAddLink = () => {
    if ((formData.links?.length || 0) < MAX_LINKS) {
      setFormData({
        ...formData,
        links: [...(formData.links || []), ""],
      });
    }
  };

  const handleRemoveLink = (index: number) => {
    if (index === 0) return; // Don't remove the first link
    const updatedLinks = [...formData?.links];
    updatedLinks.splice(index, 1);
    setFormData({ ...formData, links: updatedLinks });
  };

  return (
    <ProfileSection title="Links" icon={Globe}>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveLink(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {(formData.links?.length || 0) < MAX_LINKS && (
          <button
            type="button"
            onClick={handleAddLink}
            className="text-blue-600 text-sm mt-2"
          >
            + Add another link
          </button>
        )}
      </div>
    </ProfileSection>
  );
}