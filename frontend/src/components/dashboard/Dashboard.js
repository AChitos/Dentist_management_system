import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import AppointmentChart from './AppointmentChart';
import StatCard from './StatCard';
import AppointmentList from './AppointmentList';
import TopTreatments from './TopTreatments';
import PatientStats from './PatientStats';
import RevenueStats from './RevenueStats';
import ClinicInfo from './ClinicInfo';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/overview');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-20">
        <p className="text-secondary-600">No dashboard data available</p>
      </div>
    );
  }

  const {
    appointmentStats,
    todayAppointments,
    approvalRequests,
    upcomingAppointments,
    clinicInfo,
    topTreatments,
    patientStats,
    revenueStats
  } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-2">
          Good Morning, {user?.full_name?.split(' ')[0] || 'Doctor'}
        </h2>
        <p className="text-secondary-600">Welcome to your dental clinic dashboard</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-soft border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary-900">
                APPOINTMENT STATISTICS
              </h3>
              <div className="flex space-x-2">
                {['Monthly', 'Weekly', '30 Day'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter.toLowerCase().replace(' ', ''))}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      timeFilter === filter.toLowerCase().replace(' ', '')
                        ? 'bg-primary-500 text-white'
                        : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            <AppointmentChart data={appointmentStats} timeFilter={timeFilter} />
          </div>
        </div>

        {/* Right Column - Stats Cards */}
        <div className="space-y-6">
          {/* Approval Requests */}
          <StatCard
            title="Approval Request"
            value={`${approvalRequests} Request Waiting To Approve`}
            icon="approval"
            color="warning"
            showMore={true}
          />

          {/* Upcoming Appointments */}
          <StatCard
            title="Upcoming Appointment"
            value={`${upcomingAppointments}`}
            icon="calendar"
            color="primary"
            showMore={true}
          />

          {/* Clinic Information */}
          <ClinicInfo data={clinicInfo} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-1">
          <AppointmentList 
            appointments={todayAppointments} 
            title="Today's Appointment" 
            count={todayAppointments?.length || 0}
          />
        </div>

        {/* Top Treatments */}
        <div className="lg:col-span-1">
          <TopTreatments treatments={topTreatments} />
        </div>

        {/* Patient & Revenue Stats */}
        <div className="lg:col-span-1 space-y-6">
          <PatientStats data={patientStats} />
          <RevenueStats data={revenueStats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
