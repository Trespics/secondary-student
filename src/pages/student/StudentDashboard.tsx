import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentPortalLayout from "@/components/StudentPortalLayout";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { BookOpen, Bell, ArrowRight, Loader2, Calendar, Shield } from "lucide-react";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, notifRes] = await Promise.all([
          api.get("/student/profile"),
          api.get("/student/notifications"),
        ]);
        setProfile(profileRes.data);
        setNotifications(notifRes.data?.slice(0, 5) || []);
      } catch (err) { console.error("Dashboard fetch error:", err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <StudentPortalLayout>
        <div className="dashboard-loading">
          <Loader2 className="loading-spinner" />
        </div>
      </StudentPortalLayout>
    );
  }

  const stats = [
    { 
      title: "Admission No.", 
      value: profile?.student_details?.student_id || "N/A", 
      icon: Shield, 
      colorClass: "stat-blue",
      description: "Student ID"
    },
    { 
      title: "Class", 
      value: profile?.class_name || "Enrolled", 
      icon: BookOpen, 
      colorClass: "stat-purple",
      description: "Current class"
    },
    { 
      title: "Notifications", 
      value: notifications.length, 
      icon: Bell, 
      colorClass: "stat-orange",
      description: "Unread updates"
    },
    { 
      title: "Member Since", 
      value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }) : "N/A", 
      icon: Calendar, 
      colorClass: "stat-green",
      description: "Join date"
    },
  ];

  return (
    <StudentPortalLayout>
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="welcome-subtitle">
              Here's what's happening with your academic journey today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card ${stat.colorClass}`}>
                <div className="stat-header">
                  <div className="stat-icon-wrapper">
                    <stat.icon className="stat-icon" />
                  </div>
                  <span className="stat-value">{stat.value}</span>
                </div>
                <div className="stat-footer">
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className="stat-description">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Quick Actions Card */}
            {/* <div className="quick-actions-card">
              <div className="quick-actions-header">
                <h2 className="quick-actions-title">Quick Actions</h2>
                <p className="quick-actions-subtitle">Frequently used tools</p>
              </div>
              
              <div className="quick-actions-grid">
                <Link to="/student/profile" className="action-item action-profile">
                  <div className="action-icon-wrapper">
                    <User className="action-icon" />
                  </div>
                  <div className="action-text">
                    <span className="action-label">My Profile</span>
                    <span className="action-description">View and edit profile</span>
                  </div>
                  <ArrowRight className="action-arrow" />
                </Link>

                <Link to="/student/notifications" className="action-item action-notifications">
                  <div className="action-icon-wrapper">
                    <Bell className="action-icon" />
                  </div>
                  <div className="action-text">
                    <span className="action-label">Notifications</span>
                    <span className="action-description">Check updates</span>
                  </div>
                  <ArrowRight className="action-arrow" />
                </Link>

                <Link to="/masomo" className="action-item action-masomo">
                  <div className="action-icon-wrapper">
                    <BookOpen className="action-icon" />
                  </div>
                  <div className="action-text">
                    <span className="action-label">Masomo Portal</span>
                    <span className="action-description">Access learning materials</span>
                  </div>
                  <ArrowRight className="action-arrow" />
                </Link>
              </div>

             
              <div className="quick-stats">
                <div className="quick-stat">
                  <div className="quick-stat-label">Attendance</div>
                  <div className="quick-stat-value">95%</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="quick-stat">
                  <div className="quick-stat-label">Assignments</div>
                  <div className="quick-stat-value">8/10</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Notifications Card */}
            <div className="notifications-card">
              <div className="notifications-header">
                <div className="notifications-title-wrapper">
                  <Bell className="notifications-icon" />
                  <h2 className="notifications-title">Recent Notifications</h2>
                </div>
                <Link to="/student/notifications" className="view-all-link">
                  View All <ArrowRight className="view-all-icon" />
                </Link>
              </div>

              {notifications.length === 0 ? (
                <div className="empty-notifications">
                  <Bell className="empty-icon" />
                  <p className="empty-text">No notifications yet</p>
                  <p className="empty-subtext">We'll notify you when something arrives</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {notifications.map((notification: any) => (
                    <div key={notification.id} className="notification-item">
                      <div className={`notification-indicator ${notification.is_read ? 'read' : 'unread'}`} />
                      <div className="notification-content">
                        <div className="notification-header">
                          <h3 className="notification-title">{notification.title}</h3>
                          <span className="notification-time">
                            {new Date(notification.created_at).toLocaleDateString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="notification-message">{notification.message}</p>
                        {!notification.is_read && (
                          <span className="notification-badge">New</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Tips */}
              <div className="quick-tips">
                <h3 className="quick-tips-title">💡 Quick Tips</h3>
                <ul className="quick-tips-list">
                  <li>Complete your profile to get personalized recommendations</li>
                  <li>Check notifications daily for important updates</li>
                  <li>Visit Masomo Portal for your learning materials</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Upcoming Events Preview */}
          <div className="events-preview">
            <div className="events-preview-header">
              <h3 className="events-preview-title">Upcoming Events</h3>
              <Link to="/student/calendar" className="events-preview-link">
                View Calendar <ArrowRight className="events-preview-icon" />
              </Link>
            </div>
            <div className="events-grid">
              <div className="event-item">
                <div className="event-date">
                  <span className="event-day">15</span>
                  <span className="event-month">MAY</span>
                </div>
                <div className="event-details">
                  <h4 className="event-name">Mid-Term Examinations</h4>
                  <p className="event-info">All subjects • 8:00 AM</p>
                </div>
              </div>
              <div className="event-item">
                <div className="event-date">
                  <span className="event-day">20</span>
                  <span className="event-month">MAY</span>
                </div>
                <div className="event-details">
                  <h4 className="event-name">Science Fair</h4>
                  <p className="event-info">School Hall • 2:00 PM</p>
                </div>
              </div>
              <div className="event-item">
                <div className="event-date">
                  <span className="event-day">25</span>
                  <span className="event-month">MAY</span>
                </div>
                <div className="event-details">
                  <h4 className="event-name">Parent-Teacher Meeting</h4>
                  <p className="event-info">Virtual • 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentPortalLayout>
  );
};

export default StudentDashboard;