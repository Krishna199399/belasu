import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Eye,
  Share2,
  Cookie,
  ExternalLink,
  Lock,
  Users,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Belesu',
  description:
    'Read Belesu’s privacy policy to understand how personal information is collected, used and protected when you use our website and services.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="bg-stone-50 min-h-screen text-slate-900">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-stone-200 py-3">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-amber-600 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-400">Legal</span>
            <span>/</span>
            <span className="text-slate-900 font-bold" aria-current="page">Privacy Policy</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-stone-200 py-12 md:py-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data Protection & Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            How Belesu collects, protects, uses, and safeguards your personal data.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
        
        {/* Commitment Statement */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            Our Commitment to Your Privacy
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            At Belesu.in, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By accessing our website or using our services, you consent to the collection, use, and disclosure of your information in accordance with this Privacy Policy.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-400/80 transition-all space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Section 1
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                1. Information We Collect
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <strong className="block text-slate-900 font-bold">Personal Information:</strong>
              <p>
                When you place an order, we may collect personal information such as your name, email address, shipping address, phone number, and payment details.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <strong className="block text-slate-900 font-bold">Automatically Collected Information:</strong>
              <p>
                We may also collect certain information automatically when you visit our website, including your IP address, browser type, operating system, referring URLs, and other usage details.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Use of Information */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-400/80 transition-all space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
              <Eye className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                Section 2
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                2. Use of Information
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            We may use the information we collect for various purposes, including but not limited to:
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-0 sm:pl-12">
            {[
              'Processing and fulfilling your orders',
              'Communicating with you about your orders and account',
              'Providing customer support',
              'Sending you promotional offers, newsletters, and marketing communications',
              'Improving our website, products, and services',
              'Preventing fraudulent activities and enhancing security',
            ].map((purpose, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-700 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{purpose}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 3: Disclosure of Information */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-400/80 transition-all space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Section 3
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                3. Disclosure of Information
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            We may disclose your personal information to third parties in the following circumstances:
          </p>

          <ul className="space-y-2.5 pl-0 sm:pl-12 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
              <span>To service providers who assist us in operating our website, processing payments, or delivering orders.</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
              <span>To comply with legal obligations or respond to lawful requests from government authorities.</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
              <span>To protect the rights, property, or safety of Belesu.in, our customers, or others.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Cookies and Tracking Technologies */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-400/80 transition-all space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
              <Cookie className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">
                Section 4
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                4. Cookies and Tracking Technologies
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            We may use cookies and similar tracking technologies to collect information about your browsing behaviour and preferences. You can control cookies through your browser settings, but disabling cookies may limit your access to certain features of our website.
          </p>
        </section>

        {/* Section 5: Third-Party Links */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-400/80 transition-all space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
              <ExternalLink className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                Section 5
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                5. Third-Party Links
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to review the privacy policies of those websites before providing any personal information.
          </p>
        </section>

        {/* Section 6: Security */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-400/80 transition-all space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Section 6
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                6. Security
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            We take reasonable measures to protect the security of your personal information and prevent unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* Section 7: Children’s Privacy */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-400/80 transition-all space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
              <Users className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                Section 7
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                7. Children’s Privacy
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us, and we will promptly delete such information.
          </p>
        </section>

        {/* Section 8: Changes to this Privacy Policy */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-400/80 transition-all space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                Section 8
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                8. Changes to this Privacy Policy
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            We reserve the right to update or modify this Privacy Policy at any time without prior notice. Any changes will be effective immediately upon posting on this page. We encourage you to review this Privacy Policy periodically for any updates.
          </p>
        </section>

        {/* Section 9: Contact Us */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-300 text-emerald-900 shrink-0">
              <Mail className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Section 9 • Data Protection Contact
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                9. Contact Us
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            If you have any questions, concerns, or feedback about this Privacy Policy or our privacy practices, please contact us at:
          </p>

          <div className="pl-0 sm:pl-12 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold">
            <a
              href="mailto:kannada@belesu.in"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:text-emerald-700 hover:border-emerald-400 transition shadow-xs"
            >
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>kannada@belesu.in</span>
            </a>
            <a
              href="tel:+919902383451"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:text-emerald-700 hover:border-emerald-400 transition shadow-xs"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>9902383451</span>
            </a>
          </div>
        </section>

        {/* Concluding Acknowledgment */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-2">
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-200">
            By using our website or services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
          </p>
        </div>

      </main>

      {/* Corporate Credibility Strip */}
      <footer className="py-12 bg-slate-950 text-white border-t border-slate-800 mt-12">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="font-extrabold text-sm sm:text-base text-amber-400">
                  CKELP TECHNOLOGIES PRIVATE LIMITED
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Registered Office:</strong> Deshpande Startups, Next to International Airport, Gokul Road Hubballi - 580030 Karnataka
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Support</span>
              </Link>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
