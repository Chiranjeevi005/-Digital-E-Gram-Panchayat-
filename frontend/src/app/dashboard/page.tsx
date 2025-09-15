import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">My Services</h2>
            <p className="text-gray-600">View and track your service requests</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Grievances</h2>
            <p className="text-gray-600">File and track your complaints</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Schemes</h2>
            <p className="text-gray-600">Apply for government schemes</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;