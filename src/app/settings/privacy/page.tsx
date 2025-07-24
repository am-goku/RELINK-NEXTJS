'use client';

import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-lg font-semibold text-[#2D3436]">{title}</h2>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {open && <div className="mt-3 text-sm text-[#636e72] space-y-3">{children}</div>}
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0 py-10 text-[#2D3436]">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="text-[#6C5CE7]" size={24} />
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
      </div>

      <p className="mb-8 text-[#636e72] text-sm">
        This Privacy Policy describes how we collect, use, and protect your information when you use our social media platform. By using our services, you agree to the terms outlined here.
      </p>

      {/* Sections */}
      <PolicySection title="1. Information We Collect">
        <p>We collect the following types of information:</p>
        <ul className="list-disc ml-5">
          <li>Personal details such as name, email, date of birth.</li>
          <li>Profile information like bio, profile photo, cover photo, gender, and links.</li>
          <li>Usage data including interactions, messages, posts, and preferences.</li>
          <li>Device information including IP address, browser type, and OS.</li>
        </ul>
      </PolicySection>

      <PolicySection title="2. How We Use Your Information">
        <ul className="list-disc ml-5">
          <li>To provide and improve our services.</li>
          <li>To personalize your feed and recommendations.</li>
          <li>To respond to your support requests.</li>
          <li>To send important updates or marketing (with your consent).</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Sharing of Information">
        <p>We never sell your data. We may share data:</p>
        <ul className="list-disc ml-5">
          <li>With service providers helping us operate our platform.</li>
          <li>To comply with legal obligations or prevent fraud.</li>
          <li>With your consent for optional integrations (e.g. link previews).</li>
        </ul>
      </PolicySection>

      <PolicySection title="4. Your Privacy Controls">
        <ul className="list-disc ml-5">
          <li>You can update your profile and privacy settings anytime.</li>
          <li>You can delete your account permanently from the account settings page.</li>
          <li>You can request access to or deletion of your personal data.</li>
        </ul>
      </PolicySection>

      <PolicySection title="5. Data Security">
        <p>
          We implement robust security measures to protect your data. This includes encryption,
          access control, and regular security reviews. However, no method is 100% secure, so we
          encourage you to take necessary precautions as well.
        </p>
      </PolicySection>

      <PolicySection title="6. Cookies and Tracking">
        <p>
          We use cookies and similar technologies to enhance your experience, analyze traffic, and
          personalize content. You can manage cookie preferences through your browser settings.
        </p>
      </PolicySection>

      <PolicySection title="7. Changes to This Policy">
        <p>
          We may update this policy from time to time. If changes are significant, we will notify
          you through the app or by email. The date of the latest update will always be shown
          below.
        </p>
      </PolicySection>

      <PolicySection title="8. Contact Us">
        <p>
          If you have any questions or concerns about your privacy, please contact us at:
          <br />
          <a
            href="mailto:privacy@yourapp.com"
            className="text-[#6C5CE7] underline"
          >
            privacy@yourapp.com
          </a>
        </p>
      </PolicySection>

      <p className="text-xs text-[#b2bec3] text-center mt-10">
        Last updated: May 31, 2025
      </p>
    </div>
  );
}
