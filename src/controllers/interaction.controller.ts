import { Request, Response } from 'express';
import { prisma } from '../db/prismaClient';

export const getAllInteractions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { clientId, projectId } = req.query;

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

    const interactions = await prisma.interaction.findMany({
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
      orderBy: { date: 'desc' },
    });

    res.status(200).json({
      message: 'Interactions retrieved successfully',
      interactions,
    });
  } catch (error) {
    console.error('Get all interactions error:', error);
    res.status(500).json({ message: 'Server error retrieving interactions' });
  }
};

export const getInteractionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const interaction = await prisma.interaction.findFirst({
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

    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    res.status(200).json({
      message: 'Interaction retrieved successfully',
      interaction,
    });
  } catch (error) {
    console.error('Get interaction by ID error:', error);
    res.status(500).json({ message: 'Server error retrieving interaction' });
  }
};

export const createInteraction = async (req: Request, res: Response) => {
  try {
    const { date, type, notes, clientId, projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!clientId && !projectId) {
      return res.status(400).json({
        message: 'Either clientId or projectId must be provided',
      });
    }

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

    const newInteraction = await prisma.interaction.create({
      data: {
        date: date ? new Date(date) : new Date(),
        type,
        notes,
        clientId,
        projectId,
        userId,
      },
    });

    res.status(201).json({
      message: 'Interaction created successfully',
      interaction: newInteraction,
    });
  } catch (error) {
    console.error('Create interaction error:', error);
    res.status(500).json({ message: 'Server error creating interaction' });
  }
};

export const updateInteraction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, type, notes, clientId, projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const existingInteraction = await prisma.interaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingInteraction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

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

    const updatedInteraction = await prisma.interaction.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        type,
        notes,
        clientId,
        projectId,
      },
    });

    res.status(200).json({
      message: 'Interaction updated successfully',
      interaction: updatedInteraction,
    });
  } catch (error) {
    console.error('Update interaction error:', error);
    res.status(500).json({ message: 'Server error updating interaction' });
  }
};

export const deleteInteraction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const existingInteraction = await prisma.interaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingInteraction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    await prisma.interaction.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Interaction deleted successfully',
    });
  } catch (error) {
    console.error('Delete interaction error:', error);
    res.status(500).json({ message: 'Server error deleting interaction' });
  }
};
