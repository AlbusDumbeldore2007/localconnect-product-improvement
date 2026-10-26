import React, { useState } from 'react';
import { Calendar, MapPin, User, Users, Check } from 'lucide-react';

const EventCard = ({ event, onRsvp }) => {
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [localAttendees, setLocalAttendees] = useState(event.attendees || 0);

  const handleRsvpClick = async () => {
    if (hasRsvpd) return;
    setHasRsvpd(true);
    setLocalAttendees(prev => prev + 1);
    if (onRsvp) {
      await onRsvp(event.id);
    }
  };

  const getCategoryClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'cleanup': return 'category-cleanup';
      case 'social': return 'category-social';
      case 'meeting': return 'category-meeting';
      case 'sports': return 'category-sports';
      default: return 'category-general';
    }
  };

  return (
    <div className="card event-card">
      <div className="card-header">
        <span className={`badge category-badge ${getCategoryClass(event.category)}`}>
          {event.category || 'Community'}
        </span>
        <span className="attendees-count">
          <Users size={15} style={{ marginRight: '4px' }} />
          <strong>{localAttendees}</strong> attending
        </span>
      </div>

      <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
        {event.title}
      </h3>

      <div className="event-meta">
        <div className="meta-item">
          <Calendar size={16} className="meta-icon" />
          <span>{event.date}</span>
        </div>
        <div className="meta-item">
          <MapPin size={16} className="meta-icon" />
          <span>{event.location}</span>
        </div>
        <div className="meta-item">
          <User size={16} className="meta-icon" />
          <span>Hosted by <strong>{event.organizer || 'Neighbor'}</strong></span>
        </div>
      </div>

      {event.description && (
        <p className="card-description" style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
          {event.description}
        </p>
      )}

      <div className="card-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto' }}>
        <button
          onClick={handleRsvpClick}
          className={`btn-rsvp ${hasRsvpd ? 'btn-rsvpd' : ''}`}
          disabled={hasRsvpd}
        >
          {hasRsvpd ? (
            <>
              <Check size={16} style={{ marginRight: '6px' }} />
              RSVP Confirmed
            </>
          ) : (
            'RSVP / Join Event'
          )}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
