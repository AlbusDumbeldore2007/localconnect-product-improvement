import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMetrics, getEvents, getPosts, getIssues } from '../services/api';
import { MessageSquare, AlertCircle, Calendar, HeartHandshake, ArrowRight, PlusCircle, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalPosts: 0,
    totalIssues: 0,
    openIssues: 0,
    resolvedIssues: 0,
    totalEvents: 0,
    totalRecommendations: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, eventsRes, postsRes, issuesRes] = await Promise.all([
          getMetrics().catch(() => ({ data: {} })),
          getEvents().catch(() => ({ data: [] })),
          getPosts().catch(() => ({ data: [] })),
          getIssues().catch(() => ({ data: [] }))
        ]);

        if (metricsRes.data) setMetrics(metricsRes.data);
        if (eventsRes.data) setUpcomingEvents(eventsRes.data.slice(0, 2));
        if (postsRes.data) setRecentPosts(postsRes.data.slice(0, 2));
        if (issuesRes.data) setRecentIssues(issuesRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="hero-section" style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Welcome to LocalConnect</h1>
        <p className="card-description" style={{ fontSize: '1.15rem', maxWidth: '650px' }}>
          Your neighborhood's digital front porch. Connect with nearby residents, coordinate community events, report issues, and discover trusted local recommendations.
        </p>
      </div>

      {/* Community Quick Stats */}
      <div className="metrics-grid" style={{ marginBottom: '2.5rem' }}>
        <Link to="/feed" style={{ textDecoration: 'none' }}>
          <div className="metric-card community-metric-card">
            <div className="metric-header-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>
              <MessageSquare size={22} />
            </div>
            <span className="metric-value">{metrics.totalPosts || 0}</span>
            <span className="metric-label">Announcements Shared</span>
          </div>
        </Link>

        <Link to="/issues" style={{ textDecoration: 'none' }}>
          <div className="metric-card community-metric-card">
            <div className="metric-header-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
              <AlertCircle size={22} />
            </div>
            <span className="metric-value">{metrics.openIssues ?? (metrics.totalIssues || 0)}</span>
            <span className="metric-label">Active Issues / Alerts</span>
          </div>
        </Link>

        <Link to="/events" style={{ textDecoration: 'none' }}>
          <div className="metric-card community-metric-card">
            <div className="metric-header-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Calendar size={22} />
            </div>
            <span className="metric-value">{metrics.totalEvents || 0}</span>
            <span className="metric-label">Upcoming Community Events</span>
          </div>
        </Link>

        <Link to="/recommendations" style={{ textDecoration: 'none' }}>
          <div className="metric-card community-metric-card">
            <div className="metric-header-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
              <HeartHandshake size={22} />
            </div>
            <span className="metric-value">{metrics.totalRecommendations || 0}</span>
            <span className="metric-label">Trusted Recommendations</span>
          </div>
        </Link>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>Quick Actions for Residents</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to="/feed" className="quick-action-btn">
            <MessageSquare size={18} />
            <span>Post Update</span>
          </Link>
          <Link to="/issues" className="quick-action-btn">
            <AlertCircle size={18} />
            <span>Report Issue</span>
          </Link>
          <Link to="/events" className="quick-action-btn">
            <Calendar size={18} />
            <span>Plan an Event</span>
          </Link>
          <Link to="/recommendations" className="quick-action-btn">
            <HeartHandshake size={18} />
            <span>Share Service</span>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Events & Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Upcoming Events Column */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} style={{ color: '#6366f1' }} />
              Happening Soon
            </h2>
            <Link to="/events" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>No upcoming events scheduled yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingEvents.map(evt => (
                <div key={evt.id} className="preview-item">
                  <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{evt.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '1rem' }}>
                    <span>{evt.date}</span>
                    <span>• {evt.attendees || 0} attending</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Announcements Column */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} style={{ color: '#6366f1' }} />
              Latest Announcements
            </h2>
            <Link to="/feed" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View feed <ArrowRight size={14} />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>No announcements posted yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentPosts.map(post => (
                <div key={post.id} className="preview-item">
                  <p style={{ margin: '0 0 0.35rem', color: '#1e293b', fontSize: '0.95rem' }}>{post.content}</p>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Community Issues Overview */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Neighborhood Issues & Infrastructure</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
              Track municipal and neighborhood maintenance matters reported by neighbors.
            </p>
          </div>
          <Link to="/issues" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            Report Issue
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {recentIssues.map(issue => (
            <div key={issue.id} className="preview-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{issue.title}</span>
                <span className={`badge ${issue.status === 'RESOLVED' ? 'status-green' : issue.status === 'IN_PROGRESS' ? 'status-yellow' : 'status-red'}`}>
                  {issue.status}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {issue.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
