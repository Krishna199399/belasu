import React from 'react';
import { Truck, ShieldCheck, Clock } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-5">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase">Legal & Logistics</span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Shipping Policy</h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h3 className="font-bold text-slate-900 text-base">Order Processing & Dispatch</h3>
            <p>
              All orders for Belesu English-translated Kannada guidebooks are processed and dispatched within 24 business hours of placement. Orders placed on Sundays or public holidays will be dispatched on the following business day.
            </p>

            <h3 className="font-bold text-slate-900 text-base">Delivery Timelines Across Karnataka & India</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Major Cities (Bengaluru, Mysuru, Hubballi, Mangaluru):</strong> 2 to 4 business days.</li>
              <li><strong>Other Pincodes in Karnataka:</strong> 3 to 5 business days.</li>
              <li><strong>Rest of India:</strong> 4 to 7 business days.</li>
            </ul>

            <h3 className="font-bold text-slate-900 text-base">Shipping Charges</h3>
            <p>
              We offer <strong>FREE Delivery</strong> on all orders of ₹500 or more. For orders below ₹500, a nominal flat shipping fee of ₹40 applies.
            </p>

            <h3 className="font-bold text-slate-900 text-base">Order Tracking</h3>
            <p>
              Once your shipment is dispatched, you will receive an SMS and WhatsApp notification containing your courier tracking details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
