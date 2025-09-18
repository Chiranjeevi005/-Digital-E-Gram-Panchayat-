'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Services = () => {
  // Define the service categories as per your requirements
  const serviceCategories = [
    {
      id: 1,
      icon: '📑',
      title: 'Certificates & Records',
      description: 'Access and apply for essential certificates and records with ease.',
      subServices: [
        'Apply for Birth/Death Certificates',
        'Download Income/Caste/Residence Certificates'
      ],
      buttonText: 'View Certificates',
      link: '/services/certificates'
    },
    {
      id: 2,
      icon: '🏠',
      title: 'Property & Land',
      description: 'Manage your property and land records efficiently.',
      subServices: [
        'Pay property tax online',
        'View land records & mutation status'
      ],
      buttonText: 'View Records',
      link: '/services/property'
    },
    {
      id: 3,
      icon: '💰',
      title: 'Schemes & Subsidies',
      description: 'Explore and apply for various government schemes and subsidies.',
      subServices: [
        'Apply for pensions & scholarships',
        'Track subsidy application status'
      ],
      buttonText: 'Explore Schemes',
      link: '/services/schemes'
    },
    {
      id: 4,
      icon: '📬',
      title: 'Grievance Redressal',
      description: 'Report issues and track their resolution status.',
      subServices: [
        'Lodge complaints (roads, water, electricity, sanitation)',
        'Track complaint status'
      ],
      buttonText: 'Submit Grievance',
      link: '/services/grievances'
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  // Quick stats data
  const quickStats = [
    { id: 1, value: '2300+', label: 'Certificates issued' },
    { id: 2, value: '120', label: 'Grievances resolved' },
    { id: 3, value: '50+', label: 'Schemes active' },
    { id: 4, value: '98%', label: 'Citizen satisfaction' }
  ];

  const filteredServices = serviceCategories.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.subServices.some(subService => 
      subService.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-hero py-16 sm:py-20">
          <div className="responsive-container text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our Citizen Services
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Quick, simple, and transparent access to essential Panchayat services.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="responsive-container py-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search services..."
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

        {/* Services Grid */}
        <div className="responsive-container py-6 sm:py-8">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <div 
                  key={service.id}
                  className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 focus-within:ring-2 focus-within:ring-emerald-500"
                >
                  <div className="text-5xl text-center mb-4" aria-hidden="true">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-center">
                    {service.description}
                  </p>
                  
                  <ul className="mb-6 space-y-2">
                    {service.subServices.map((subService, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-green mr-2" aria-hidden="true">•</span>
                        <span className="text-gray-700">{subService}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {service.link ? (
                    <Link 
                      href={service.link}
                      className="block w-full bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all text-center font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {service.buttonText}
                    </Link>
                  ) : (
                    <button className="w-full bg-gradient-to-r from-emerald-green to-deep-blue text-white py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      {service.buttonText}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
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

        {/* Quick Stats Section */}
        <div className="responsive-container py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <div 
                key={stat.id}
                className="bg-white rounded-2xl p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-emerald-500"
              >
                <div className="text-2xl sm:text-3xl font-bold text-emerald-green mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="responsive-container py-12 sm:py-16">
          <div className="bg-gradient-diagonal rounded-2xl p-8 sm:p-10 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Need help using services?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Visit our FAQ or contact support for assistance with any of our services.
            </p>
            <button className="bg-gradient-to-r from-emerald-green to-deep-blue text-white px-6 py-3 rounded-xl shadow-soft hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500">
              Go to Help Desk
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;