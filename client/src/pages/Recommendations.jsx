import React, { useState, useEffect } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import { getRecommendations, createRecommendation, likeRecommendation } from '../services/api';
import { HeartHandshake, PlusCircle, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Gardening', 'Babysitting', 'Home Repair', 'Auto Care', 'Other'];

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [rating, setRating] = useState('5');
  const [contact, setContact] = useState('');
  const [recommendedBy, setRecommendedBy] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data } = await getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      setSubmitting(true);
      await createRecommendation({
        title,
        category,
        rating: parseInt(rating),
        contact,
        recommendedBy: recommendedBy || 'Neighbor',
        description
      });
      // Reset form
      setTitle('');
      setContact('');
      setRecommendedBy('');
      setDescription('');
      setShowForm(false);
      fetchRecommendations();
    } catch (error) {
      console.error('Error creating recommendation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await likeRecommendation(id);
    } catch (error) {
      console.error('Error liking recommendation:', error);
    }
  };

  const filteredRecommendations = selectedCategory === 'All'
    ? recommendations
    : recommendations.filter(r => r.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Local Recommendations</h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
            Discover trusted services, contractors, and local businesses recommended by your neighbors.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
        >
          <PlusCircle size={18} />
          {showForm ? 'Close Form' : 'Recommend a Service'}
        </button>
      </div>

      {showForm && (
        <div className="card form-card" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <h2 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeartHandshake size={20} style={{ color: '#6366f1' }} />
            Recommend a Trusted Local Service
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="field-label">Service / Business Name *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Apex Plumbing & Heating"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="field-label">Category</label>
                <select
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Gardening">Gardening & Landscaping</option>
                  <option value="Babysitting">Babysitting & Childcare</option>
                  <option value="Home Repair">Home Repair / Handyman</option>
                  <option value="Auto Care">Auto Mechanic</option>
                  <option value="Other">Other Service</option>
                </select>
              </div>
              <div>
                <label className="field-label">Your Rating (1-5)</label>
                <select
                  className="input-field"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="5">★★★★★ (5 Stars - Outstanding)</option>
                  <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                  <option value="3">★★★☆☆ (3 Stars - Average)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="field-label">Phone, Email, or Website</label>
                <input
                  className="input-field"
                  placeholder="e.g. (555) 234-8891 or info@apexplumb.com"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Your Name (Recommender)</label>
                <input
                  className="input-field"
                  placeholder="e.g. Sarah J. on Maple St"
                  value={recommendedBy}
                  onChange={(e) => setRecommendedBy(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="field-label">Your Review / Why do you recommend them? *</label>
              <textarea
                className="input-field"
                placeholder="Share your personal experience, pricing fairness, punctuality, and quality of work..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Sharing...' : 'Share Recommendation'}
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

      {/* Recommendations Grid */}
      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading recommendations...</p>
      ) : filteredRecommendations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <HeartHandshake size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem' }}>No recommendations in this category yet</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Know a dependable local provider? Be the first to recommend them!
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Share a Recommendation
          </button>
        </div>
      ) : (
        <div className="grid">
          {filteredRecommendations.map(rec => (
            <RecommendationCard key={rec.id} recommendation={rec} onLike={handleLike} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
