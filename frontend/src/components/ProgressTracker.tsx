'use client';

import React, { useState, useEffect } from 'react';

const ProgressTracker = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  const steps = [
    { id: 1, title: "Application Submitted", description: "Your application has been received", completed: true },
    { id: 2, title: "Documents Verified", description: "All documents have been checked", completed: true },
    { id: 3, title: "Under Review", description: "Officials are reviewing your application", completed: false },
    { id: 4, title: "Approved", description: "Application approved and processed", completed: false },
    { id: 5, title: "Document Ready", description: "Approval document is ready", completed: false }
  ];

  // Simulate progress through all steps smoothly
  useEffect(() => {
    // Auto-progress through all steps
    if (activeStep < steps.length) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [activeStep, steps.length]);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Application Progress Tracker</h2>
            <p className="text-gray-600 text-sm sm:text-base px-2">
              Track the real-time status of your application with our interactive progress tracker
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl p-5 sm:p-6 md:p-8 shadow-soft">
            <div className="relative">
              {/* Progress line - responsive */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0"></div>
              <div 
                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 z-10 transition-all duration-1000" 
                style={{ width: `${(activeStep - 1) * 25}%` }}
              ></div>
              
              <div className="relative z-20 flex justify-between">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center flex-1 px-0.5 sm:px-1">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                      step.completed || step.id <= activeStep
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}>
                      {step.completed || step.id < activeStep ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.id === activeStep ? (
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white animate-pulse"></div>
                      ) : (
                        <span className="font-bold text-xs sm:text-sm">{step.id}</span>
                      )}
                    </div>
                    <span className={`text-[9px] sm:text-[10px] sm:text-xs md:text-sm font-medium text-center px-1 transition-colors duration-500 ${
                      step.completed || step.id <= activeStep
                        ? 'text-emerald-700'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    <span className={`text-[7px] sm:text-[9px] md:text-xs text-center mt-1 transition-colors duration-500 hidden sm:block ${
                      step.completed || step.id <= activeStep
                        ? 'text-emerald-600'
                        : 'text-gray-400'
                    }`}>
                      {step.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-10 sm:mt-12 md:mt-16 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-soft">
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-5">
                <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4 text-center md:text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    {steps[activeStep - 1]?.title || "Application Status"}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {steps[activeStep - 1]?.description || "Your application is being processed"}
                  </p>
                  <div className="mt-3 sm:mt-4">
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-600 mr-1.5 sm:mr-2"></span>
                      {activeStep === steps.length ? "Process Complete" : "In Progress"}
                    </span>
                  </div>
                  {/* Show completion message when process is finished */}
                  {activeStep === steps.length && (
                    <div className="mt-4 sm:mt-5 text-center">
                      <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm sm:text-base">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Process Completed Successfully
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 px-2">
                        The application process is now complete. This demonstrates the full workflow of our web application.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressTracker;