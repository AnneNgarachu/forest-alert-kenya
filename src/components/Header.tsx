// src/components/Header.tsx

'use client';

import { useState } from 'react';
import { 
  InformationCircleIcon, 
  XMarkIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ChartBarIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function Header() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-kenya-black via-forest-900 to-kenya-black text-white shadow-lg">
        {/* Kenya Flag Stripe */}
        <div className="h-1 bg-gradient-to-r from-kenya-black via-maasai-500 to-forest-600" />
        
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-forest-500 to-forest-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🌳</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Forest Alert <span className="text-maasai-400">Kenya</span>
                </h1>
                <p className="text-forest-300 text-sm">
                  Public Transparency Dashboard
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Leicester Credit Badge */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <AcademicCapIcon className="w-4 h-4 text-forest-300" />
                <span className="text-xs text-forest-200">
                  Powered by <span className="font-semibold text-white">Leicester PyEO</span>
                </span>
              </div>

              {/* About Button */}
              <button
                onClick={() => setShowAbout(true)}
                className="flex items-center gap-2 bg-forest-700 hover:bg-forest-600 px-4 py-2 rounded-xl transition font-medium text-sm"
              >
                <InformationCircleIcon className="w-5 h-5" />
                About
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* About Modal */}
      {showAbout && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(26, 26, 46, 0.85)' }}
        >
          <div 
            className="absolute inset-0" 
            onClick={() => setShowAbout(false)} 
          />
          
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-forest-700 to-forest-800 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <button 
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🌳</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">About Forest Alert Kenya</h2>
                  <p className="text-forest-200">Public Transparency Dashboard</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* What This Is */}
              <section>
                <h3 className="font-bold text-lg text-kenya-black mb-3 flex items-center gap-2">
                  <GlobeAltIcon className="w-5 h-5 text-forest-600" />
                  What is Forest Alert Kenya?
                </h3>
                <p className="text-earth-700 leading-relaxed">
                  Forest Alert Kenya is a <strong>public transparency dashboard</strong> that extends 
                  the groundbreaking forest monitoring research developed by the{' '}
                  <strong>University of Leicester's Centre for Landscape and Climate Research</strong>.
                </p>
                <p className="text-earth-700 leading-relaxed mt-3">
                  While Leicester's PyEO system currently sends deforestation alerts exclusively to 
                  government agencies (Kenya Forest Service), this dashboard makes that same 
                  satellite-detected information accessible to <strong>civil society, journalists, 
                  community forest associations, and the Kenyan public</strong>.
                </p>
              </section>

              {/* Leicester Credit - PROMINENT */}
              <section className="bg-gradient-to-r from-forest-50 to-earth-50 rounded-xl p-5 border border-forest-200">
                <h3 className="font-bold text-lg text-kenya-black mb-3 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-forest-600" />
                  Built on Leicester Research
                </h3>
                <p className="text-earth-700 leading-relaxed mb-4">
                  This dashboard is powered by <strong>PyEO (Python for Earth Observation)</strong>, 
                  developed by <strong>Professor Heiko Balzter</strong> and his team at the 
                  University of Leicester. Their system uses Sentinel-2 satellite imagery to 
                  detect forest loss across Kenya every 5 days with remarkable accuracy.
                </p>
                
                <div className="bg-white rounded-lg p-4 border border-earth-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AcademicCapIcon className="w-8 h-8 text-forest-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-kenya-black">Prof. Heiko Balzter</p>
                      <p className="text-sm text-earth-600">Director, Institute for Environmental Futures</p>
                      <p className="text-sm text-earth-600">University of Leicester</p>
                      <p className="text-xs text-earth-500 mt-1">
                        Leading researcher in Earth Observation, climate science, and forest monitoring 
                        with active projects across Kenya, DR Congo, Colombia, and Madagascar.
                      </p>
                      {/* LinkedIn Link - CORRECTED URL */}
                      <a 
                        href="https://www.linkedin.com/in/heiko-balzter/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        View LinkedIn Profile
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Why Public Transparency Matters */}
              <section>
                <h3 className="font-bold text-lg text-kenya-black mb-3 flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-maasai-600" />
                  Why Public Transparency?
                </h3>
                <p className="text-earth-700 leading-relaxed">
                  Kenya's forests face threats not just from illegal logging, but sometimes from 
                  government-authorized activities that may lack proper environmental assessment. 
                  When alerts go only to government agencies, there's an accountability gap.
                </p>
                <div className="mt-4 bg-maasai-50 rounded-lg p-4 border-l-4 border-maasai-500">
                  <p className="text-sm text-maasai-800">
                    <strong>The Problem:</strong> Communities near threatened forests often learn about 
                    deforestation only after the damage is done. By then, it's too late to act.
                  </p>
                </div>
                <div className="mt-3 bg-forest-50 rounded-lg p-4 border-l-4 border-forest-500">
                  <p className="text-sm text-forest-800">
                    <strong>The Solution:</strong> This dashboard gives civil society the same real-time 
                    information that government receives, enabling rapid response and public accountability.
                  </p>
                </div>
              </section>

              {/* How It Works */}
              <section>
                <h3 className="font-bold text-lg text-kenya-black mb-3 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-sunset-600" />
                  How It Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-earth-50 rounded-xl">
                    <span className="text-3xl mb-2 block">🛰️</span>
                    <p className="font-semibold text-sm text-kenya-black">Satellite Detection</p>
                    <p className="text-xs text-earth-600 mt-1">
                      Leicester's PyEO analyzes Sentinel-2 imagery every 5 days
                    </p>
                  </div>
                  <div className="text-center p-4 bg-earth-50 rounded-xl">
                    <span className="text-3xl mb-2 block">📡</span>
                    <p className="font-semibold text-sm text-kenya-black">Alert Generation</p>
                    <p className="text-xs text-earth-600 mt-1">
                      AI detects forest loss, fires, and encroachment patterns
                    </p>
                  </div>
                  <div className="text-center p-4 bg-earth-50 rounded-xl">
                    <span className="text-3xl mb-2 block">👥</span>
                    <p className="font-semibold text-sm text-kenya-black">Public Access</p>
                    <p className="text-xs text-earth-600 mt-1">
                      This dashboard makes alerts visible to everyone
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Sources */}
              <section className="border-t border-earth-200 pt-6">
                <h3 className="font-semibold text-sm text-earth-500 uppercase tracking-wider mb-3">
                  Data Sources & Partners
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-earth-100 text-earth-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    🎓 University of Leicester
                  </span>
                  <span className="bg-earth-100 text-earth-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    🛰️ ESA Sentinel-2
                  </span>
                  <span className="bg-earth-100 text-earth-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    🌍 Global Forest Watch
                  </span>
                  <span className="bg-earth-100 text-earth-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    🔥 NASA VIIRS
                  </span>
                </div>
              </section>

              {/* Call to Action */}
              <section className="bg-gradient-to-r from-kenya-black to-forest-900 text-white rounded-xl p-5">
                <h3 className="font-bold text-lg mb-2">Get Involved</h3>
                <p className="text-forest-200 text-sm mb-4">
                  Interested in partnering on forest transparency initiatives in Kenya or other countries? 
                  Contact Professor Balzter's team at the University of Leicester.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="mailto:hb91@le.ac.uk"
                    className="flex items-center gap-2 bg-maasai-500 hover:bg-maasai-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    Contact Prof. Balzter
                  </a>
                  <a 
                    href="https://le.ac.uk/people/heiko-balzter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Leicester Profile →
                  </a>
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="bg-earth-100 px-6 py-4 rounded-b-2xl">
              <p className="text-xs text-earth-500 text-center">
                Forest Alert Kenya • Extending Leicester's research for public accountability
              </p>
              {/* Kenya Flag Stripe */}
              <div className="h-1 bg-gradient-to-r from-kenya-black via-maasai-500 to-forest-600 rounded-full mt-3" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}