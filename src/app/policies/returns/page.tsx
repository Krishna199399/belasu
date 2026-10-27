import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  Phone,
  Mail,
  Building2,
  PackageCheck,
  AlertCircle,
  Receipt,
  Headphones,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns and Refund Policy | Belesu',
  description:
    'Review Belesu’s returns and refund policy for information about eligibility, conditions and how to raise a return or refund request.',
  alternates: {
    canonical: '/returns',
  },
};

export default function ReturnsPolicyPage() {
  const sections = [
    {
      id: 'return-eligibility',
      title: '1. Return Eligibility',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      tag: '7-Day Window',
      tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            We accept returns and exchanges for Academic Book/s within <strong>7 days</strong> of period from the date of delivery. To be eligible for a return or exchange, the product/Book must be unused, in its original packaging, and in the same condition as received.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <strong className="block text-slate-900 font-bold text-xs sm:text-sm">Eligible Conditions:</strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unused, unmarked, in original shrinkwrap/packaging with all accessories intact.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <strong className="block text-slate-900 font-bold text-xs sm:text-sm">Timeline Requirement:</strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                Request must be initiated within 7 calendar days from confirmed courier delivery.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'return-process',
      title: '2. Return Process',
      icon: <Headphones className="w-5 h-5 text-blue-600" />,
      tag: 'Step-by-Step Guide',
      tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            If you wish to return or exchange a Book, please contact our customer service team on <strong>9606636804</strong> within the return period to initiate the return process. You may be required to provide proof of purchase and reason for return. Our Customer service team will guide you on return procedure.
          </p>
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-blue-950 space-y-0.5">
              <span className="font-bold block">Need to initiate a return or exchange?</span>
              <span className="text-blue-800">Call or message our dedicated team directly.</span>
            </div>
            <a
              href="tel:+919606636804"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 9606636804</span>
            </a>
          </div>
        </div>
      ),
    },
    {
      id: 'return-shipping',
      title: '3. Return Shipping',
      icon: <Truck className="w-5 h-5 text-amber-600" />,
      tag: 'Shipping & Freight',
      tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            The cost of return shipping is the responsibility of the customer, unless the return is due to a defective product or an error on our part. We recommend using a trackable shipping method and retaining proof of postage for your return shipment.
          </p>
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Defective Items or Shipping Errors:</strong> If you received a damaged, misprinted, or incorrect book, Belesu bears the entire replacement and shipping cost.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'refunds-overview',
      title: '4. Refunds & Exchanges',
      icon: <RotateCcw className="w-5 h-5 text-indigo-600" />,
      tag: '5–7 Business Days',
      tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      content: (
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Upon receipt and inspection of the returned Book, we will process your refund with <strong>5 - 7 Business Working days</strong> or exchange as per our refund policy. Refunds will be issued to the original method of payment used for the purchase or easiest way for the customer based on information taken by our customer service team.
        </p>
      ),
    },
    {
      id: 'refund-policy',
      title: '5. Detailed Refund Policy',
      icon: <Receipt className="w-5 h-5 text-teal-600" />,
      tag: 'Inspection & Payouts',
      tagColor: 'text-teal-700 bg-teal-50 border-teal-200',
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <strong className="block text-slate-900 font-bold text-xs sm:text-sm">Refund Eligibility:</strong>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              We offer refunds for eligible returns within the specified return period. Refunds are issued for the purchase price of the returned Book, excluding any shipping charges.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <strong className="block text-slate-900 font-bold text-xs sm:text-sm">Refund Processing:</strong>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed with <strong>5 - 7 Business Working days</strong> and credited to the original method of payment used for the purchase or easiest way for the customer based on information taken by our customer service team.
            </p>
          </div>
        </div>
      ),
    },
  ];

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
            <span className="text-slate-900 font-bold" aria-current="page">Returns & Delivery Policy</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-stone-200 py-12 md:py-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 border border-amber-300">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Customer Satisfaction & Guarantee</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Returns and Delivery Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Clear guidelines on product returns, book exchanges, refund processing, and delivery satisfaction.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
        
        {/* Welcome & Commitment Statement */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
            Welcome to Belesu.in
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Welcome to Belesu.in. Our Returns and Delivery Policy outlines the terms and conditions regarding product returns, exchanges, and delivery of your orders. By placing an order on our website, you agree to comply with this policy.
          </p>
        </div>

        {/* Clauses Stack */}
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-amber-400/80 transition-all space-y-4"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${section.tagColor}`}>
                  {section.tag}
                </span>
              </div>
              <div className="pl-0 sm:pl-12">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Section 6: Contact Us */}
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
                6. Contact Us
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            If you have any questions, concerns, or feedback about our Returns and Delivery Policy, please contact us at:
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
            By placing an order on our website, you acknowledge that you have read and understood our Returns and Delivery Policy and agree to comply with its terms and conditions.
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
                <strong>Operations Office:</strong> VRIF, Viswesariya Tecnology Univercity (VTU) campus, Belgaum
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
