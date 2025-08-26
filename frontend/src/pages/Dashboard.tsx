import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Stethoscope,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  // Sample data - in real app, this would come from API
  const stats = [
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'primary',
    },
    {
      title: 'Today\'s Appointments',
      value: '23',
      change: '+5%',
      changeType: 'increase',
      icon: Calendar,
      color: 'success',
    },
    {
      title: 'Active Treatments',
      value: '156',
      change: '-3%',
      changeType: 'decrease',
      icon: Stethoscope,
      color: 'warning',
    },
    {
      title: 'Monthly Revenue',
      value: '$45,230',
      change: '+18%',
      changeType: 'increase',
      icon: CreditCard,
      color: 'accent',
    },
  ];

  const appointmentData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 15, 25, 22, 18, 14],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const treatmentData = {
    labels: ['Preventive', 'Restorative', 'Surgical', 'Orthodontic', 'Cosmetic'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [32000, 35000, 38000, 42000, 45000, 48000],
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment scheduled for Michael Brown',
      time: '2 minutes ago',
      icon: Calendar,
      color: 'success',
    },
    {
      id: 2,
      type: 'patient',
      message: 'New patient Emily Davis registered',
      time: '15 minutes ago',
      icon: Users,
      color: 'primary',
    },
    {
      id: 3,
      type: 'treatment',
      message: 'Treatment completed for David Wilson',
      time: '1 hour ago',
      icon: Stethoscope,
      color: 'warning',
    },
    {
      id: 4,
      type: 'billing',
      message: 'Payment received from Jessica Martinez',
      time: '2 hours ago',
      icon: CreditCard,
      color: 'accent',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-500 text-white';
      case 'success':
        return 'bg-success-500 text-white';
      case 'warning':
        return 'bg-warning-500 text-white';
      case 'accent':
        return 'bg-accent-500 text-white';
      default:
        return 'bg-secondary-500 text-white';
    }
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'increase' ? 'text-success-600' : 'text-error-600';
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">Welcome back! Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-secondary-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-glass-sm border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <div className={`flex items-center space-x-1 ${getChangeColor(stat.changeType)}`}>
                {getChangeIcon(stat.changeType)}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
              <span className="text-xs text-secondary-500 ml-2">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-glass-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Weekly Appointments</h3>
          <div className="h-64">
            <Line
              data={appointmentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Treatment Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-glass-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Treatment Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={treatmentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-glass-sm border border-white/20"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Monthly Revenue</h3>
        <div className="h-64">
          <Bar
            data={revenueData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                  ticks: {
                    callback: (value) => `$${Number(value).toLocaleString()}`,
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-glass-sm border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Recent Activities</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 rounded-xl bg-secondary-50/50 hover:bg-secondary-100/50 transition-colors duration-200"
            >
              <div className={`p-2 rounded-lg ${getColorClasses(activity.color)}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-900">{activity.message}</p>
                <p className="text-xs text-secondary-500">{activity.time}</p>
              </div>
              
              <Activity className="w-4 h-4 text-secondary-400" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
