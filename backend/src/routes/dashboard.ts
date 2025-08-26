import { Router } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { requireStaff } from '../middleware/auth';

const router = Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', requireStaff, asyncHandler(async (req, res) => {
  try {
    // Get current date and start of month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get total counts
    const [
      totalPatients,
      totalAppointments,
      totalTreatments,
      totalRevenue,
      todayAppointments,
      thisMonthAppointments,
      thisMonthRevenue,
      lowStockItems,
    ] = await Promise.all([
      // Total patients
      prisma.patient.count({ where: { isActive: true } }),
      
      // Total appointments
      prisma.appointment.count(),
      
      // Total treatments
      prisma.treatment.count(),
      
      // Total revenue
      prisma.billing.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      
      // Today's appointments
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(now.setHours(0, 0, 0, 0)),
            lt: new Date(now.setHours(23, 59, 59, 999)),
          },
        },
      }),
      
      // This month's appointments
      prisma.appointment.count({
        where: {
          date: {
            gte: startOfMonth,
            lt: now,
          },
        },
      }),
      
      // This month's revenue
      prisma.billing.aggregate({
        where: {
          status: 'PAID',
          paidDate: {
            gte: startOfMonth,
            lt: now,
          },
        },
        _sum: { amount: true },
      }),
      
      // Low stock items
      prisma.inventory.count({
        where: {
          quantity: {
            lte: prisma.inventory.fields.minQuantity,
          },
          isActive: true,
        },
      }),
    ]);

    // Get appointment status distribution
    const appointmentStatuses = await prisma.appointment.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Get treatment category distribution
    const treatmentCategories = await prisma.treatment.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    // Get recent activities (last 10)
    const recentActivities = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get upcoming appointments (next 7 days)
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: now,
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
      take: 10,
      orderBy: { date: 'asc' },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            patientId: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Calculate growth percentages (comparing to last month)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      lastMonthAppointments,
      lastMonthRevenue,
    ] = await Promise.all([
      prisma.appointment.count({
        where: {
          date: {
            gte: lastMonth,
            lte: lastMonthEnd,
          },
        },
      }),
      prisma.billing.aggregate({
        where: {
          status: 'PAID',
          paidDate: {
            gte: lastMonth,
            lte: lastMonthEnd,
          },
        },
        _sum: { amount: true },
      }),
    ]);

    const appointmentGrowth = lastMonthAppointments > 0 
      ? ((thisMonthAppointments - lastMonthAppointments) / lastMonthAppointments * 100).toFixed(1)
      : 0;

    const revenueGrowth = lastMonthRevenue._sum.amount && lastMonthRevenue._sum.amount > 0
      ? ((thisMonthRevenue._sum.amount - lastMonthRevenue._sum.amount) / lastMonthRevenue._sum.amount * 100).toFixed(1)
      : 0;

    res.json({
      stats: {
        totalPatients,
        totalAppointments,
        totalTreatments,
        totalRevenue: totalRevenue._sum.amount || 0,
        todayAppointments,
        thisMonthAppointments,
        thisMonthRevenue: thisMonthRevenue._sum.amount || 0,
        lowStockItems,
        appointmentGrowth: parseFloat(appointmentGrowth),
        revenueGrowth: parseFloat(revenueGrowth),
      },
      distributions: {
        appointmentStatuses: appointmentStatuses.map(item => ({
          status: item.status,
          count: item._count.status,
        })),
        treatmentCategories: treatmentCategories.map(item => ({
          category: item.category,
          count: item._count.category,
        })),
      },
      recentActivities: recentActivities.map(activity => ({
        id: activity.id,
        action: activity.action,
        tableName: activity.tableName,
        timestamp: activity.timestamp,
        user: activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'Unknown',
      })),
      upcomingAppointments: upcomingAppointments.map(appointment => ({
        id: appointment.id,
        date: appointment.date,
        startTime: appointment.startTime,
        patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        patientId: appointment.patient.patientId,
        doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
        type: appointment.type,
        status: appointment.status,
      })),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard statistics',
      message: 'An error occurred while fetching dashboard data',
    });
  }
}));

