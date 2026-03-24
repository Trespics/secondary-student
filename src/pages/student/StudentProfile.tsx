import React, { useState, useEffect } from "react";
import StudentPortalLayout from "@/components/StudentPortalLayout";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { User, MapPin, Shield, Save, Calendar, Lock, Loader2 } from "lucide-react";
import "../styles/StudentProfile.css";

const StudentProfile = () => {
  useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    dob: "", 
    gender: "", 
    parent_name: "", 
    parent_phone: "", 
    address: "" 
  });
  const [pwForm, setPwForm] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [changingPw, setChangingPw] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/student/profile");
      setProfile(data);
      setForm({
        name: data.name || "", 
        phone: data.phone || "",
        dob: data.student_details?.dob || "", 
        gender: data.student_details?.gender || "",
        parent_name: data.student_details?.parent_name || "",
        parent_phone: data.student_details?.parent_phone || "",
        address: data.student_details?.address || "",
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setSaving(true);
    try {
      await api.put("/student/profile", form);
      showToast("Profile updated successfully!", "success");
      fetchProfile();
    } catch (err: any) { 
      showToast(err.response?.data?.error || "Update failed", "error");
    }
    finally { setSaving(false); }
  };

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { 
      showToast("Passwords don't match", "error"); 
      return; 
    }
    setChangingPw(true);
    try {
      await api.post("/auth/change-password", { 
        currentPassword: pwForm.currentPassword, 
        newPassword: pwForm.newPassword 
      });
      showToast("Password changed successfully!", "success"); 
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) { 
      showToast(err.response?.data?.error || "Failed to change password", "error");
    }
    finally { setChangingPw(false); }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // You can implement your own toast notification here
    // For now, we'll use alert as a placeholder
    if (type === 'success') {
      alert(message);
    } else {
      alert(message);
    }
  };

  if (loading) {
    return (
      <StudentPortalLayout>
        <div className="profile-loading">
          <Loader2 className="loading-spinner" />
        </div>
      </StudentPortalLayout>
    );
  }

  return (
    <StudentPortalLayout>
      <div className="profile-container">
        <div className="profile-content">
          {/* Header */}
          <div className="profile-header">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">
              Manage your personal information and security settings.
            </p>
          </div>

          {/* Main Grid */}
          <div className="profile-grid">
            {/* Left Column - ID Card */}
            <div className="profile-left">
              {/* Student ID Card */}
              <div className="student-id-card">
                <div className="id-card-bg"></div>
                <div className="id-card-content">
                  <div className="avatar-container">
                    <div className="avatar-wrapper">
                      <span className="avatar-initials">
                        {profile?.name?.charAt(0) || 'S'}
                      </span>
                    </div>
                  </div>
                  <h2 className="student-name">{profile?.name || 'Student Name'}</h2>
                  <div className="student-id-badge">
                    <Shield className="id-icon" />
                    <span>Adm: {profile?.student_details?.student_id || 'N/A'}</span>
                  </div>
                  <span className="student-role-badge">Student</span>
                </div>
              </div>

              {/* Info Card */}
              <div className="info-card">
                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <Calendar className="info-icon" />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Joined</span>
                    <span className="info-value">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <MapPin className="info-icon" />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Current Class</span>
                    <span className="info-value">
                      {profile?.class_name || 'Enrolled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Forms */}
            <div className="profile-right">
              {/* Personal Information Form */}
              <div className="form-card">
                <div className="form-header">
                  <div className="form-header-left">
                    <User className="form-header-icon" />
                    <div>
                      <h3 className="form-title">Personal Information</h3>
                      <p className="form-description">
                        Update your contact and personal details.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="profile-form">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email (Read-only)</label>
                      <input
                        type="email"
                        className="form-input form-input-readonly"
                        value={profile?.email || ""}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-input"
                        value={form.dob}
                        onChange={(e) => setForm({ ...form, dob: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-select"
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Parent/Guardian Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.parent_name}
                        onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                        placeholder="Enter parent/guardian name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Parent/Guardian Phone</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={form.parent_phone}
                        onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
                        placeholder="Enter parent/guardian phone"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="btn-icon spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="btn-icon" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Security Settings Form */}
              <div className="form-card security-card">
                <div className="form-header security-header">
                  <div className="form-header-left">
                    <Shield className="form-header-icon security-icon" />
                    <div>
                      <h3 className="form-title security-title">Security Settings</h3>
                      <p className="form-description security-description">
                        Update your password to keep your account secure.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleChangePw} className="security-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={pwForm.currentPassword}
                        onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={pwForm.newPassword}
                        onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={pwForm.confirmPassword}
                        onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions security-actions">
                    <button
                      type="submit"
                      className="btn btn-outline"
                      disabled={changingPw}
                    >
                      {changingPw ? (
                        <>
                          <Loader2 className="btn-icon spin" />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Lock className="btn-icon" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Password Requirements */}
                <div className="password-requirements">
                  <h4 className="requirements-title">Password Requirements:</h4>
                  <ul className="requirements-list">
                    <li>At least 8 characters long</li>
                    <li>Contains at least one uppercase letter</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentPortalLayout>
  );
};

export default StudentProfile;