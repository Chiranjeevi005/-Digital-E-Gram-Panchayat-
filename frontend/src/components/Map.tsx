'use client';

import React from 'react';

interface MapProps {
  location: string;
  height?: string;
}

const Map: React.FC<MapProps> = ({ location, height = '300px' }) => {
  // Using a generic Indian location (Mumbai) for demonstration
  // In a real application, you would use the actual panchayat coordinates
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.6992355998144!2d72.87582799999999!3d19.076090000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1726596500000!5m2!1sen!2sin`;
  
  // Handle Tailwind responsive height classes
  const getHeight = () => {
    if (height === 'sm:h-80') {
      return '320px'; // Default height for small screens
    }
    return height;
  };
  
  return (
    <div className="rounded-xl overflow-hidden shadow-md w-full">
      <iframe
        src={mapSrc}
        width="100%"
        height={getHeight()}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Location Map"
        className="w-full"
      ></iframe>
    </div>
  );
};

export default Map;