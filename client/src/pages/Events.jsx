import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { getEvents, createEvent, rsvpEvent } from '../services/api';
import { Calendar, PlusCircle, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Cleanup', 'Social', 'Meeting', 'Sports', 'General'];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Social');
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !location.trim()) return;

    try {
      setSubmitting(true);
      await createEvent({
        title,
        date,
        location,
        category,
        organizer: organizer || 'Neighbor',
        description
      });
      // Reset form
      setTitle('');
      setDate('');
      setLocation('');
      setOrganizer('');
      setDescription('');
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRsvp = async (id) => {
    try {
      await rsvpEvent(id);
    } catch (error) {
      console.error('Error recording RSVP:', error);
    }
  };

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Community Events</h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
            Discover and coordinate neighborhood gatherings, cleanups, and local activities.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
        >
          <PlusCircle size={18} />
          {showForm ? 'Close Form' : 'Host an Event'}
        </button>
      </div>

      {showForm && (
        <div className="card form-card" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <h2 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} style={{ color: '#6366f1' }} />
            Host a Neighborhood Event
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="field-label">Event Title *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Maple Street Block Potluck"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="field-label">Date & Time *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Saturday, Nov 22 • 3:00 PM"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="field-label">Location / Meeting Point *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Park Pavilion or 104 Oak St"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="field-label">Event Category</label>
                <select
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Social">Social & Gatherings</option>
                  <option value="Cleanup">Park / Block Cleanup</option>
                  <option value="Meeting">Townhall / HOA Meeting</option>
                  <option value="Sports">Sports & Fitness</option>
                  <option value="General">General Activity</option>
                </select>
              </div>
              <div>
                <label className="field-label">Host / Organizer Name</label>
                <input
                  className="input-field"
                  placeholder="Your Name (e.g. Marcus D.)"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="field-label">Event Details & What to Bring</label>
              <textarea
                className="input-field"
                placeholder="Share details about the event, what to bring, food/drink plans, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Publishing...' : 'Publish Event'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="filter-bar" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
          <Filter size={15} /> Filter:
        </span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-pill ${selectedCategory === cat ? 'filter-pill-active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading community events...</p>
      ) : filteredEvents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem' }}>No events found</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            There are currently no events listed under the "{selectedCategory}" category.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Host the First Event
          </button>
        </div>
      ) : (
        <div className="grid">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
