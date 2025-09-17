'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Map from '../../components/Map';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  const importantContacts = [
    {
      name: 'Citizen Support',
      email: 'support@epanchayat.com',
      role: 'For general citizen queries'
    },
    {
      name: 'Officer in Charge',
      email: 'officer@epanchayat.com',
      role: 'For official matters'
    },
    {
      name: 'Staff 1',
      email: 'staff1@epanchayat.com',
      role: 'For administrative support'
    },
    {
      name: 'Staff 2',
      email: 'staff2@epanchayat.com',
      role: 'For technical assistance'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-emerald-50 to-sky-50 py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-24 h-24 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-10 right-10 w-24 h-24 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-10 left-1/2 w-24 h-24 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Contact Digital E-Panchayat
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                We're here to help you. Reach out through any of the following ways.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Office Info and Important Contacts */}
            <div className="space-y-12">
              {/* Panchayat Office Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Panchayat Office Info</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">
                      Gram Panchayat Office, Main Road, Mumbai, Maharashtra - 400001
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="text-gray-600">
                      <p>+91 12345 67890</p>
                      <p>1800-555-0123 (Toll-free)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">help@epanchayat.com</p>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">
                      Working Hours: Mon–Sat (9 AM – 6 PM)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Important Contacts */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Important Contacts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {importantContacts.map((contact, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{contact.role}</p>
                          <a href={`mailto:${contact.email}`} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-2 inline-block">
                            {contact.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Contact Form and Map */}
            <div className="space-y-12">
              {/* Quick Contact Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Quick Contact Form</h2>
                </div>
                
                {submitSuccess && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-emerald-700 font-medium">Thank you for reaching out, our team will get back to you soon.</p>
                    </div>
                  </div>
                )}
                
                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-700 font-medium">{submitError}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email / Phone</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      placeholder="Email address or phone number"
                      required
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      placeholder="Subject of your message"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      placeholder="Your message here..."
                      required
                    ></textarea>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    className="w-full py-3 px-6 text-lg"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
              
              {/* Location Map */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Our Location</h2>
                </div>
                
                <Map location="Gram Panchayat Office, Mumbai, Maharashtra" height="320px" />
                
                <p className="mt-4 text-gray-600 text-center">
                  Gram Panchayat Office, Main Road, Mumbai, Maharashtra - 400001
                </p>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-5 hover:border-emerald-300 transition-colors">
                <h3 className="font-semibold text-gray-800 text-lg">How to download certificates?</h3>
                <p className="mt-2 text-gray-600">
                  Visit the Services section, select the certificate you need, fill in the required details, 
                  and submit your application. Once approved, you can download your certificate in PDF format.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-5 hover:border-emerald-300 transition-colors">
                <h3 className="font-semibold text-gray-800 text-lg">What is the processing time for applications?</h3>
                <p className="mt-2 text-gray-600">
                  Most applications are processed within 3-5 working days. You can track your application 
                  status using the tracking ID provided after submission.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-5 hover:border-emerald-300 transition-colors">
                <h3 className="font-semibold text-gray-800 text-lg">How to register a grievance?</h3>
                <p className="mt-2 text-gray-600">
                  Navigate to the Grievances section, click on "Register New Grievance", fill in the details, 
                  and submit. You will receive updates on your grievance via email or SMS.
                </p>
              </div>
            </div>
          </div>
          
          {/* Chatbot Placeholder */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center bg-white rounded-full shadow-lg px-6 py-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">AI Assistant Coming Soon</span>
            </div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our AI-powered assistant will be available soon to help you with common queries and guide you through our services.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;