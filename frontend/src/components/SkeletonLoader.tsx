import React from 'react';
import { HeroSectionSkeleton } from './HeroSection';
import { NavbarSkeleton } from './Navbar';

interface SkeletonLoaderProps {
  minHeight?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ minHeight = 'min-h-screen' }) => {
  return (
    <div className={`${minHeight} flex flex-col bg-gradient-to-b from-sky-50 to-white`}>
      {/* Navbar Skeleton */}
      <NavbarSkeleton />
      
      <main className="flex-grow pt-16">
        {/* Hero Section Skeleton */}
        <HeroSectionSkeleton />
        
        {/* Track Application Skeleton */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-8 animate-pulse">
                <div className="text-center mb-8">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 w-64 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="h-4 w-80 bg-gray-200 rounded mx-auto"></div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                  
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Progress Tracker Skeleton */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="h-6 w-80 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
              
              <div className="bg-gray-100 rounded-2xl p-8 animate-pulse">
                <div className="flex justify-between mb-8">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mb-2"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="md:w-3/4 text-center md:text-left">
                      <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-80 bg-gray-200 rounded"></div>
                      <div className="mt-4 h-6 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Key Services Skeleton */}
        <section className="py-16 bg-gradient-to-b from-white to-sky-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="h-6 w-64 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((item) => (
                <div 
                  key={item} 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-soft animate-pulse"
                >
                  <div className="h-12 w-12 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-6"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Announcements Skeleton */}
        <section className="py-16 bg-gradient-radial">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="h-6 w-56 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-80 bg-gray-200 rounded mx-auto animate-pulse"></div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
                <div className="p-0.5 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="hidden md:block md:w-1/3 md:pr-4 md:border-r border-gray-200">
                        <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:w-2/3">
                        <div className="flex justify-between mb-4">
                          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-6 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
                        <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-gray-200 rounded mb-6 animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Citizen Stories Skeleton */}
        <section className="py-20 bg-gradient-to-r from-emerald-50 to-sky-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="h-6 w-64 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-soft-lg p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 rounded-full -translate-y-10 translate-x-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gray-100 rounded-full translate-y-8 -translate-x-8 animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 shadow-inner animate-pulse">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-7xl mb-4 opacity-70">❝</div>
                      <div className="max-w-3xl">
                        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-4/5 bg-gray-200 rounded mb-8 mx-auto"></div>
                        
                        <div className="bg-white rounded-lg p-6 shadow-soft max-w-md mx-auto">
                          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                          <div className="h-6 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-10">
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex space-x-2">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer Skeleton */}
      <div className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="h-6 w-48 bg-gray-700 rounded mb-4 animate-pulse"></div>
              <div className="h-4 w-full bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
            </div>
            {[1, 2, 3].map((item) => (
              <div key={item}>
                <div className="h-5 w-24 bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((link) => (
                    <div key={link} className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <div className="h-4 w-64 bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;