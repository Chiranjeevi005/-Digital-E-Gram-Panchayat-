import React from 'react';
import Link from 'next/link';
import OptimizedIcon from './OptimizedIcon';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white pt-12 pb-6 sm:pt-16 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 sm:mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">DP</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400">Digital e-Gram Panchayat</h3>
            </div>
            <p className="text-gray-300 mb-5 sm:mb-6 text-sm sm:text-base max-w-md">
              Empowering villages through digital governance for a transparent and efficient administration. Bridging the gap between citizens and government services.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                <span className="sr-only">Facebook</span>
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Facebook" 
                  width={24} 
                  height={24} 
                  className="h-5 w-5 sm:h-6 sm:w-6" 
                />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <span className="sr-only">Twitter</span>
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Twitter" 
                  width={24} 
                  height={24} 
                  className="h-5 w-5 sm:h-6 sm:w-6" 
                />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="WhatsApp">
                <span className="sr-only">WhatsApp</span>
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="WhatsApp" 
                  width={24} 
                  height={24} 
                  className="h-5 w-5 sm:h-6 sm:w-6" 
                />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="YouTube">
                <span className="sr-only">YouTube</span>
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="YouTube" 
                  width={24} 
                  height={24} 
                  className="h-5 w-5 sm:h-6 sm:w-6" 
                />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5 sm:mb-6 text-emerald-400">Contact Us</h3>
            <address className="not-italic text-gray-300 space-y-3">
              <div className="flex items-start">
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Location" 
                  width={20} 
                  height={20} 
                  className="w-5 h-5 mr-3 text-emerald-400 flex-shrink-0 mt-0.5" 
                />
                <span className="text-sm sm:text-base">Gram Panchayat Office, Main Road, Village Name, District, State - 123456</span>
              </div>
              <div className="flex items-center">
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Email" 
                  width={20} 
                  height={20} 
                  className="w-5 h-5 mr-3 text-emerald-400 flex-shrink-0" 
                />
                <span className="text-sm sm:text-base">info@digitalgrampanchayat.gov.in</span>
              </div>
              <div className="flex items-center">
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Phone" 
                  width={20} 
                  height={20} 
                  className="w-5 h-5 mr-3 text-emerald-400 flex-shrink-0" 
                />
                <span className="text-sm sm:text-base">+91 12345 67890</span>
              </div>
            </address>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5 sm:mb-6 text-emerald-400">Quick Navigation</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors flex items-center text-sm sm:text-base">
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Home" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 mr-2 flex-shrink-0" 
                />
                Home
              </Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors flex items-center text-sm sm:text-base">
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Services" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 mr-2 flex-shrink-0" 
                />
                Services
              </Link></li>
              <li><Link href="/schemes" className="text-gray-300 hover:text-white transition-colors flex items-center text-sm sm:text-base">
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Schemes" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 mr-2 flex-shrink-0" 
                />
                Schemes
              </Link></li>
              <li><Link href="/grievances" className="text-gray-300 hover:text-white transition-colors flex items-center text-sm sm:text-base">
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Grievances" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 mr-2 flex-shrink-0" 
                />
                Grievances
              </Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center text-sm sm:text-base">
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Dashboard" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 mr-2 flex-shrink-0" 
                />
                Dashboard
              </Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center text-sm sm:text-base">
                <OptimizedIcon 
                  src="/globe.svg" 
                  alt="Contact" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 mr-2 flex-shrink-0" 
                />
                Contact
              </Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 sm:pt-8 mt-8 sm:mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Digital e-Gram Panchayat. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors mb-2 md:mb-0">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors mb-2 md:mb-0">Terms of Service</Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors mb-2 md:mb-0">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;