'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const CertificatesHub = () => {
  // Define the certificate categories as per your requirements
  const certificateCategories = [
    {
      id: 1,
      icon: '🍼',
      title: 'Birth Certificate',
      description: 'Apply for official birth certificate for newborns.',
      link: '/services/certificates/apply',
      linkText: 'Apply Now',
      certificateType: 'Birth'
    },
    {
      id: 2,
      icon: '⚰️',
      title: 'Death Certificate',
      description: 'Apply for official death certificate for deceased individuals.',
      link: '/services/certificates/apply',
      linkText: 'Apply Now',
      certificateType: 'Death'
    },
    {
      id: 3,
      icon: '💍',
      title: 'Marriage Certificate',
      description: 'Apply for official marriage certificate for newlyweds.',
      link: '/services/certificates/apply',
      linkText: 'Apply Now',
      certificateType: 'Marriage'
    },
    {
      id: 4,
      icon: '📜',
      title: 'Income Certificate',
      description: 'Apply for income certificate for financial assistance.',
      link: '/services/certificates/apply',
      linkText: 'Apply Now',
      certificateType: 'Income'
    },
    {
      id: 5,
      icon: '👥',
      title: 'Caste Certificate',
      description: 'Apply for caste certificate for educational benefits.',
      link: '/services/certificates/apply',
      linkText: 'Apply Now',
      certificateType: 'Caste'
    },
    {
      id: 6,
      icon: '🏠',
      title: 'Residence Certificate',
      description: 'Apply for residence certificate for local benefits.',
      link: '/services/certificates/apply',
      linkText: 'Apply Now',
      certificateType: 'Residence'
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCertificates = certificateCategories.filter(certificate => 
    certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section with Panchayat branding */}
        <div className="bg-gradient-hero py-12 sm:py-16">
          <div className="responsive-container text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <div className="text-4xl">📑</div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Certificates & Records
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Access and apply for essential certificates and records with ease.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="responsive-container py-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards Section - Grid layout with icon + title + button */}
        <div className="responsive-container py-6 sm:py-8">
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((certificate) => (
                <div 
                  key={certificate.id}
                  className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 focus-within:ring-2 focus-within:ring-emerald-500"
                >
                  <div className="text-5xl text-center mb-4" aria-hidden="true">{certificate.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    {certificate.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-center">
                    {certificate.description}
                  </p>
                  
                  <Link 
                    href={{
                      pathname: certificate.link,
                      query: { type: certificate.certificateType }
                    }}
                    className="block w-full bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {certificate.linkText}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search term
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* How It Works Section - Smooth User Flow */}
        <div className="responsive-container py-8 sm:py-12">
          <div className="bg-gradient-diagonal rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-80 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Choose Service</h3>
                <p className="text-gray-600 text-sm">Select the certificate type you need</p>
              </div>
              
              <div className="bg-white bg-opacity-80 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Fill Form</h3>
                <p className="text-gray-600 text-sm">Provide required details and documents</p>
              </div>
              
              <div className="bg-white bg-opacity-80 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Review & Generate</h3>
                <p className="text-gray-600 text-sm">Preview and confirm your certificate</p>
              </div>
              
              <div className="bg-white bg-opacity-80 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Download</h3>
                <p className="text-gray-600 text-sm">Save as PDF or JPG</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CertificatesHub;