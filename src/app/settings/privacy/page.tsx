'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function PrivacyPolicyPage() {
  return (
    <React.Fragment>
      <div className="max-w-3xl mx-auto px-4 md:px-0 py-10 text-[#2D3436] dark:text-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-[#6C5CE7] dark:text-blue-500" size={24} />
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
        </div>

        <p className="mb-8 text-sm text-[#636e72] dark:text-gray-300">
          This Privacy Policy describes how we collect, use, and protect your information when you use our social media platform. By using our services, you agree to the terms outlined here.
        </p>

        {/* Sections */}
        <AnimatedSection title="1. Information We Collect">
          <p>We collect the following types of information:</p>
          <ul className="list-disc ml-5">
            <li>Personal details such as name, email, date of birth.</li>
            <li>Profile information like bio, profile photo, cover photo, gender, and links.</li>
            <li>Usage data including interactions, messages, posts, and preferences.</li>
            <li>Device information including IP address, browser type, and OS.</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection title="2. How We Use Your Information">
          <ul className="list-disc ml-5">
            <li>To provide and improve our services.</li>
            <li>To personalize your feed and recommendations.</li>
            <li>To respond to your support requests.</li>
            <li>To send important updates or marketing (with your consent).</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection title="3. Sharing of Information">
          <p>We never sell your data. We may share data:</p>
          <ul className="list-disc ml-5">
            <li>With service providers helping us operate our platform.</li>
            <li>To comply with legal obligations or prevent fraud.</li>
            <li>With your consent for optional integrations (e.g. link previews).</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection title="4. Your Privacy Controls">
          <ul className="list-disc ml-5">
            <li>You can update your profile and privacy settings anytime.</li>
            <li>You can delete your account permanently from the account settings page.</li>
            <li>You can request access to or deletion of your personal data.</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection title="5. Data Security">
          <p>
            We implement robust security measures to protect your data. This includes encryption,
            access control, and regular security reviews. However, no method is 100% secure, so we
            encourage you to take necessary precautions as well.
          </p>
        </AnimatedSection>

        <AnimatedSection title="6. Cookies and Tracking">
          <p>
            We use cookies and similar technologies to enhance your experience, analyze traffic, and
            personalize content. You can manage cookie preferences through your browser settings.
          </p>
        </AnimatedSection>

        <AnimatedSection title="7. Changes to This Policy">
          <p>
            We may update this policy from time to time. If changes are significant, we will notify
            you through the app or by email. The date of the latest update will always be shown
            below.
          </p>
        </AnimatedSection>

        <AnimatedSection title="8. Contact Us">
          <p>
            If you have any questions or concerns about your privacy, please contact us at:
            <br />
            <a
              href="mailto:privacy@yourapp.com"
              className="text-[#6C5CE7] dark:text-blue-500 underline"
            >
              privacy@yourapp.com
            </a>
          </p>
        </AnimatedSection>

        <p className="text-xs text-[#b2bec3] dark:text-gray-400 text-center mt-10">
          Last updated: May 31, 2025
        </p>
      </div>
    </React.Fragment>
  );
}
