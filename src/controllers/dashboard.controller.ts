import { Request, Response } from 'express';
import { prisma } from '../index';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get total clients count
    const totalClients = await prisma.client.count({
      where: { userId }
    });

    // Get total projects count
    const totalProjects = await prisma.project.count({
      where: { userId }
    });

    // Get projects by status
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      where: { userId },
      _count: true
    });

    // Format projects by status for easier consumption by frontend
    const formattedProjectsByStatus = projectsByStatus.reduce((acc: Record<string, number>, curr: { status: string; _count: number }) => {
      acc[curr.status] = curr._count;
      return acc;
    }, {});

    // Get reminders due this week
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingReminders = await prisma.reminder.findMany({
      where: {
        userId,
        dueDate: {
          gte: today,
          lte: nextWeek
        },
        completed: false
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { dueDate: 'asc' },
      take: 5
    });

    // Get recent interactions
    const recentInteractions = await prisma.interaction.findMany({
      where: { userId },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 5
    });

    // Get projects with upcoming deadlines
    const upcomingDeadlines = await prisma.project.findMany({
      where: {
        userId,
        deadline: {
          gte: today,
          lte: nextWeek
        },
        status: {
          not: 'COMPLETED'
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { deadline: 'asc' },
      take: 5
    });

    res.status(200).json({
      message: 'Dashboard data retrieved successfully',
      dashboardData: {
        totalClients,
        totalProjects,
        projectsByStatus: formattedProjectsByStatus,
        upcomingReminders,
        recentInteractions,
        upcomingDeadlines
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ message: 'Server error retrieving dashboard data' });
  }
};
