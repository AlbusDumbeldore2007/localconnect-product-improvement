import React, { useState } from 'react';
import { Star, Phone, UserCheck, ThumbsUp } from 'lucide-react';

const RecommendationCard = ({ recommendation, onLike }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(recommendation.likes || 0);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLocalLikes(prev => prev + 1);
    if (onLike) {
      await onLike(recommendation.id);
    }
  };

  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < rating ? '#f59e0b' : 'none'}
        stroke={index < rating ? '#f59e0b' : '#cbd5e1'}
      />
    ));
  };

  return (
    <div className="card recommendation-card">
      <div className="card-header">
        <span className="badge category-badge category-rec">
          {recommendation.category}
        </span>
        <div className="rating-stars" title={`${recommendation.rating || 5} out of 5 stars`}>
          {renderStars(recommendation.rating || 5)}
        </div>
      </div>

      <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
        {recommendation.title}
      </h3>

      <p className="card-description" style={{ margin: '0.5rem 0 1rem' }}>
        "{recommendation.description}"
      </p>

      {recommendation.contact && (
        <div className="rec-contact">
          <Phone size={15} style={{ color: '#6366f1', marginRight: '6px' }} />
          <span>{recommendation.contact}</span>
        </div>
      )}

      <div className="rec-footer">
        <div className="rec-author">
          <UserCheck size={15} style={{ color: '#10b981', marginRight: '6px' }} />
          <span>Recommended by <strong>{recommendation.recommendedBy || 'A Neighbor'}</strong></span>
        </div>

        <button
          onClick={handleLike}
          className={`btn-helpful ${hasLiked ? 'btn-helpful-active' : ''}`}
        >
          <ThumbsUp size={15} style={{ marginRight: '6px' }} />
          Helpful ({localLikes})
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
