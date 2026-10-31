'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Book Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Book Inquiry',
      message: '',
    });
  };

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            Customer Support & School Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Contact <span className="text-amber-600">Belesu</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Have questions about our books, order status, or bulk school orders? We are here to assist you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick WhatsApp Support Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 rounded-2xl shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black">Instant WhatsApp Support</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Connect directly with our support team on WhatsApp for instant assistance regarding book recommendations and order tracking.
              </p>
              <a
                href="https://wa.me/919606636804?text=Hello%20Belesu,%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-emerald-50 transition min-h-[44px] cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Us (+91 96066 36804)
              </a>
            </div>

            {/* Address & Contact Cards */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Contact Information</h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold text-slate-900">Office Address:</strong>
                    <span>#152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold text-slate-900">Operations Office:</strong>
                    <span>VRIF, Visvesvaraya Technological University (VTU) campus, Belgaum - 590018</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold text-slate-900">Phone Support:</strong>
                    <div className="flex flex-col gap-0.5">
                      <a href="tel:+919606636804" className="hover:text-amber-600 font-semibold text-slate-900 py-0.5 inline-block min-h-[32px]">+91 96066 36804</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold text-slate-900">Email Inquiry:</strong>
                    <a href="mailto:kannada@belesu.in" className="hover:text-amber-600 font-semibold py-0.5 inline-block min-h-[32px]">kannada@belesu.in</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold text-slate-900">Working Hours:</strong>
                    <span>Monday – Saturday: 9:00 AM – 7:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Send Us a Message</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Fill out the form below and our academic advisor will reach out to you within 24 hours.
                </p>
              </div>

              {submitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Thank you! Your message has been sent successfully. We will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3.5 min-h-[48px] text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3.5 min-h-[48px] text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Phone / Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter 10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3.5 min-h-[48px] text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-3.5 min-h-[48px] text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Book Inquiry">Book Inquiry</option>
                      <option value="Order Tracking">Order Tracking</option>
                      <option value="School Bulk Order">School Bulk Order</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about the class or book you are looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3.5 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 text-sm transition cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
