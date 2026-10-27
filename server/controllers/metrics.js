const prisma = require('../prismaClient');

exports.getMetrics = async (req, res) => {
  try {
    const totalPosts = await prisma.post.count();
    const totalIssues = await prisma.issue.count();
    const openIssues = await prisma.issue.count({
      where: { status: 'OPEN' }
    });
    const resolvedIssues = await prisma.issue.count({
      where: { status: 'RESOLVED' }
    });
    const totalEvents = await prisma.event.count();
    const totalRecommendations = await prisma.recommendation.count();

    res.json({
      totalPosts,
      totalIssues,
      openIssues,
      resolvedIssues,
      totalEvents,
      totalRecommendations
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch community metrics' });
  }
};
