const prisma = require('../prismaClient');

exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await prisma.recommendation.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};

exports.createRecommendation = async (req, res) => {
  try {
    const { title, category, description, contact, recommendedBy, rating } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required' });
    }
    const recommendation = await prisma.recommendation.create({
      data: {
        title,
        category,
        description,
        contact: contact || '',
        recommendedBy: recommendedBy || 'Neighbor',
        rating: rating ? parseInt(rating) : 5,
        likes: 1
      }
    });
    res.status(201).json(recommendation);
  } catch (error) {
    console.error('Error creating recommendation:', error);
    res.status(500).json({ error: 'Failed to create recommendation' });
  }
};

exports.likeRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const recommendation = await prisma.recommendation.update({
      where: { id: parseInt(id) },
      data: {
        likes: { increment: 1 }
      }
    });
    res.json(recommendation);
  } catch (error) {
    console.error('Error liking recommendation:', error);
    res.status(500).json({ error: 'Failed to like recommendation' });
  }
};
