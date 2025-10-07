'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: string;
  user_id: string;
  recipient_email: string;
  subject: string;
  message: string;
  notification_type: 'appointment' | 'promotion' | 'alert' | 'general';
  status: 'sent' | 'failed' | 'pending';
  created_at: string;
  sent_at: string | null;
}

const AdminNotifications = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    notification_type: 'general' as 'appointment' | 'promotion' | 'alert' | 'general'
  });

  // Color scheme
  const colors = {
    primary: '#C7613C',
    primaryLight: '#e07a4f',
    primaryDark: '#b55536',
    background: 'white',
    card: '#f8f9fa',
    text: '#333',
    textLight: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  };

  useEffect(() => {
    fetchUsersAndNotifications();
  }, []);

  const fetchUsersAndNotifications = async () => {
    try {
      setLoading(true);
      
      // Fetch users from profiles table
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching profiles:', usersError);
        throw usersError;
      }

      console.log('Fetched users from profiles:', usersData);
      setUsers(usersData || []);

      // Try to fetch notifications from notifications table
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (notificationsError) {
        if (notificationsError.code === 'PGRST301') {
          console.log('Notifications table does not exist yet');
        } else {
          console.error('Error fetching notifications:', notificationsError);
        }
      }

      setNotifications(notificationsData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading customer data. Please check if the profiles table exists.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleSendNotification = async () => {
    if (!formData.subject || !formData.message) {
      alert('Please fill in subject and message');
      return;
    }

    if (selectedUsers.length === 0) {
      alert('Please select at least one customer');
      return;
    }

    try {
      setSending(true);
      
      const emailResults = [];
      const newNotifications: Notification[] = [];
      
      // Send emails to each selected user
      for (const userId of selectedUsers) {
        const user = users.find(u => u.id === userId);
        if (!user) continue;

        const notificationData = {
          user_id: userId,
          recipient_email: user.email,
          subject: formData.subject,
          message: formData.message,
          notification_type: formData.notification_type,
          status: 'pending' as const,
          sent_at: null
        };

        let notification: Notification;
        let emailStatus: 'sent' | 'failed' = 'failed';

        try {
          // Create notification record first
          const { data: dbNotification, error: dbError } = await supabase
            .from('notifications')
            .insert([notificationData])
            .select()
            .single();

          if (dbError) {
            // If table doesn't exist, create local notification
            notification = {
              id: Math.random().toString(36).substr(2, 9),
              ...notificationData,
              created_at: new Date().toISOString()
            };
          } else {
            notification = dbNotification;
          }

          // Send email using your email API
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: user.email,
              subject: formData.subject,
              html: generateEmailTemplate(formData.message, formData.notification_type, user),
              text: formData.message,
              notification_type: formData.notification_type
            }),
          });

          if (emailResponse.ok) {
            emailStatus = 'sent';
            // Update notification status to sent
            if (notification.id.length === 9) { // Local notification
              notification.status = 'sent';
              notification.sent_at = new Date().toISOString();
            } else {
              // Update in database
              await supabase
                .from('notifications')
                .update({ 
                  status: 'sent',
                  sent_at: new Date().toISOString()
                })
                .eq('id', notification.id);
            }
          } else {
            throw new Error(`Email failed: ${emailResponse.status}`);
          }

        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
          emailStatus = 'failed';
          
          // Update notification status to failed
          if (notification!.id.length === 9) { // Local notification
            notification!.status = 'failed';
          } else {
            await supabase
              .from('notifications')
              .update({ status: 'failed' })
              .eq('id', notification!.id);
          }
        }

        // Update local notification status
        if (notification) {
          if (emailStatus === 'sent') {
            notification.status = 'sent';
            notification.sent_at = new Date().toISOString();
          } else {
            notification.status = 'failed';
          }
          newNotifications.push(notification);
        }

        emailResults.push({
          email: user.email,
          name: getUserName(user),
          status: emailStatus
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Update local state with new notifications
      setNotifications(prev => [...newNotifications, ...prev]);

      // Show results summary
      const sentCount = emailResults.filter(r => r.status === 'sent').length;
      const failedCount = emailResults.filter(r => r.status === 'failed').length;

      if (failedCount === 0) {
        alert(`✅ Successfully sent ${sentCount} notification(s) to customers!`);
      } else if (sentCount === 0) {
        alert(`❌ Failed to send all ${failedCount} notification(s). Please check your email configuration.`);
      } else {
        alert(`⚠️ Sent ${sentCount} notification(s) successfully, but failed to send ${failedCount}.`);
      }

      setShowSendModal(false);
      setFormData({ subject: '', message: '', notification_type: 'general' });
      setSelectedUsers([]);
      
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Failed to send notifications. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Generate professional email template
  const generateEmailTemplate = (message: string, type: string, user: UserProfile) => {
    const userName = getUserName(user);
    const getHeaderColor = () => {
      switch(type) {
        case 'appointment': return '#C7613C';
        case 'promotion': return '#10b981';
        case 'alert': return '#ef4444';
        default: return '#3b82f6';
      }
    };

    const getTypeText = () => {
      switch(type) {
        case 'appointment': return 'Appointment Update';
        case 'promotion': return 'Special Promotion';
        case 'alert': return 'Important Alert';
        default: return 'Notification';
      }
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${formData.subject}</title>
        <style>
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8f9fa;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: ${getHeaderColor()}; 
            color: white; 
            padding: 2rem; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 1.8rem; 
            font-weight: 700;
          }
          .content { 
            padding: 2rem; 
          }
          .greeting {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            color: #6b7280;
          }
          .message {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid ${getHeaderColor()};
            margin: 1.5rem 0;
            white-space: pre-wrap;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 1.5rem; 
            text-align: center; 
            color: #6b7280; 
            font-size: 0.9rem;
            border-top: 1px solid #e5e7eb;
          }
          .type-badge {
            display: inline-block;
            background: ${getHeaderColor()};
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sunny Auto</h1>
            <p>Premium Automotive Services</p>
          </div>
          <div class="content">
            <div class="type-badge">${getTypeText()}</div>
            <div class="greeting">
              <strong>Hello ${userName},</strong>
            </div>
            <div class="message">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p>
              Thank you for choosing Sunny Auto for your automotive needs.<br>
              We're committed to providing you with the best service experience.
            </p>
          </div>
          <div class="footer">
            <p>
              <strong>Sunny Auto</strong><br>
              Premium Automotive Services<br>
              service@sunnyauto.com | (555) 123-4567
            </p>
            <p style="font-size: 0.8rem; margin-top: 1rem; color: #9ca3af;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(users.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sent': return colors.success;
      case 'failed': return colors.error;
      case 'pending': return colors.warning;
      default: return colors.textLight;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getUserName = (user: UserProfile) => {
    return user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Valued Customer';
  };

  if (loading) {
    return (
      <div style={{ 
        background: colors.background,
        minHeight: '100vh', 
        color: colors.text,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid ${colors.border}`,
            borderTop: `4px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: colors.primary, fontSize: '1.2rem', fontWeight: '600' }}>Loading Customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: colors.background,
      minHeight: '100vh', 
      color: colors.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderBottom: `2px solid ${colors.primary}`,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700',
          color: colors.primary,
          margin: 0,
          cursor: 'pointer'
        }} onClick={handleBackToDashboard}>
          SUNNY AUTO ADMIN
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setShowSendModal(true)}
            disabled={users.length === 0}
            style={{
              backgroundColor: users.length === 0 ? colors.textLight : colors.primary,
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: users.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: users.length === 0 ? 'none' : `0 4px 15px ${colors.primary}40`
            }}
            onMouseEnter={(e) => {
              if (users.length > 0) {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (users.length > 0) {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Send Email Notification
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        padding: '2rem',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ 
          backgroundColor: colors.background,
          padding: '2.5rem',
          borderRadius: '15px',
          maxWidth: '1400px',
          margin: '0 auto',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700',
              color: colors.primary,
              margin: 0,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Email Notifications
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ color: colors.primary, fontWeight: '600', fontSize: '1.1rem' }}>
                Total Customers: {users.length}
              </span>
              <span style={{ color: colors.textLight, fontWeight: '500' }}>
                Emails Sent: {notifications.filter(n => n.status === 'sent').length}
              </span>
            </div>
          </div>

          {/* Debug Info */}
          {users.length === 0 && (
            <div style={{
              backgroundColor: colors.warning + '20',
              border: `1px solid ${colors.warning}`,
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: colors.warning, marginTop: 0 }}>No Customers Found</h4>
              <p style={{ color: colors.text, marginBottom: '0.5rem' }}>
                This could be because:
              </p>
              <ul style={{ color: colors.text, marginBottom: '1rem' }}>
                <li>The profiles table doesn't exist in your database</li>
                <li>No users have signed up yet</li>
                <li>There's an issue with the database connection</li>
              </ul>
              <button 
                onClick={fetchUsersAndNotifications}
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Check Again
              </button>
            </div>
          )}

          {/* Stats Summary */}
          {users.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              backgroundColor: colors.card,
              padding: '2rem',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              marginBottom: '2rem',
              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)'
            }}>
              {[
                { label: 'Total Customers', count: users.length, color: colors.primary, icon: '👥' },
                { label: 'Emails Sent', count: notifications.filter(n => n.status === 'sent').length, color: colors.success, icon: '📧' },
                { label: 'Emails Failed', count: notifications.filter(n => n.status === 'failed').length, color: colors.error, icon: '❌' },
                { label: 'Selected Now', count: selectedUsers.length, color: colors.info, icon: '✅' }
              ].map((stat, index) => (
                <div key={index} style={{ 
                  textAlign: 'center', 
                  padding: '1.5rem',
                  backgroundColor: colors.background,
                  borderRadius: '10px',
                  border: `2px solid ${stat.color}`,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${stat.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '2.5rem', color: stat.color, fontWeight: '800', marginBottom: '0.5rem' }}>
                    {stat.count}
                  </div>
                  <div style={{ color: colors.text, fontWeight: '600', fontSize: '1.1rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Customer List */}
          <div style={styles.historySection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: colors.primary, fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                Registered Customers
              </h3>
              {users.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={selectAllUsers}
                    style={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    Select All
                  </button>
                  <button 
                    onClick={clearSelection}
                    style={{
                      backgroundColor: colors.textLight,
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
            
            {users.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={colors.textLight} strokeWidth="2"/>
                  <circle cx="12" cy="7" r="4" stroke={colors.textLight} strokeWidth="2"/>
                </svg>
                <h4 style={{ color: colors.text, margin: '1rem 0 0.5rem' }}>No Customers Found</h4>
                <p style={{ color: colors.textLight, margin: 0 }}>No users found in the profiles table.</p>
              </div>
            ) : (
              <div style={styles.customersGrid}>
                {users.map(user => (
                  <div 
                    key={user.id}
                    style={{
                      ...styles.customerCard,
                      border: `2px solid ${selectedUsers.includes(user.id) ? colors.primary : colors.border}`,
                      backgroundColor: selectedUsers.includes(user.id) ? `${colors.primary}10` : colors.background
                    }}
                    onClick={() => handleUserSelection(user.id)}
                  >
                    <div style={styles.customerHeader}>
                      <div style={styles.customerInfo}>
                        <h4 style={styles.customerName}>{getUserName(user)}</h4>
                        <p style={styles.customerEmail}>{user.email}</p>
                      </div>
                      <div style={{
                        ...styles.selectionIndicator,
                        backgroundColor: selectedUsers.includes(user.id) ? colors.primary : 'transparent',
                        border: `2px solid ${selectedUsers.includes(user.id) ? colors.primary : colors.border}`
                      }}>
                        {selectedUsers.includes(user.id) && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <div style={styles.customerDetails}>
                      <p style={styles.customerDetail}>
                        <strong>Phone:</strong> {user.phone || 'Not provided'}
                      </p>
                      <p style={styles.customerDetail}>
                        <strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notification History */}
          {notifications.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ color: colors.primary, fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                Email History
              </h3>
              <div style={styles.notificationsList}>
                {notifications.slice(0, 10).map(notification => (
                  <div key={notification.id} style={styles.notificationCard}>
                    <div style={styles.notificationHeader}>
                      <div style={styles.notificationRecipient}>
                        <strong>To:</strong> {notification.recipient_email}
                      </div>
                      <div style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(notification.status)
                      }}>
                        {notification.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <h4 style={styles.notificationSubject}>{notification.subject}</h4>
                    <p style={styles.notificationMessage}>{notification.message}</p>
                    
                    <div style={styles.notificationFooter}>
                      <span style={styles.notificationDate}>
                        {notification.sent_at ? `Sent: ${formatDate(notification.sent_at)}` : `Created: ${formatDate(notification.created_at)}`}
                      </span>
                      <span style={styles.notificationType}>
                        Type: {notification.notification_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to Dashboard Button */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 15px ${colors.primary}40`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{ color: colors.primary, margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
                Send Email to Customers
              </h3>
              <button 
                onClick={() => setShowSendModal(false)}
                style={styles.closeButton}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6l12 12" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Selected Customers</label>
                <div style={styles.selectedCustomers}>
                  {selectedUsers.length === 0 ? (
                    <p style={{ color: colors.textLight, fontStyle: 'italic' }}>No customers selected</p>
                  ) : (
                    <div style={styles.selectedList}>
                      {selectedUsers.map(userId => {
                        const user = users.find(u => u.id === userId);
                        return user ? (
                          <span key={userId} style={styles.selectedTag}>
                            {getUserName(user)} ({user.email})
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                  <p style={{ color: colors.textLight, fontSize: '0.9rem', margin: '0.5rem 0 0' }}>
                    {selectedUsers.length} customer(s) selected
                  </p>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email Type</label>
                <select
                  name="notification_type"
                  value={formData.notification_type}
                  onChange={handleInputChange}
                  style={styles.formSelect}
                >
                  <option value="general">General Notification</option>
                  <option value="appointment">Appointment Reminder</option>
                  <option value="promotion">Special Promotion</option>
                  <option value="alert">Important Alert</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter email subject"
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your email message here..."
                  rows={6}
                  style={styles.formTextarea}
                />
              </div>

              <div style={styles.previewSection}>
                <h4 style={styles.previewTitle}>Email Preview</h4>
                <div style={styles.emailPreview}>
                  <p><strong>To:</strong> {selectedUsers.length} selected customer(s)</p>
                  <p><strong>Subject:</strong> {formData.subject || 'Your email subject'}</p>
                  <p><strong>Type:</strong> {formData.notification_type}</p>
                  <div style={styles.emailBody}>
                    {formData.message || 'Your email content will appear here...'}
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
                disabled={sending || !formData.subject || !formData.message || selectedUsers.length === 0}
                style={{
                  ...(sending || !formData.subject || !formData.message || selectedUsers.length === 0 
                    ? styles.sendModalButtonDisabled 
                    : styles.sendModalButton),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {sending && (
                  <div style={styles.sendingSpinner}></div>
                )}
                {sending ? 'Sending Emails...' : `Send to ${selectedUsers.length} Customer(s)`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Styles (same as previous version)
const styles = {
  historySection: {
    marginTop: '2rem'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    textAlign: 'center' as const,
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: `2px dashed #e5e7eb`
  },
  customersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1rem'
  },
  customerCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
  },
  customerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  customerInfo: {
    flex: 1
  },
  customerName: {
    color: '#333',
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: '0 0 0.25rem 0'
  },
  customerEmail: {
    color: '#6b7280',
    margin: 0,
    fontSize: '0.9rem'
  },
  selectionIndicator: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: '0.5rem'
  },
  customerDetails: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem'
  },
  customerDetail: {
    color: '#6b7280',
    fontSize: '0.9rem',
    margin: '0.25rem 0'
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  },
  notificationCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  },
  notificationRecipient: {
    color: '#6b7280',
    fontWeight: '500'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'white'
  },
  notificationSubject: {
    color: '#333',
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 0.75rem 0'
  },
  notificationMessage: {
    color: '#6b7280',
    lineHeight: '1.5',
    margin: '0 0 1rem 0'
  },
  notificationFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  },
  notificationDate: {
    color: '#9ca3af',
    fontSize: '0.875rem'
  },
  notificationType: {
    color: '#9ca3af',
    fontSize: '0.875rem',
    textTransform: 'capitalize' as const
  },
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
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '15px',
    border: `2px solid #C7613C`,
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  modalHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  modalContent: {
    padding: '1.5rem'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  formLabel: {
    display: 'block',
    color: '#C7613C',
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontSize: '1rem'
  },
  selectedCustomers: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  selectedList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  },
  selectedTag: {
    backgroundColor: '#C7613C',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  formSelect: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    color: '#333',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  formInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    color: '#333',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  formTextarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    color: '#333',
    resize: 'vertical' as const,
    minHeight: '120px',
    fontFamily: 'inherit',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  previewSection: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  previewTitle: {
    color: '#C7613C',
    marginTop: 0,
    marginBottom: '1rem',
    fontWeight: '600'
  },
  emailPreview: {
    color: '#6b7280',
    fontSize: '0.9rem'
  },
  emailBody: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '6px',
    borderLeft: '3px solid #C7613C',
    whiteSpace: 'pre-wrap' as const
  },
  modalActions: {
    padding: '1.5rem',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem'
  },
  cancelModalButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  sendModalButton: {
    backgroundColor: '#C7613C',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  sendModalButtonDisabled: {
    backgroundColor: '#e5e7eb',
    color: '#9ca3af',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'not-allowed'
  },
  sendingSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

export default AdminNotifications;