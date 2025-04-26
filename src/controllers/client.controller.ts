import { Request, Response } from 'express';
import { prisma } from '../index';

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      message: 'Clients retrieved successfully',
      clients
    });
  } catch (error) {
    console.error('Get all clients error:', error);
    res.status(500).json({ message: 'Server error retrieving clients' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const client = await prisma.client.findFirst({
      where: {
        id,
        userId
      },
      include: {
        projects: true,
        interactions: true,
        reminders: true
      }
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({
      message: 'Client retrieved successfully',
      client
    });
  } catch (error) {
    console.error('Get client by ID error:', error);
    res.status(500).json({ message: 'Server error retrieving client' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        company,
        notes,
        userId
      }
    });

    res.status(201).json({
      message: 'Client created successfully',
      client: newClient
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Server error creating client' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        company,
        notes
      }
    });

    res.status(200).json({
      message: 'Client updated successfully',
      client: updatedClient
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Server error updating client' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Delete client (cascading delete will handle related records)
    await prisma.client.delete({
      where: { id }
    });

    res.status(200).json({
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Server error deleting client' });
  }
};
