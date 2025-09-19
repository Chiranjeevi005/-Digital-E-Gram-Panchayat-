'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';
import { useToast } from '../../components/ToastContainer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, you would send this data to your backend
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    // In a real app, you would send this data to your backend
    console.log('Changing password:', passwordData);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    showToast('Password changed successfully!', 'success');
  };

  const handleDownloadIDCard = () => {
    // In a real app, you would generate and download the ID card
    showToast('Downloading Citizen ID Card...', 'info');
  };

  const downloadStaffID = async (format: 'pdf' | 'jpg') => {
    // Create a temporary ID card element
    const idCard = document.createElement('div');
    idCard.style.cssText = `
      width: 320px;
      padding: 24px;
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      border-radius: 16px;
      border: 2px solid #93c5fd;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
      position: fixed;
      top: -1000px;
      left: -1000px;
    `;
    
    idCard.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #93c5fd;">
        <div style="display: flex; align-items: center;">
          <div style="background: #3b82f6; border-radius: 50%; padding: 8px; margin-right: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h1 style="font-size: 18px; font-weight: bold; color: #1e40af;">Digital E-Panchayat</h1>
            <p style="font-size: 12px; color: #3b82f6;">Official Staff Identification</p>
          </div>
        </div>
        <div style="background: #3b82f6; color: white; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 4px;">
          OFFICIAL
        </div>
      </div>
      
      <div style="display: flex; justify-content: center; margin-bottom: 16px;">
        <div style="background: #e5e7eb; border: 2px dashed #9ca3af; border-radius: 12px; width: 96px; height: 96px; display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#9ca3af">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      
      <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); margin-bottom: 16px;">
        <div style="text-align: center; margin-bottom: 12px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937;">${user?.name || 'Staff Member'}</h2>
          <p style="font-size: 14px; color: #3b82f6; font-weight: 600;">${user?.userType || 'Staff'}</p>
        </div>
        
        <div style="font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Staff ID:</span>
            <span style="font-weight: 600; color: #1f2937;">${(user?.id && user.id.substring(0, 8).toUpperCase()) || 'N/A'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Email:</span>
            <span style="font-weight: 600; color: #1f2937; max-width: 120px; overflow: hidden; text-overflow: ellipsis;">${user?.email || 'N/A'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Issued:</span>
            <span style="font-weight: 600; color: #1f2937;">${new Date().toLocaleDateString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">Valid Until:</span>
            <span style="font-weight: 600; color: #1f2937;">Dec 31, 2025</span>
          </div>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #9ca3af;">
        <div style="display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" style="margin-right: 4px;">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secure ID</span>
        </div>
        <div>www.epanchayat.gov.in</div>
      </div>
    `;
    
    document.body.appendChild(idCard);
    
    try {
      // Use html2canvas to capture the ID card element
      const canvas = await html2canvas(idCard, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      
      if (format === 'jpg') {
        // Convert to JPG and download
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `staff-id-${user?.id || 'staff'}.jpg`;
        link.click();
      } else {
        // Convert to PDF and download
        const imgWidth = 80;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [imgWidth, imgHeight + 10]
        });
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 5, imgWidth, imgHeight);
        pdf.save(`staff-id-${user?.id || 'staff'}.pdf`);
      }
    } catch (error) {
      console.error('Error generating ID card:', error);
      showToast('Error generating ID card', 'error');
    } finally {
      // Clean up
      document.body.removeChild(idCard);
    }
  };

  // Mock data for administrative reports
  const reportData = {
    performance: {
      'Staff Information': {
        'Staff Name': user?.name || 'N/A',
        'Staff ID': (user?.id && user.id.substring(0, 8).toUpperCase()) || 'N/A',
        'Role': user?.userType || 'N/A',
        'Department': 'Administration',
        'Reporting Period': 'Jan 2025 - Dec 2025'
      },
      'Performance Metrics': {
        'Certificates Processed': '142',
        'Grievances Resolved': '87',
        'Citizen Records Updated': '215',
        'Scheme Applications Reviewed': '96',
        'Average Response Time': '2.3 days'
      },
      'Achievements': {
        'On-time Delivery Rate': '94%',
        'Citizen Satisfaction': '4.7/5.0',
        'Special Recognition': 'Q1 Excellence Award'
      }
    }
  };

  const downloadAdminReport = async (format: 'pdf' | 'jpg') => {
    // Create a temporary report element
    const report = document.createElement('div');
    report.style.cssText = `
      width: 700px;
      padding: 24px;
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
      position: fixed;
      top: -1000px;
      left: -1000px;
    `;
    
    let reportContent = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #3b82f6;">
        <div style="display: flex; align-items: center;">
          <div style="background: #3b82f6; border-radius: 50%; padding: 8px; margin-right: 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 style="font-size: 24px; font-weight: bold; color: #1f2937;">Digital E-Panchayat</h1>
            <p style="font-size: 16px; color: #3b82f6; font-weight: 600;">Staff Performance Report</p>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="background: #dbeafe; color: #1e40af; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; display: inline-block;">
            CONFIDENTIAL
          </div>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Generated: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;
    
    // Add report data sections
    Object.entries(reportData.performance).forEach(([section, data]) => {
      reportContent += `
        <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
          <div style="background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%); padding: 12px 16px;">
            <h2 style="font-size: 18px; font-weight: bold; color: white;">${section}</h2>
          </div>
          <div style="background: #f9fafb; padding: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      `;
      
      Object.entries(data).forEach(([key, value]) => {
        reportContent += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
            <span style="color: #6b7280; font-weight: 600;">${key}</span>
            <span style="color: #1f2937; font-weight: 700;">${String(value)}</span>
          </div>
        `;
      });
      
      reportContent += `
            </div>
          </div>
        </div>
      `;
    });
    
    reportContent += `
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="font-size: 14px; color: #9ca3af;">
          This is an official report generated by Digital E-Panchayat System
        </p>
        <p style="font-size: 12px; color: #d1d5db; margin-top: 4px;">
          For administrative use only. Unauthorized distribution is prohibited.
        </p>
      </div>
    `;
    
    report.innerHTML = reportContent;
    document.body.appendChild(report);
    
    try {
      // Use html2canvas to capture the report element
      const canvas = await html2canvas(report, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      
      if (format === 'jpg') {
        // Convert to JPG and download
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `admin-report-${user?.id || 'staff'}.jpg`;
        link.click();
      } else {
        // Convert to PDF and download
        const imgWidth = 180;
        const pageHeight = 250;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 15, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`admin-report-${user?.id || 'staff'}.pdf`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      showToast('Error generating report', 'error');
    } finally {
      // Clean up
      document.body.removeChild(report);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['Citizen', 'Staff', 'Officer']}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href={`/dashboard/${user.userType.toLowerCase()}`} className="text-emerald-600 hover:text-emerald-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8 text-white">
              <div className="flex flex-col md:flex-row items-center">
                <div className="bg-white rounded-full p-1 mb-4 md:mb-0 md:mr-6">
                  <div className="bg-emerald-100 rounded-full w-24 h-24 flex items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-600">{user.name?.charAt(0)}</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-emerald-100 mt-2">{user.email}</p>
                  <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                    {user.userType}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Full Name</label>
                      <p className="mt-1 text-lg font-medium text-gray-900">{profileData.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email Address</label>
                      <p className="mt-1 text-lg font-medium text-gray-900">{profileData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">User Type</label>
                      <p className="mt-1 text-lg font-medium text-gray-900">{user.userType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">User ID</label>
                      <p className="mt-1 text-lg font-medium text-gray-900">{user.id}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <h3 className="font-medium text-blue-800 mb-2">Note</h3>
                      <p className="text-sm text-blue-700">
                        Additional profile information such as phone number, address, and Aadhaar details 
                        can be added and managed through the respective service applications.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Documents & Downloads</h2>
                {user.userType === 'Citizen' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Citizen ID Card</h3>
                      <p className="text-gray-600 mb-4">Download your official Citizen ID Card with digital signature</p>
                      <button
                        onClick={handleDownloadIDCard}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download ID Card (PDF)
                      </button>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Acknowledgements</h3>
                      <p className="text-gray-600 mb-4">Download acknowledgements for your applications and services</p>
                      <Link href="/services/tracking" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        View Documents
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Staff Identification</h3>
                      <p className="text-gray-600 mb-4">Download your official Staff ID and authorization documents</p>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => downloadStaffID('pdf')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF
                        </button>
                        <button
                          onClick={() => downloadStaffID('jpg')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          JPG
                        </button>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Administrative Reports</h3>
                      <p className="text-gray-600 mb-4">Access your administrative reports and performance documents</p>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => downloadAdminReport('pdf')}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF
                        </button>
                        <button
                          onClick={() => downloadAdminReport('jpg')}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          JPG
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}