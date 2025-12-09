import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const story = await prisma.story.findUnique({
        where: { id },
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
      });

      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }

      // Check access permissions
      const userRole = session.user.role;
      if (
        userRole === 'REPORTER' &&
        story.userId !== session.user.id
      ) {
        return res.status(403).json({
          message: 'You do not have access to this story'
        });
      }

      return res.status(200).json({ story });
    } catch (error) {
      console.error('Error fetching story:', error);
      return res.status(500).json({
        message: 'Error fetching story',
        error: error.message,
      });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const story = await prisma.story.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }

      const {
        action,
        feedback,
        headline,
        pitch,
        character,
        accountabilityAngle,
        publicInterest,
        aiAnalysis,
      } = req.body;

      // Handle review actions (approve, needs_work, kill)
      if (action) {
        const userRole = session.user.role;
        const currentLevel = story.currentLevel;

        // Validate that user can review at this level
        if (
          (currentLevel === 2 && userRole !== 'EXECUTIVE_PRODUCER') ||
          (currentLevel === 3 && userRole !== 'NEWS_DIRECTOR')
        ) {
          return res.status(403).json({
            message: 'You do not have permission to review this story'
          });
        }

        let updateData = {};
        let levelHistoryData = {
          level: currentLevel,
          feedback: feedback || '',
          timeSpent: '0 hours',
        };

        if (action === 'approve') {
          if (currentLevel === 3) {
            // Final approval by News Director
            updateData = {
              status: 'APPROVED',
              currentLevel: 3,
            };
            levelHistoryData.status = 'approved';
          } else {
            // Move to next level
            updateData = {
              status: 'PENDING',
              currentLevel: currentLevel + 1,
            };
            levelHistoryData.status = 'approved';
          }
        } else if (action === 'needs_work') {
          updateData = {
            status: 'NEEDS_DEVELOPMENT',
            currentLevel: 1,
          };
          levelHistoryData.status = 'needs_development';
        } else if (action === 'kill') {
          updateData = {
            status: 'KILLED',
          };
          levelHistoryData.status = 'killed';
        } else {
          return res.status(400).json({ message: 'Invalid action' });
        }

        const updatedStory = await prisma.story.update({
          where: { id },
          data: {
            ...updateData,
            levelHistory: {
              create: levelHistoryData,
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
            levelHistory: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });

        return res.status(200).json({
          message: 'Story updated successfully',
          story: updatedStory,
        });
      }

      // Handle regular updates (reporter editing their story)
      if (story.userId !== session.user.id) {
        return res.status(403).json({
          message: 'You can only edit your own stories'
        });
      }

      const updateData = {};
      if (headline) updateData.headline = headline;
      if (pitch) updateData.pitch = pitch;
      if (character) updateData.character = character;
      if (accountabilityAngle) updateData.accountabilityAngle = accountabilityAngle;
      if (publicInterest) updateData.publicInterest = publicInterest;

      // Handle AI analysis results
      if (aiAnalysis) {
        if (aiAnalysis.newsValue) updateData.newsValue = aiAnalysis.newsValue;
        if (aiAnalysis.urgencyScore) updateData.urgencyScore = aiAnalysis.urgencyScore;
        if (aiAnalysis.impact) updateData.impact = aiAnalysis.impact;
        if (aiAnalysis.competitorRisk) updateData.competitorStatus = aiAnalysis.competitorRisk;
        if (aiAnalysis.suggestions) updateData.aiInsights = aiAnalysis.suggestions;
        if (aiAnalysis.resourcesNeeded) updateData.resources = aiAnalysis.resourcesNeeded;
        if (aiAnalysis.documentsNeeded) updateData.documentsNeeded = aiAnalysis.documentsNeeded;
      }

      const updatedStory = await prisma.story.update({
        where: { id },
        data: updateData,
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
      });

      return res.status(200).json({
        message: 'Story updated successfully',
        story: updatedStory,
      });
    } catch (error) {
      console.error('Error updating story:', error);
      return res.status(500).json({
        message: 'Error updating story',
        error: error.message,
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const story = await prisma.story.findUnique({
        where: { id },
      });

      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }

      // Only allow story owner or News Director to delete
      if (
        story.userId !== session.user.id &&
        session.user.role !== 'NEWS_DIRECTOR'
      ) {
        return res.status(403).json({
          message: 'You do not have permission to delete this story'
        });
      }

      await prisma.story.delete({
        where: { id },
      });

      return res.status(200).json({
        message: 'Story deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting story:', error);
      return res.status(500).json({
        message: 'Error deleting story',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
