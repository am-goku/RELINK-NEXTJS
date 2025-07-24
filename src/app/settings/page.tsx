'use client';

import React, { useState } from 'react';
import {
  Bell,
  User,
  Eye,
  Shield,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function SettingsSection({
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

export default function SettingsPage() {
  return (
    <React.Fragment>
      <div className="max-w-2xl mx-auto py-10 px-4 md:px-0 text-[#2D3436]">
        {/* <h1 className="text-2xl font-bold mb-6">Settings</h1> */}

        {/* Account Section */}
        <SettingsSection title="Account" icon={User}>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value="John Doe"
                className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value="john@example.com"
                className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Notification Section */}
        <SettingsSection title="Notifications" icon={Bell}>
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Push Notifications</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span>Vibrate on Notification</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
        </SettingsSection>

        {/* Accessibility Section */}
        <SettingsSection title="Accessibility" icon={Eye}>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
          <div>
            <label className="text-sm font-medium">Font Size</label>
            <select className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300">
              <option>Small</option>
              <option selected>Medium</option>
              <option>Large</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span>High Contrast</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
        </SettingsSection>

        {/* Privacy & Security Section */}
        <SettingsSection title="Privacy & Security" icon={Shield}>
          <div className="flex items-center justify-between">
            <span>Private Account</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span>Two-Factor Authentication</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span>Allow Search by Email</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
        </SettingsSection>

        {/* App Preferences Section */}
        <SettingsSection title="App Preferences" icon={SlidersHorizontal}>
          <div className="flex items-center justify-between">
            <span>Auto-play Videos</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span>Language</span>
            <select className="ml-auto border border-gray-300 px-3 py-1 rounded-md">
              <option selected>English</option>
              <option>Spanish</option>
              <option>Hindi</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span>Data Saver Mode</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
        </SettingsSection>
      </div>
    </React.Fragment>
  );
}
