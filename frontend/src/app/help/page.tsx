'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const HelpSupportPage = () => {
  const [activeTab, setActiveTab] = useState('faqs');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample FAQ data
  const faqs = [
    {
      id: 1,
      question: "How do I apply for a certificate?",
      answer: "To apply for a certificate, go to the Services section and select Certificates. Choose the type of certificate you need and follow the application process. You'll need to provide personal details and upload required documents."
    },
    {
      id: 2,
      question: "How long does it take to process my application?",
      answer: "Most certificate applications are processed within 3-5 working days. Grievances are typically resolved within 7-10 working days, depending on the complexity of the issue."
    },
    {
      id: 3,
      question: "How can I track my application status?",
      answer: "You can track your application status by logging into your account and visiting the Applications section. Here you'll see all your submitted applications with their current status."
    },
    {
      id: 4,
      question: "What documents do I need for property tax payment?",
      answer: "To pay property tax, you'll need your property ID or holding number and owner details. No physical documents are required as this is a digital process."
    },
    {
      id: 5,
      question: "How do I file a grievance?",
      answer: "To file a grievance, go to the Services section and select Grievance Redressal. Fill out the form with details about your issue and submit it. You'll receive updates on the resolution progress."
    },
    {
      id: 6,
      question: "Is there a fee for using these services?",
      answer: "No, all services provided through the Digital E-Panchayat portal are completely free of charge. This is part of our initiative to provide accessible digital governance."
    }
  ];

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Contact information
  const contactInfo = {
    email: "support@digital-epanchayat.gov.in",
    phone: "+91 98765 43210",
    office: "Panchayat Office, Main Road, Village Name",
    hours: "Monday to Friday: 9:00 AM - 5:00 PM"
  };

  // User guide sections
  const userGuides = [
    {
      id: 1,
      title: "Getting Started with Digital E-Panchayat",
      description: "Learn how to create an account and navigate the portal.",
      link: "#"
    },
    {
      id: 2,
      title: "Applying for Certificates",
      description: "Step-by-step guide to applying for various certificates.",
      link: "#"
    },
    {
      id: 3,
      title: "Filing and Tracking Grievances",
      description: "How to submit and monitor your grievances.",
      link: "#"
    },
    {
      id: 4,
      title: "Accessing Land Records",
      description: "Guide to viewing and downloading land records.",
      link: "#"
    },
    {
      id: 5,
      title: "Applying for Government Schemes",
      description: "How to find and apply for available schemes.",
      link: "#"
    },
    {
      id: 6,
      title: "Property Tax Payment",
      description: "Instructions for viewing and acknowledging property tax.",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-hero py-16 sm:py-20">
          <div className="responsive-container text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <div className="text-4xl">❓</div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Help & Support
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to your questions and get assistance with our services.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="responsive-container py-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help topics..."
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

        {/* Tab Navigation */}
        <div className="responsive-container py-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('faqs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'faqs'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Frequently Asked Questions
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contact Us
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'guides'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Guides
              </button>
            </nav>
          </div>
        </div>

        {/* Content Sections */}
        <div className="responsive-container py-6 sm:py-8">
          {/* FAQs Section */}
          {activeTab === 'faqs' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
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
          )}

          {/* Contact Section */}
          {activeTab === 'contact' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Get in Touch</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                        <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-gray-600">{contactInfo.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                        <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Phone</p>
                        <p className="text-gray-600">{contactInfo.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full">
                        <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Office Address</p>
                        <p className="text-gray-600">{contactInfo.office}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full">
                        <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Office Hours</p>
                        <p className="text-gray-600">{contactInfo.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Send us a Message</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="What is this regarding?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Please describe your issue or question..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-green to-deep-blue text-white py-2.5 rounded-lg shadow-soft hover:shadow-md transition-all font-medium"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* User Guides Section */}
          {activeTab === 'guides' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Guides & Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userGuides.map((guide) => (
                  <div key={guide.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="text-4xl text-center mb-4">📘</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{guide.title}</h3>
                    <p className="text-gray-600 mb-4">{guide.description}</p>
                    <a 
                      href={guide.link} 
                      className="text-emerald-600 hover:text-emerald-800 font-medium text-sm"
                    >
                      View Guide →
                    </a>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Need More Help?</h3>
                <p className="text-gray-600 mb-4">
                  If you can't find what you're looking for, please don't hesitate to contact our support team. 
                  We're here to help you make the most of Digital E-Panchayat services.
                </p>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpSupportPage;