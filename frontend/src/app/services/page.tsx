import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ServiceCard from '../../components/ServiceCard';

const Services = () => {
  const services = [
    {
      title: "Birth Certificate",
      description: "Apply for birth certificate online",
      icon: "👶"
    },
    {
      title: "Death Certificate",
      description: "Apply for death certificate online",
      icon: "⚰️"
    },
    {
      title: "Income Certificate",
      description: "Apply for income certificate",
      icon: "💰"
    },
    {
      title: "Caste Certificate",
      description: "Apply for caste certificate",
      icon: "📜"
    },
    {
      title: "Residence Certificate",
      description: "Apply for residence certificate",
      icon: "🏠"
    },
    {
      title: "Trade License",
      description: "Apply for trade license",
      icon: "📝"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Government Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;