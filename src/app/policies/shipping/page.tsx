import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Truck,
  Clock,
  CreditCard,
  BellRing,
  CalendarClock,
  MapPin,
  PackageX,
  Mail,
  Phone,
  Building2,
  PackageCheck,
  Globe2,
  AlertTriangle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping and Delivery Policy | Belesu',
  description:
    'Learn about Belesu’s shipping process, delivery timelines, shipping charges and order delivery information for physical guidebooks.',
  alternates: {
    canonical: '/shipping-policy',
  },
};

export default function ShippingPolicyPage() {
  const sections = [
    {
      id: 'shipping-methods',
      title: '1. Shipping Methods',
      icon: <Truck className="w-5 h-5 text-amber-600" />,
      tag: 'Logistics Options',
      tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            We offer shipping methods to deliver your orders, including:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Local Delivery</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Typically takes <strong>5–7 business days</strong> for local delivery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Karnataka State Delivery</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Typically takes <strong>7–9 business days</strong> within Karnataka state delivery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                <Globe2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>International Shipping</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We don’t do International shipping at this point.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'shipping-rates',
      title: '2. Shipping Rates',
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
      tag: 'Cost Calculation',
      tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      content: (
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Shipping rates are calculated based on factors such as the destination of the order, and the weight and dimensions of the package. The shipping cost will be displayed during the checkout process before you complete your purchase.
        </p>
      ),
    },
    {
      id: 'order-processing-time',
      title: '3. Order Processing Time',
      icon: <PackageCheck className="w-5 h-5 text-blue-600" />,
      tag: 'Dispatch Schedule',
      tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
      content: (
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          We strive to process and ship orders promptly. Orders are usually processed within 3–5 business days after payment confirmation. However, please note that order processing times may vary during peak academic season.
        </p>
      ),
    },
    {
      id: 'shipping-confirmation',
      title: '4. Shipping Confirmation',
      icon: <BellRing className="w-5 h-5 text-indigo-600" />,
      tag: 'Order Updates',
      tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      content: (
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Once your order has been shipped, you will receive a shipping confirmation email and/or our Customer service team will call you.
        </p>
      ),
    },
    {
      id: 'delivery-timeframe',
      title: '5. Delivery Timeframe',
      icon: <CalendarClock className="w-5 h-5 text-purple-600" />,
      tag: 'Carrier Timelines',
      tagColor: 'text-purple-700 bg-purple-50 border-purple-200',
      content: (
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Delivery times may vary depending on factors such as the destination of the order, and any unforeseen delays caused by shipping carriers. While we make every effort to deliver your order within the estimated timeframe, we cannot guarantee specific delivery dates.
        </p>
      ),
    },
    {
      id: 'shipping-restrictions',
      title: '6. Shipping Restrictions',
      icon: <MapPin className="w-5 h-5 text-orange-600" />,
      tag: 'Eligible Regions',
      tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
      content: (
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          We currently ship to addresses within Karnataka state.
        </p>
      ),
    },
    {
      id: 'undeliverable-packages',
      title: '7. Undeliverable Packages',
      icon: <PackageX className="w-5 h-5 text-rose-600" />,
      tag: 'Returns & Reshipment',
      tagColor: 'text-rose-700 bg-rose-50 border-rose-200',
      content: (
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            In the event that a package is returned to us as undeliverable due to incorrect address information provided by the customer or failure to retrieve the package from the carrier, we will contact you to arrange for reshipment. Additional shipping charges may apply for reshipment of undeliverable packages.
          </p>
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
            <span className="text-slate-900 font-bold" aria-current="page">Shipping Policy</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-stone-200 py-12 md:py-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 border border-amber-300">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>Shipping & Delivery Logistics</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Shipping Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Information regarding shipment timelines, delivery methods, eligible regions, and order fulfillment.
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
            Welcome to Belesu.in. Our Shipping Policy outlines the terms and conditions regarding the shipment of orders placed on our website. By placing an order with us, you agree to comply with this Shipping Policy.
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

        {/* Section 8: Contact Us */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-300 text-amber-900 shrink-0">
              <Mail className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Section 8 • Logistics Support
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Contact Us
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-12">
            If you have any questions, concerns, or feedback about our Shipping Policy, please contact us at:
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
            By placing an order on our website, you acknowledge that you have read and understood our Shipping Policy and agree to comply with its terms and conditions.
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
