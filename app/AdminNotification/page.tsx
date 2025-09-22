'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

interface Notification {
  id: number;
  recipient_email: string;
  subject: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  created_at: string;
  sent_at: string | null;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [formData, setFormData] = useState({
    recipient_email: '',
    subject: '',
    message: ''
  });

  // Sample customer data for quick selection
  const sampleCustomers = [
    { email: 'john.smith@example.com', name: 'John Smith' },
    { email: 'maria.garcia@example.com', name: 'Maria Garcia' },
    { email: 'robert.johnson@example.com', name: 'Robert Johnson' },
    { email: 'sarah.williams@example.com', name: 'Sarah Williams' },
    { email: 'james.brown@example.com', name: 'James Brown' }
  ];

  useEffect(() => {
    fetchNotificationHistory();
  }, []);

  const fetchNotificationHistory = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch from your database
      const mockData: Notification[] = [
        {
          id: 1,
          recipient_email: 'customer1@example.com',
          subject: 'Your Appointment Confirmation',
          message: 'Your appointment has been confirmed for tomorrow at 10:00 AM.',
          status: 'sent',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          recipient_email: 'customer2@example.com',
          subject: 'Service Reminder',
          message: 'This is a reminder that your vehicle is due for service next week.',
          status: 'sent',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setNotifications(mockData);
    } catch (error) {
      console.error('Error fetching notification history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!formData.recipient_email || !formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSending(true);
      
      // In a real application, you would call your backend API here
      // For now, we'll simulate the API call with a timeout
      console.log('Sending email to:', formData.recipient_email);
      console.log('Subject:', formData.subject);
      console.log('Message:', formData.message);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      const newNotification: Notification = {
        id: Math.max(...notifications.map(n => n.id), 0) + 1,
        recipient_email: formData.recipient_email,
        subject: formData.subject,
        message: formData.message,
        status: 'sent',
        created_at: new Date().toISOString(),
        sent_at: new Date().toISOString()
      };

      setNotifications(prev => [newNotification, ...prev]);
      
      alert(`Notification sent successfully to ${formData.recipient_email}!`);
      setShowSendModal(false);
      setFormData({ recipient_email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectCustomer = (email: string) => {
    setFormData(prev => ({
      ...prev,
      recipient_email: email
    }));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sent': return '#10b981';
      case 'failed': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>SUNNY AUTO ADMIN</h1>
        
        <div style={styles.headerActions}>
          <button 
            onClick={() => window.history.back()}
            style={styles.backButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentCard}>
          <div style={styles.headerSection}>
            <h2 style={styles.title}>Notification Center</h2>
            <button 
              onClick={() => setShowSendModal(true)}
              style={styles.sendButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Send Notification
            </button>
          </div>

          {/* Stats Summary */}
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{notifications.filter(n => n.status === 'sent').length}</div>
                <div style={styles.statLabel}>Sent</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{notifications.filter(n => n.status === 'failed').length}</div>
                <div style={styles.statLabel}>Failed</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{notifications.length}</div>
                <div style={styles.statLabel}>Total</div>
              </div>
            </div>
          </div>

          {/* Notification History */}
          <div style={styles.historySection}>
            <h3 style={styles.sectionTitle}>Notification History</h3>
            
            {loading ? (
              <div style={styles.loadingState}>
                <div style={styles.loadingSpinner}></div>
                <p>Loading notification history...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h4>No notifications sent yet</h4>
                <p>Send your first notification to get started</p>
              </div>
            ) : (
              <div style={styles.notificationsList}>
                {notifications.map(notification => (
                  <div key={notification.id} style={styles.notificationCard}>
                    <div style={styles.notificationHeader}>
                      <div style={styles.notificationRecipient}>
                        <strong>To:</strong> {notification.recipient_email}
                      </div>
                      <div style={{...styles.statusBadge, backgroundColor: getStatusColor(notification.status)}}>
                        {notification.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <h4 style={styles.notificationSubject}>{notification.subject}</h4>
                    <p style={styles.notificationMessage}>{notification.message}</p>
                    
                    <div style={styles.notificationFooter}>
                      <span style={styles.notificationDate}>
                        Sent: {formatDate(notification.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Send New Notification</h3>
              <button 
                onClick={() => setShowSendModal(false)}
                style={styles.closeButton}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Select Customer</label>
                <select
                  value={formData.recipient_email}
                  onChange={(e) => handleSelectCustomer(e.target.value)}
                  style={styles.formSelect}
                >
                  <option value="">Select a customer</option>
                  {sampleCustomers.map(customer => (
                    <option key={customer.email} value={customer.email}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Or Enter Email</label>
                <input
                  type="email"
                  name="recipient_email"
                  value={formData.recipient_email}
                  onChange={handleInputChange}
                  placeholder="customer@example.com"
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Notification subject"
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                  rows={5}
                  style={styles.formTextarea}
                />
              </div>

              <div style={styles.previewSection}>
                <h4 style={styles.previewTitle}>Preview</h4>
                <div style={styles.emailPreview}>
                  <p><strong>To:</strong> {formData.recipient_email || 'customer@example.com'}</p>
                  <p><strong>Subject:</strong> {formData.subject || 'Your notification subject'}</p>
                  <div style={styles.emailBody}>
                    {formData.message || 'Your message will appear here...'}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button 
                onClick={() => setShowSendModal(false)}
                style={styles.cancelModalButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleSendNotification}
                disabled={sending || !formData.recipient_email || !formData.subject || !formData.message}
                style={
                  sending || !formData.recipient_email || !formData.subject || !formData.message 
                    ? styles.sendModalButtonDisabled 
                    : styles.sendModalButton
                }
              >
                {sending ? (
                  <>
                    <div style={styles.sendingSpinner}></div>
                    Sending...
                  </>
                ) : (
                  'Send Notification'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animation for spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    background: '#0f172a',
    minHeight: '100vh',
    color: 'white',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  } as const,
  header: {
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155'
  } as const,
  logo: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#f97316',
    margin: 0
  } as const,
  headerActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  } as const,
  backButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease',
    boxShadow: 'none'
  } as const,
  mainContent: {
    padding: '2rem',
    minHeight: 'calc(100vh - 100px)'
  } as const,
  contentCard: {
    backgroundColor: '#1e293b',
    padding: '2.5rem',
    borderRadius: '12px',
    border: '1px solid #334155',
    maxWidth: '1200px',
    margin: '0 auto'
  } as const,
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    gap: '1rem'
  } as const,
  title: {
    color: '#f97316',
    fontSize: '2rem',
    fontWeight: '700',
    margin: 0
  } as const,
  sendButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease',
    boxShadow: 'none'
  } as const,
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2.5rem'
  } as const,
  statCard: {
    backgroundColor: '#334155',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #475569',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  } as const,
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  } as const,
  statContent: {
    flex: 1
  } as const,
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'white',
    margin: '0 0 0.25rem 0'
  } as const,
  statLabel: {
    color: '#cbd5e1',
    fontWeight: '500',
    margin: 0
  } as const,
  historySection: {
    marginTop: '2rem'
  } as const,
  sectionTitle: {
    color: '#f97316',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem'
  } as const,
  loadingState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    textAlign: 'center' as const
  } as const,
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #334155',
    borderTop: '4px solid #f97316',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  } as const,
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    textAlign: 'center' as const,
    backgroundColor: '#334155',
    borderRadius: '8px',
    border: '1px solid #475569'
  } as const,
  notificationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  } as const,
  notificationCard: {
    backgroundColor: '#334155',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #475569'
  } as const,
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  } as const,
  notificationRecipient: {
    color: '#cbd5e1',
    fontWeight: '500'
  } as const,
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'white'
  } as const,
  notificationSubject: {
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 0.75rem 0'
  } as const,
  notificationMessage: {
    color: '#cbd5e1',
    lineHeight: '1.5',
    margin: '0 0 1rem 0'
  } as const,
  notificationFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  } as const,
  notificationDate: {
    color: '#94a3b8',
    fontSize: '0.875rem'
  } as const,
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem'
  } as const,
  modal: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto'
  } as const,
  modalHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #334155',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as const,
  closeButton: {
    backgroundColor: 'transparent',
    color: '#cbd5e1',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as const,
  modalContent: {
    padding: '1.5rem'
  } as const,
  formGroup: {
    marginBottom: '1.5rem'
  } as const,
  formLabel: {
    display: 'block',
    color: '#f97316',
    fontWeight: '600',
    marginBottom: '0.5rem'
  } as const,
  formSelect: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: '#0f172a',
    color: 'white'
  } as const,
  formInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: '#0f172a',
    color: 'white'
  } as const,
  formTextarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: '#0f172a',
    color: 'white',
    resize: 'vertical' as const,
    minHeight: '120px',
    fontFamily: 'inherit'
  } as const,
  previewSection: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#334155',
    borderRadius: '8px',
    border: '1px solid #475569'
  } as const,
  previewTitle: {
    color: '#f97316',
    marginTop: 0,
    marginBottom: '1rem'
  } as const,
  emailPreview: {
    color: '#cbd5e1',
    fontSize: '0.9rem'
  } as const,
  emailBody: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#1e293b',
    borderRadius: '4px',
    borderLeft: '3px solid #f97316'
  } as const,
  modalActions: {
    padding: '1.5rem',
    borderTop: '1px solid #334155',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem'
  } as const,
  cancelModalButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
    boxShadow: 'none'
  } as const,
  sendModalButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: 'none'
  } as const,
  sendModalButtonDisabled: {
    backgroundColor: '#374151',
    color: '#9ca3af',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'not-allowed',
    boxShadow: 'none'
  } as const,
  sendingSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  } as const
};

export default AdminNotifications;