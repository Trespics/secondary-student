import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StudentPortalLayout from "@/components/StudentPortalLayout";
import api from "@/lib/api";
import { Bell, Loader2, CheckCircle, User } from "lucide-react";
import "../styles/Notifications.css";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/student/notifications");
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <StudentPortalLayout>
        <div className="notifications-loading">
          <Loader2 className="loading-spinner" />
        </div>
      </StudentPortalLayout>
    );
  }

  return (
    <StudentPortalLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="notifications-container"
      >
        <div className="notifications-header">
          <h1 className="notifications-title">
            <Bell className="title-icon" />
            Notifications
          </h1>
          <p className="notifications-subtitle">
            Stay updated with the latest announcements and alerts.
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <CheckCircle className="empty-icon" />
            <h3 className="empty-title">All caught up!</h3>
            <p className="empty-description">
              No notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification: any, index: number) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`notification-card ${
                  !notification.is_read ? "notification-unread" : ""
                }`}
              >
                <div
                  className={`notification-icon ${
                    !notification.is_read ? "icon-unread" : ""
                  }`}
                >
                  <Bell
                    size={18}
                    className={!notification.is_read ? "icon-unread-bell" : ""}
                  />
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <span className="notification-date">
                      {new Date(notification.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-footer">
                    {notification.sender_name && (
                      <span className="sender-badge">
                        <User size={12} />
                        {notification.sender_name}
                      </span>
                    )}
                    {notification.type && (
                      <span className={`type-badge type-${notification.type.toLowerCase()}`}>
                        {notification.type}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </StudentPortalLayout>
  );
};

export default StudentNotifications;