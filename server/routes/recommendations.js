const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendations');

router.get('/', recommendationsController.getRecommendations);
router.post('/', recommendationsController.createRecommendation);
router.post('/:id/like', recommendationsController.likeRecommendation);

module.exports = router;
