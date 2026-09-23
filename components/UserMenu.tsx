"use client";

import { useState, useRef, useEffect } from "react";
import { 
  User, 
  CreditCard, 
  LogOut, 
  ChevronDown, 
  Mail, 
  Shield, 
  Building2, 
  Crown,
  CheckCircle2,
  X,
  Phone,
  MapPin,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  type User as UserType, 
  type Studio, 
  type SubscriptionDetail,
  getProfile,
  getStudio,
  getSubscription 
} from "@/lib/auth";

export function UserMenu() {
  const { user, token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"profile" | "studio" | "subscription" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user || !token) return null;

  const closeModal = () => setActiveModal(null);

  return (
    <div className="user-menu-container" ref={dropdownRef}>
      <button 
        className={`user-menu-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          {user.initials || user.name.charAt(0).toUpperCase()}
        </div>
        <span className="user-name">{user.name}</span>
        <ChevronDown size={14} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <div className="dropdown-divider" />
          <button className="dropdown-item" onClick={() => { setActiveModal("profile"); setIsOpen(false); }}>
            <User size={16} />
            <span>My Profile</span>
          </button>
          <button className="dropdown-item" onClick={() => { setActiveModal("studio"); setIsOpen(false); }}>
            <Building2 size={16} />
            <span>Studio Info</span>
          </button>
          <button className="dropdown-item" onClick={() => { setActiveModal("subscription"); setIsOpen(false); }}>
            <CreditCard size={16} />
            <span>Subscription</span>
          </button>
          <div className="dropdown-divider" />
          <button className="dropdown-item logout" onClick={logout}>
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}

      {activeModal === "profile" && <ProfileModal token={token} onClose={closeModal} />}
      {activeModal === "studio" && <StudioModal token={token} onClose={closeModal} />}
      {activeModal === "subscription" && <SubscriptionModal token={token} onClose={closeModal} />}
    </div>
  );
}

function Modal({ title, icon: Icon, onClose, children, className = "" }: { title: string, icon: React.ElementType, onClose: () => void, children: React.ReactNode, className?: string }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content minimal-modal ${className}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header minimal-header">
          <div className="modal-title-section">
            <div className="header-icon-box">
              <Icon size={18} />
            </div>
            <span className="modal-title">{title}</span>
          </div>
          <button className="modal-close-button minimal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body minimal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ token, onClose }: { token: string, onClose: () => void }) {
  const [profile, setProfile] = useState<(UserType & { studio: Studio | null }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile(token).then(setProfile).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Modal title="My Profile" icon={User} onClose={onClose}><div className="modal-loader">Loading...</div></Modal>;
  if (!profile) return null;

  return (
    <Modal title="My Profile" icon={User} onClose={onClose}>
      <div className="minimal-card profile-minimal">
        <div className="minimal-card-header">
          <div className="minimal-avatar">{profile.initials}</div>
          <div className="minimal-user-info">
            <h3>{profile.name}</h3>
            <span className="role-tag">{profile.role_label}</span>
          </div>
        </div>
        
        <div className="minimal-info-list">
          <div className="minimal-info-row">
            <Mail size={16} />
            <div className="info-content">
              <label>Email Address</label>
              <span>{profile.email}</span>
            </div>
          </div>
          <div className="minimal-info-row">
            <Shield size={16} />
            <div className="info-content">
              <label>Account Type</label>
              <span>{profile.role_label}</span>
            </div>
          </div>
          {profile.studio && (
            <div className="minimal-info-row">
              <Building2 size={16} />
              <div className="info-content">
                <label>Associated Studio</label>
                <span>{profile.studio.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function StudioModal({ token, onClose }: { token: string, onClose: () => void }) {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudio(token)
      .then(setStudio)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Modal title="Studio Info" icon={Building2} onClose={onClose}><div className="modal-loader">Loading...</div></Modal>;
  
  if (error) return (
    <Modal title="Studio Info" icon={Building2} onClose={onClose}>
      <div className="error-state">
        <AlertCircle size={32} />
        <p>{error}</p>
      </div>
    </Modal>
  );

  if (!studio) return null;

  return (
    <Modal title="Studio Info" icon={Building2} onClose={onClose}>
      <div className="minimal-card">
        <div className="studio-brand-card">
          <div className="studio-logo-placeholder">
            <Building2 size={24} />
          </div>
          <div>
            <h3>{studio.name}</h3>
            <span className={`status-indicator ${studio.access_enabled ? 'active' : 'inactive'}`}>
              {studio.access_enabled ? 'Access Enabled' : 'Access Disabled'}
            </span>
          </div>
        </div>

        <div className="minimal-info-list mt-6">
          <div className="minimal-info-row">
            <Mail size={16} />
            <div className="info-content">
              <label>Studio Email</label>
              <span>{studio.email}</span>
            </div>
          </div>
          <div className="minimal-info-row">
            <Phone size={16} />
            <div className="info-content">
              <label>Contact Number</label>
              <span>{studio.phone}</span>
            </div>
          </div>
          <div className="minimal-info-row">
            <MapPin size={16} />
            <div className="info-content">
              <label>Address</label>
              <span>{studio.address}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function SubscriptionModal({ token, onClose }: { token: string, onClose: () => void }) {
  const [sub, setSub] = useState<SubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSubscription(token)
      .then(data => setSub(data.subscription))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Modal title="Subscription" icon={CreditCard} onClose={onClose}><div className="modal-loader">Loading...</div></Modal>;

  if (error) return (
    <Modal title="Subscription" icon={CreditCard} onClose={onClose}>
      <div className="error-state">
        <AlertCircle size={32} />
        <p>{error}</p>
      </div>
    </Modal>
  );

  if (!sub) return null;

  const isExpired = sub.days_remaining < 0;

  return (
    <Modal title="Subscription" icon={CreditCard} onClose={onClose}>
      <div className="minimal-card">
        <div className={`subscription-status-card ${sub.is_active ? 'active' : 'expired'}`}>
          <div className="sub-header">
            <Crown size={20} />
            <span className="cycle-badge">{sub.cycle_label} Plan</span>
          </div>
          <div className="price-display">
            <h2>{sub.price_formatted}</h2>
            <span>per {sub.cycle}</span>
          </div>
        </div>

        <div className="minimal-info-list mt-6">
          <div className="minimal-info-row">
            <Calendar size={16} />
            <div className="info-content">
              <label>{isExpired ? 'Expired On' : 'Valid Until'}</label>
              <span>{sub.ends_at ? new Date(sub.ends_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
            </div>
          </div>
          
          <div className={`status-banner ${isExpired ? 'danger' : 'success'}`}>
            <CheckCircle2 size={16} />
            <span>
              {isExpired 
                ? `Subscription expired ${Math.abs(sub.days_remaining)} days ago` 
                : `Active • ${sub.days_remaining} days remaining`}
            </span>
          </div>
        </div>

        <div className="plan-perks">
          <h4>Included in your plan:</h4>
          <div className="perk-grid">
            <div className="perk-item"><CheckCircle2 size={14} /> Unlimited Removals</div>
            <div className="perk-item"><CheckCircle2 size={14} /> HD Export</div>
            <div className="perk-item"><CheckCircle2 size={14} /> Custom Layouts</div>
            <div className="perk-item"><CheckCircle2 size={14} /> Multi-user Access</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
