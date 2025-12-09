import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { status, currentLevel } = req.query;
      const userRole = session.user.role;

      // Build filter based on user role
      let where = {};

      // Reporters only see their own stories
      if (userRole === 'REPORTER') {
        where.userId = session.user.id;
      }

      // Executive Producers see stories at their level
      if (userRole === 'EXECUTIVE_PRODUCER' && !status && !currentLevel) {
        where.currentLevel = 2;
        where.status = 'PENDING';
      }

      // News Directors see stories at their level
      if (userRole === 'NEWS_DIRECTOR' && !status && !currentLevel) {
        where.currentLevel = 3;
        where.status = 'PENDING';
      }

      // Apply additional filters if provided
      if (status) {
        where.status = status;
      }
      if (currentLevel) {
        where.currentLevel = parseInt(currentLevel);
      }

      const stories = await prisma.story.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              jobTitle: true,
            },
          },
          levelHistory: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json({ stories });
    } catch (error) {
      console.error('Error fetching stories:', error);
      return res.status(500).json({
        message: 'Error fetching stories',
        error: error.message,
      });
    }
  }

  if (req.method === 'POST') {
    try {
      // Only reporters can create new stories
      if (session.user.role !== 'REPORTER') {
        return res.status(403).json({
          message: 'Only reporters can submit new stories'
        });
      }

      const {
        headline,
        pitch,
        character,
        accountabilityAngle,
        publicInterest,
      } = req.body;

      // Validation
      if (!headline || !pitch) {
        return res.status(400).json({
          message: 'Headline and pitch are required'
        });
      }

      // Create story with pending status at level 2 (Executive Producer)
      const story = await prisma.story.create({
        data: {
          headline,
          pitch,
          character: character || '',
          accountabilityAngle: accountabilityAngle || '',
          publicInterest: publicInterest || '',
          status: 'PENDING',
          currentLevel: 2,
          userId: session.user.id,
          daysInPipeline: 0,
          levelHistory: {
            create: {
              level: 1,
              status: 'submitted',
              feedback: 'Story submitted by reporter',
              timeSpent: '0 hours',
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              jobTitle: true,
            },
          },
          levelHistory: true,
        },
      });

      return res.status(201).json({
        message: 'Story created successfully',
        story,
      });
    } catch (error) {
      console.error('Error creating story:', error);
      return res.status(500).json({
        message: 'Error creating story',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
