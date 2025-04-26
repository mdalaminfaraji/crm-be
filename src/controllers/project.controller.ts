import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      message: 'Projects retrieved successfully',
      projects
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ message: 'Server error retrieving projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        interactions: true,
        reminders: true
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      message: 'Project retrieved successfully',
      project
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ message: 'Server error retrieving project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, budget, deadline, status, clientId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if client exists and belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId
      }
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        budget: budget ? parseFloat(budget) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        status: status || 'NOT_STARTED',
        clientId,
        userId
      }
    });

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error creating project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, budget, deadline, status, clientId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If clientId is provided, check if client exists and belongs to user
    if (clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
          userId
        }
      });

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        budget: budget !== undefined ? parseFloat(budget) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        status,
        clientId
      }
    });

    res.status(200).json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error updating project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete project (cascading delete will handle related records)
    await prisma.project.delete({
      where: { id }
    });

    res.status(200).json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
};