// @route   GET /api/dashboard/charts/appointments
// @desc    Get appointment data for charts
// @access  Private
router.get('/charts/appointments', requireStaff, asyncHandler(async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate: Date;
    const now = new Date();
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: now,
        },
      },
      select: {
        date: true,
        status: true,
        type: true,
      },
    });

    // Group by date
    const appointmentsByDate = appointments.reduce((acc, appointment) => {
      const date = appointment.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          total: 0,
          completed: 0,
          cancelled: 0,
          noShow: 0,
        };
      }
      
      acc[date].total++;
      
      switch (appointment.status) {
        case 'COMPLETED':
          acc[date].completed++;
          break;
        case 'CANCELLED':
          acc[date].cancelled++;
          break;
        case 'NO_SHOW':
          acc[date].noShow++;
          break;
      }
      
      return acc;
    }, {} as Record<string, { total: number; completed: number; cancelled: number; noShow: number }>);

    // Fill in missing dates
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const chartData = dates.map(date => ({
      date,
      total: appointmentsByDate[date]?.total || 0,
      completed: appointmentsByDate[date]?.completed || 0,
      cancelled: appointmentsByDate[date]?.cancelled || 0,
      noShow: appointmentsByDate[date]?.noShow || 0,
    }));

    res.json({ chartData });
  } catch (error) {
    console.error('Appointments chart error:', error);
    res.status(500).json({
      error: 'Failed to fetch appointments chart data',
      message: 'An error occurred while fetching chart data',
    });
  }
}));

// @route   GET /api/dashboard/charts/revenue
// @desc    Get revenue data for charts
// @access  Private
router.get('/charts/revenue', requireStaff, asyncHandler(async (req, res) => {
  try {
    const { period = '6m' } = req.query;
    
    let months: number;
    switch (period) {
      case '3m':
        months = 3;
        break;
      case '6m':
        months = 6;
        break;
      case '12m':
        months = 12;
        break;
      default:
        months = 6;
    }

    const revenueData = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthRevenue = await prisma.billing.aggregate({
        where: {
          status: 'PAID',
          paidDate: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: { amount: true },
      });

      revenueData.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        year: monthStart.getFullYear(),
        revenue: monthRevenue._sum.amount || 0,
      });
    }

    res.json({ revenueData });
  } catch (error) {
    console.error('Revenue chart error:', error);
    res.status(500).json({
      error: 'Failed to fetch revenue chart data',
      message: 'An error occurred while fetching chart data',
    });
  }
}));

// @route   GET /api/dashboard/charts/treatments
// @desc    Get treatment data for charts
// @access  Private
router.get('/charts/treatments', requireStaff, asyncHandler(async (req, res) => {
  try {
    const treatments = await prisma.treatment.groupBy({
      by: ['category', 'status'],
      _count: { id: true },
    });

    const treatmentData = treatments.reduce((acc, treatment) => {
      if (!acc[treatment.category]) {
        acc[treatment.category] = {
          planned: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
        };
      }
      
      switch (treatment.status) {
        case 'PLANNED':
          acc[treatment.category].planned += treatment._count.id;
          break;
        case 'IN_PROGRESS':
          acc[treatment.category].inProgress += treatment._count.id;
          break;
        case 'COMPLETED':
          acc[treatment.category].completed += treatment._count.id;
          break;
        case 'CANCELLED':
          acc[treatment.category].cancelled += treatment._count.id;
          break;
      }
      
      return acc;
    }, {} as Record<string, { planned: number; inProgress: number; completed: number; cancelled: number }>);

    res.json({ treatmentData });
  } catch (error) {
    console.error('Treatments chart error:', error);
    res.status(500).json({
      error: 'Failed to fetch treatments chart data',
      message: 'An error occurred while fetching chart data',
    });
  }
}));

export default router;
