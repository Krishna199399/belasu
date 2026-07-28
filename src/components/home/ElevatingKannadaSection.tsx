'use client';

import React from 'react';

export const ElevatingKannadaSection: React.FC = () => {
  const pillars = [
    {
      title: 'Language Preservation',
      iconImg: '/icons/1-1.png',
      desc: 'Protecting & revitalizing academic Kannada fluency for non-native families.'
    },
    {
      title: 'Cultural Enrichment',
      iconImg: '/icons/2.png',
      desc: 'Connecting students to Karnataka’s rich literary heritage and moral values.'
    },
    {
      title: 'Community Empowerment',
      iconImg: '/icons/3.png',
      desc: 'Empowering parents to confidently support homework and school assignments.'
    },
    {
      title: 'Visionary Leadership',
      iconImg: '/icons/4.png',
      desc: 'Research-backed curriculum tools designed for modern school success.'
    }
  ];

  return (
    <section className="bg-white py-16 border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* 4 Pillars Grid with Original WP PNG Icons & Vertical Dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-b border-stone-200">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center text-center p-4 ${
                idx < 3 ? 'lg:border-r lg:border-stone-200' : ''
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-amber-50/80 border border-amber-200/80 flex items-center justify-center mb-4 shadow-sm hover:scale-110 transition-transform duration-300">
                <img
                  src={item.iconImg}
                  alt={item.title}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Elevating Kannada Editorial Section */}
        <div className="max-w-4xl mx-auto text-center pt-16 pb-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic font-bold text-amber-800 tracking-tight leading-tight">
            Elevating Kannada Across Karnataka
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-serif leading-relaxed sm:leading-loose">
            Our dedication to elevating Kannada across Karnataka knows no bounds. We tirelessly work to enrich its presence and usage in every facet of our diverse state, from bustling cities to serene rural communities. Through innovative initiatives and educational endeavors, we strive to empower individuals to embrace Kannada as a cornerstone of their identity and heritage. By fostering a deep appreciation for the language&apos;s richness and cultural significance, we aim to unite people from all walks of life under the banner of Kannada pride. Together, we envision a future where Kannada thrives as a vibrant and dynamic force, shaping the narrative of Karnataka&apos;s cultural landscape for generations to come.
          </p>
        </div>

      </div>
    </section>
  );
};
