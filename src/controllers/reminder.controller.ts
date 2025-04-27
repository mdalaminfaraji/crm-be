import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllReminders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { clientId, projectId, dueThisWeek } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Build filter conditions
    const whereCondition: any = { userId };

    if (clientId) {
      whereCondition.clientId = clientId;
    }

    if (projectId) {
      whereCondition.projectId = projectId;
    }

    // Filter for reminders due this week
    if (dueThisWeek === 'true') {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      whereCondition.dueDate = {
        gte: today,
        lte: nextWeek,
      };
    }

    const reminders = await prisma.reminder.findMany({
      where: whereCondition,
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    res.status(200).json({
      message: 'Reminders retrieved successfully',
      reminders,
    });
  } catch (error) {
    console.error('Get all reminders error:', error);
    res.status(500).json({ message: 'Server error retrieving reminders' });
  }
};

export const getReminderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const reminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.status(200).json({
      message: 'Reminder retrieved successfully',
      reminder,
    });
  } catch (error) {
    console.error('Get reminder by ID error:', error);
    res.status(500).json({ message: 'Server error retrieving reminder' });
  }
};

export const createReminder = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, completed, clientId, projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate that at least one of clientId or projectId is provided
    if (!clientId && !projectId) {
      return res.status(400).json({
        message: 'Either clientId or projectId must be provided',
      });
    }

    // If clientId is provided, check if client exists and belongs to user
    if (clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
          userId,
        },
      });

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
    }

    // If projectId is provided, check if project exists and belongs to user
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
        },
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
    }

    const newReminder = await prisma.reminder.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        completed: completed || false,
        clientId,
        projectId,
        userId,
      },
    });

    res.status(201).json({
      message: 'Reminder created successfully',
      reminder: newReminder,
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: 'Server error creating reminder' });
  }
};

export const updateReminder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed, clientId, projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if reminder exists and belongs to user
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // If clientId is provided, check if client exists and belongs to user
    if (clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
          userId,
        },
      });

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
    }

    // If projectId is provided, check if project exists and belongs to user
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
        },
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
    }

    // Update reminder
    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        completed,
        clientId,
        projectId,
      },
    });

    res.status(200).json({
      message: 'Reminder updated successfully',
      reminder: updatedReminder,
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ message: 'Server error updating reminder' });
  }
};

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if reminder exists and belongs to user
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Delete reminder
    await prisma.reminder.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Reminder deleted successfully',
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ message: 'Server error deleting reminder' });
  }
};
