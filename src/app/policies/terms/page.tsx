import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Scale,
  ShieldCheck,
  FileText,
  UserCheck,
  MessageSquare,
  CreditCard,
  Truck,
  AlertTriangle,
  Gavel,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  BookOpen,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Belesu',
  description:
    'Read Belesu’s terms and conditions covering website use, purchases, payments, digital products and the applicable terms of service.',
  alternates: {
    canonical: '/terms-and-conditions',
  },
};

export default function TermsPage() {
  const sections = [
    {
      id: 'use-of-website',
      title: 'Use of Website',
      icon: <UserCheck className="w-5 h-5 text-amber-600" />,
      content:
        'By using our website, you represent that you are at least 18 years old or have the consent of a parent or guardian.',
    },
    {
      id: 'user-information',
      title: 'User Information',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      content:
        'Some features of our website may require you and agree to provide accurate, current, and complete information about yourself.',
    },
    {
      id: 'user-content',
      title: 'User Content',
      icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
      content:
        'You may have the opportunity to submit or upload content to our website, such as product reviews or comments. By submitting or uploading content, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content worldwide in any media.',
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      content:
        'All content and materials on our website, including but not limited to text, images, graphics, logos, and trademarks, are the property of Belesu.in or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, modify, or distribute any content from our website without our prior written consent.',
    },
    {
      id: 'product-information',
      title: 'Product Information',
      icon: <BookOpen className="w-5 h-5 text-orange-600" />,
      content:
        'We make every effort to display accurate and up-to-date information about our products/Books on our website. However, we do not warrant the accuracy, completeness, or reliability of any product information. Prices, availability, and promotions are subject to change without notice.',
    },
    {
      id: 'payment-and-billing',
      title: 'Payment and Billing',
      icon: <CreditCard className="w-5 h-5 text-teal-600" />,
      content:
        'When you make a purchase on our website, you agree to pay the specified price for the selected products, as well as any applicable taxes and shipping fees. Payment must be made using a valid payment method accepted by Belesu.in. We reserve the right to refuse or cancel any order at our discretion.',
    },
    {
      id: 'shipping-and-delivery',
      title: 'Shipping and Delivery',
      icon: <Truck className="w-5 h-5 text-amber-600" />,
      content:
        'We will make every effort to deliver your order within the estimated timeframe (5-7 days) provided at the time of purchase. However, we do not guarantee delivery dates and are not responsible for delays caused by shipping carriers or other factors beyond our control.',
    },
    {
      id: 'limitation-of-liability',
      title: 'Limitation of Liability',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      content:
        'In no event shall Belesu.in, its officers, directors, employees, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with your use of our website or services, even if advised of the possibility of such damages.',
    },
    {
      id: 'indemnification',
      title: 'Indemnification',
      icon: <Scale className="w-5 h-5 text-indigo-600" />,
      content:
        'You agree to indemnify and hold harmless Belesu.in, its officers, directors, employees, and affiliates from any claims, liabilities, damages, losses, or expenses, including reasonable attorneys\' fees, arising out of or in any way related to your use of our website or services.',
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: <Gavel className="w-5 h-5 text-slate-700" />,
      content:
        'These Terms and Conditions shall be governed by and construed in accordance with the laws of Karnataka, India, without regard to its conflict of laws principles.',
    },
    {
      id: 'changes-to-terms',
      title: 'Changes to Terms and Conditions',
      icon: <RefreshCw className="w-5 h-5 text-emerald-600" />,
      content:
        'We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Any changes will be effective immediately upon posting on this page. We encourage you to review these Terms and Conditions periodically for any updates.',
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen text-slate-900">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-stone-200 py-3">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-amber-600 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-400">Legal</span>
            <span>/</span>
            <span className="text-slate-900 font-bold" aria-current="page">Terms and Conditions</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-stone-200 py-12 md:py-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 border border-amber-300">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Legal Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Terms and Conditions
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Please read these Terms and Conditions carefully before accessing or using Belesu.in services.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
        
        {/* Welcome & Agreement Block */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
            Welcome to Belesu.in
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Welcome to Belesu.in. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these Terms and Conditions, you may not use our website.
          </p>
        </div>

        {/* Clauses Grid */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <section
              key={section.id}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-amber-400/80 transition-all space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
                  {section.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                    Section {idx + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {section.title}
                  </h2>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Contact Us Section */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-300 text-amber-900 shrink-0">
              <Mail className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Support & Inquiries
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Contact Us
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            If you have any questions, concerns, or feedback about these Terms and Conditions, please contact us at:
          </p>

          <div className="pl-0 sm:pl-12 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold">
            <a
              href="mailto:kannada@belesu.in"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 hover:text-amber-700 hover:border-amber-400 transition shadow-xs"
            >
              <Mail className="w-4 h-4 text-amber-600" />
              <span>kannada@belesu.in</span>
            </a>
            <a
              href="tel:+919606636804"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 hover:text-amber-700 hover:border-amber-400 transition shadow-xs"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>9606636804</span>
            </a>
          </div>
        </section>

        {/* Concluding Acknowledgment */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-2">
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-200">
            By using our website or services, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
          </p>
        </div>

      </main>

      {/* Corporate Credibility Strip */}
      <footer className="py-12 bg-slate-950 text-white border-t border-slate-800 mt-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
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
                <strong>Operations Office:</strong> VRIF, Visvesvaraya Technological University (VTU) campus, Belgaum - 590018
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
