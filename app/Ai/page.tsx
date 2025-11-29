"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ORANGE = '#FF8C00';
const ORANGE_LIGHT = '#FFA500';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intent?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicle_info?: string;
  address?: string;
}

interface Service {
  id: string;
  title: string;
  price: string;
  description: string;
  duration: string;
  category: string;
}

interface Appointment {
  id: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  vehicle_model: string;
}

interface VehicleType {
  id: string;
  type: string;
  make: string;
  model: string;
  year_range: string;
}

interface ConversationLog {
  user_id: string;
  user_message: string;
  ai_response: string;
  intent: string;
  timestamp: Date;
  metadata: any;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your SunnyAuto AI assistant. I can help you book appointments, check services, view your appointments, and much more! How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      intent: 'greeting'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    service_type: '',
    preferred_date: '',
    preferred_time: '',
    vehicle_model: '',
    additional_notes: ''
  });
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Enhanced training data
  const trainingData = {
    greetings: [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
      'what\'s up', 'howdy', 'greetings', 'hi there', 'hello there'
    ],
    farewells: [
      'bye', 'goodbye', 'see you', 'later', 'take care', 'bye bye',
      'see ya', 'farewell', 'have a good day', 'cya'
    ],
    gratitude: [
      'thanks', 'thank you', 'thank', 'appreciate', 'grateful', 'thanks a lot',
      'thank you very much', 'much appreciated', 'thx'
    ],
    appointments: [
      'book appointment', 'schedule appointment', 'make appointment', 'book service',
      'schedule service', 'make booking', 'reserve appointment', 'set up appointment',
      'book a slot', 'schedule maintenance', 'book repair', 'schedule repair',
      'make service appointment', 'book car service', 'schedule car service'
    ],
    viewAppointments: [
      'my appointments', 'view appointments', 'check appointments', 'appointment history',
      'upcoming appointments', 'past appointments', 'appointment status',
      'when is my appointment', 'my bookings', 'view bookings', 'check my schedule'
    ],
    services: [
      'services', 'what services', 'available services', 'service list',
      'what do you offer', 'service options', 'types of services',
      'maintenance services', 'repair services', 'service catalog',
      'what services do you provide', 'service menu'
    ],
    pricing: [
      'price', 'cost', 'how much', 'pricing', 'rates', 'service cost',
      'what is the price', 'how much does it cost', 'price list',
      'service charges', 'cost of service', 'price range'
    ],
    hours: [
      'hours', 'opening hours', 'business hours', 'when are you open',
      'working hours', 'operating hours', 'time', 'schedule',
      'what time do you open', 'what time do you close', 'hours of operation'
    ],
    contact: [
      'contact', 'phone', 'email', 'address', 'location', 'how to contact',
      'get in touch', 'customer service', 'support', 'help desk',
      'contact information', 'phone number', 'email address'
    ],
    emergency: [
      'emergency', 'urgent', 'asap', 'immediately', 'right now',
      'urgent repair', 'emergency service', 'breakdown', 'car broke down',
      'stranded', 'need help now', 'urgent help'
    ],
    vehicle: [
      'vehicle', 'car', 'auto', 'automobile', 'my car', 'my vehicle',
      'car model', 'vehicle type', 'what cars', 'which vehicles'
    ],
    profile: [
      'my profile', 'profile', 'account', 'my account', 'user profile',
      'personal information', 'my details', 'account settings'
    ],
    cancel: [
      'cancel', 'cancel appointment', 'cancel booking', 'remove appointment',
      'delete appointment', 'cancel my appointment', 'cancel service'
    ],
    reschedule: [
      'reschedule', 'change appointment', 'move appointment', 'change date',
      'reschedule appointment', 'change time', 'different date'
    ],
    status: [
      'status', 'appointment status', 'check status', 'service status',
      'repair status', 'maintenance status', 'what is the status'
    ],
    estimate: [
      'estimate', 'quote', 'cost estimate', 'price estimate', 'how long',
      'time estimate', 'duration', 'how much time', 'completion time'
    ],
    warranty: [
      'warranty', 'guarantee', 'warranty period', 'service warranty',
      'parts warranty', 'guarantee period', 'warranty coverage'
    ],
    payment: [
      'payment', 'pay', 'payment options', 'how to pay', 'payment methods',
      'credit card', 'cash', 'online payment', 'payment process'
    ],
    location: [
      'location', 'where', 'address', 'find us', 'service center location',
      'workshop location', 'garage location', 'where are you located'
    ],
    mechanics: [
      'mechanic', 'technician', 'staff', 'experts', 'who will service',
      'qualified mechanics', 'certified technicians', 'service team'
    ],
    insurance: [
      'insurance', 'insurance claim', 'insurance coverage', 'deal with insurance',
      'insurance work', 'insurance claims', 'insurance approved'
    ]
  };

  // Text-to-Speech functionality
  const speakText = (text: string) => {
    if (!isSpeechEnabled || !text) return;

    // Clean the text for speech (remove markdown, special characters)
    const cleanText = text
      .replace(/[•\-\*]/g, '')
      .replace(/\n/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      speechSynthRef.current = utterance;

      // Configure voice settings
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      // Try to get a pleasant voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Microsoft David')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
    }
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    initializeData();
  }, []);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const initializeData = async () => {
    await loadUserProfile();
    await loadServices();
    await loadVehicleTypes();
  };

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          await loadUserAppointments(user.id);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('title');
      
      if (!error && data) {
        setServices(data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadVehicleTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicletypes')
        .select('*')
        .order('type');
      
      if (!error && data) {
        setVehicleTypes(data);
      }
    } catch (error) {
      console.error('Error loading vehicle types:', error);
    }
  };

  const loadUserAppointments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('preferred_date', { ascending: false });
      
      if (!error && data) {
        setUserAppointments(data);
      }
    } catch (error) {
      console.error('Error loading user appointments:', error);
    }
  };

  const logConversation = async (userMessage: string, aiResponse: string, intent: string, metadata: any = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const log: ConversationLog = {
          user_id: user.id,
          user_message: userMessage,
          ai_response: aiResponse,
          intent,
          timestamp: new Date(),
          metadata
        };

        const { error } = await supabase
          .from('conversations')
          .insert([log]);

        if (error) {
          console.error('Error logging conversation:', error);
        }
      }
    } catch (error) {
      console.error('Error logging conversation:', error);
    }
  };

  const addMessage = (text: string, sender: 'user' | 'ai', intent?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      intent
    };
    setMessages(prev => [...prev, newMessage]);

    // Speak AI messages if speech is enabled
    if (sender === 'ai' && isSpeechEnabled) {
      speakText(text);
    }
  };

  const detectIntent = (message: string): string => {
    const lowerMessage = message.toLowerCase().trim();

    for (const [intent, phrases] of Object.entries(trainingData)) {
      for (const phrase of phrases) {
        if (lowerMessage.includes(phrase)) {
          return intent;
        }
      }
    }

    // Advanced pattern matching
    if (/(book|schedule|make).*(appointment|service)/i.test(message)) return 'appointments';
    if (/(my|view|check).*(appointment|booking)/i.test(message)) return 'viewAppointments';
    if (/(how much|price|cost|rate)/i.test(message)) return 'pricing';
    if (/(open|close|hour|time).*(today|tomorrow)/i.test(message)) return 'hours';
    if (/(cancel|delete).*(appointment|booking)/i.test(message)) return 'cancel';
    if (/(reschedule|change|move).*(appointment|date)/i.test(message)) return 'reschedule';
    if (/(status|progress).*(appointment|service)/i.test(message)) return 'status';
    if (/(estimate|quote|how long)/i.test(message)) return 'estimate';
    if (/(warranty|guarantee)/i.test(message)) return 'warranty';
    if (/(pay|payment|credit card|cash)/i.test(message)) return 'payment';
    if (/(where|location|address)/i.test(message)) return 'location';
    if (/(mechanic|technician|expert|staff)/i.test(message)) return 'mechanics';
    if (/(insurance|claim)/i.test(message)) return 'insurance';

    return 'general';
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setInputText('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    await processUserMessage(userMessage);
    setIsLoading(false);
  };

  const processUserMessage = async (message: string) => {
    const intent = detectIntent(message);
    let response = '';
    let metadata = {};

    switch (intent) {
      case 'greetings':
        response = userProfile 
          ? `Hello ${userProfile.name}! Welcome back to SunnyAuto. How can I assist you with your automotive needs today?`
          : "Hello! I'm your SunnyAuto AI assistant. How can I help you with your vehicle today?";
        break;

      case 'appointments':
        if (userProfile) {
          response = "I can help you book an appointment! Let me show you the appointment form.";
          setShowAppointmentForm(true);
          metadata = { action: 'show_appointment_form' };
        } else {
          response = "To book an appointment, please log in first. I'll take you to the login page.";
          setTimeout(() => router.push('/auth'), 1000);
          metadata = { action: 'redirect_to_login' };
        }
        break;

      case 'viewAppointments':
        if (userProfile && userAppointments.length > 0) {
          const upcomingApps = userAppointments.filter(app => 
            new Date(app.preferred_date) >= new Date()
          ).slice(0, 3);
          
          if (upcomingApps.length > 0) {
            response = "Here are your upcoming appointments:\n" +
              upcomingApps.map(app => 
                `• ${app.service_type} on ${new Date(app.preferred_date).toLocaleDateString()} at ${app.preferred_time} - ${app.status}`
              ).join('\n');
          } else {
            response = "You don't have any upcoming appointments. Would you like to book one?";
          }
          metadata = { appointments_count: userAppointments.length };
        } else {
          response = "You don't have any appointments yet. Would you like to book your first service?";
        }
        break;

      case 'services':
        if (services.length > 0) {
          const serviceList = services.slice(0, 5).map(service => 
            `• ${service.title} - ${service.price} (${service.duration})`
          ).join('\n');
          response = `We offer these services:\n${serviceList}\n\nSee all services on our Services page or ask about specific services!`;
          metadata = { services_count: services.length };
        } else {
          response = "Our services include oil changes, brake services, tire rotations, engine diagnostics, and more. Check our Services page for details!";
        }
        break;

      case 'pricing':
        if (services.length > 0) {
          const popularServices = services.filter(s => 
            s.title.toLowerCase().includes('oil') || 
            s.title.toLowerCase().includes('brake') ||
            s.title.toLowerCase().includes('tire')
          ).slice(0, 3);
          
          if (popularServices.length > 0) {
            response = "Popular service prices:\n" +
              popularServices.map(s => `• ${s.title}: ${s.price}`).join('\n') +
              "\n\nExact pricing depends on your vehicle. Book a free diagnostic for accurate quotes!";
          } else {
            response = "Service prices vary by vehicle type and service needed. Basic oil changes start from $39.99. Book a diagnostic for exact pricing!";
          }
        } else {
          response = "Oil changes start from $39.99, brake services from $149.99. Exact pricing depends on your vehicle model and service requirements.";
        }
        break;

      case 'hours':
        response = "We're open:\n• Monday-Friday: 7:00 AM - 7:00 PM\n• Saturday: 8:00 AM - 5:00 PM\n• Sunday: Closed\n\nEmergency services available by appointment.";
        break;

      case 'vehicle':
        if (vehicleTypes.length > 0) {
          const brands = [...new Set(vehicleTypes.map(v => v.make))].slice(0, 5);
          response = `We service all vehicle types including ${brands.join(', ')} and more. We work on cars, SUVs, trucks, and hybrids from all major manufacturers.`;
          metadata = { brands_serviced: brands };
        } else {
          response = "We service all vehicle types - cars, SUVs, trucks, hybrids, and electric vehicles from all major manufacturers.";
        }
        break;

      case 'emergency':
        response = "For emergency services, call our hotline at (555) 123-HELP. We offer priority emergency repairs and roadside assistance. Current wait time for emergencies: 1-2 hours.";
        metadata = { emergency_contact: '(555) 123-HELP' };
        break;

      case 'contact':
        response = "Contact SunnyAuto:\n📞 Phone: (555) 123-4567\n📧 Email: service@sunnyauto.com\n📍 Address: 123 Auto Service Drive\n🕒 Hours: Mon-Fri 7AM-7PM, Sat 8AM-5PM";
        break;

      case 'profile':
        if (userProfile) {
          response = `Your profile:\nName: ${userProfile.name}\nEmail: ${userProfile.email}${userProfile.phone ? `\nPhone: ${userProfile.phone}` : ''}${userProfile.vehicle_info ? `\nVehicle: ${userProfile.vehicle_info}` : ''}`;
        } else {
          response = "Please log in to view your profile information.";
        }
        break;

      case 'cancel':
        response = "To cancel an appointment, please call us at (555) 123-4567 or visit your appointments page. Cancellations require 2 hours notice.";
        break;

      case 'reschedule':
        response = "To reschedule, call us at (555) 123-4567 or book a new appointment online. We'll help you find a better time slot.";
        break;

      case 'status':
        response = "Check your appointment status in the Appointments section. For real-time updates on ongoing repairs, call our service desk at (555) 123-4567.";
        break;

      case 'estimate':
        response = "Service duration varies:\n• Oil change: 30-45 minutes\n• Brake service: 1-2 hours\n• Diagnostics: 1 hour\n• Major repairs: 2-6 hours\n\nExact times depend on vehicle and service complexity.";
        break;

      case 'warranty':
        response = "We offer:\n• 12-month/12,000-mile warranty on all repairs\n• 6-month warranty on parts\n• 90-day warranty on maintenance services\n\nAll warranties are transferable.";
        break;

      case 'payment':
        response = "We accept:\n💳 Credit/Debit Cards\n💰 Cash\n🏦 Bank Transfer\n📱 Mobile Payments\n🔗 Online Payments\n💸 Financing Available\n\nPayment is due upon service completion.";
        break;

      case 'location':
        response = "Find us at:\n📍 SunnyAuto Service Center\n123 Auto Service Drive\nYour City, State 12345\n\nFree pickup and dropoff within 5 miles!";
        break;

      case 'mechanics':
        response = "Our team includes:\n• ASE Certified Master Technicians\n• Factory-trained specialists\n• 10+ years average experience\n• Electric vehicle certified experts\n• Continuous training on latest technologies";
        break;

      case 'insurance':
        response = "We work with most insurance companies for:\n• Collision repairs\n• Comprehensive claims\n• Glass replacement\n• Mechanical breakdowns\n\nWe handle direct billing with insurers.";
        break;

      case 'gratitude':
        response = "You're welcome! Is there anything else I can help you with today?";
        break;

      case 'farewells':
        response = userProfile 
          ? `Goodbye ${userProfile.name}! Thank you for choosing SunnyAuto. Drive safe!`
          : "Goodbye! Thank you for considering SunnyAuto. Have a great day!";
        break;

      default:
        if (message.toLowerCase().includes('oil')) {
          response = "We offer comprehensive oil change services using premium synthetic oils. Prices start from $39.99. Would you like to schedule an oil change?";
        } else if (message.toLowerCase().includes('brake')) {
          response = "Our brake services include inspection, pad replacement, rotor resurfacing, and fluid flush. Starting from $149.99. Safety inspection is free!";
        } else if (message.toLowerCase().includes('tire')) {
          response = "Tire services: rotation ($24.99), balancing ($29.99), replacement (varies by tire). We carry all major brands. Free tire pressure check!";
        } else if (message.toLowerCase().includes('engine') || message.toLowerCase().includes('check')) {
          response = "Engine diagnostics start from $89.99. We use advanced computer systems to identify issues accurately. Includes full system scan and detailed report.";
        } else {
          response = "I'm here to help with SunnyAuto services! You can ask me about:\n• Booking appointments\n• Service pricing\n• Your appointments\n• Business hours\n• Vehicle services\n• Contact information\n\nWhat would you like to know?";
        }
        break;
    }

    addMessage(response, 'ai', intent);
    await logConversation(message, response, intent, metadata);
  };

  const handleAppointmentSubmit = async () => {
    if (!appointmentData.service_type || !appointmentData.preferred_date) {
      addMessage("Please fill in at least the service type and preferred date to book your appointment.", 'ai');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        addMessage("Please log in to book an appointment.", 'ai');
        return;
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: user.id,
            service_type: appointmentData.service_type,
            preferred_date: appointmentData.preferred_date,
            preferred_time: appointmentData.preferred_time,
            vehicle_model: appointmentData.vehicle_model,
            additional_notes: appointmentData.additional_notes,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      const successMessage = `Great! Your appointment for ${appointmentData.service_type} has been booked for ${appointmentData.preferred_date}. We'll contact you to confirm the timing. Thank you for choosing SunnyAuto!`;
      addMessage(successMessage, 'ai', 'appointment_confirmation');
      
      await loadUserAppointments(user.id);
      
      setAppointmentData({
        service_type: '',
        preferred_date: '',
        preferred_time: '',
        vehicle_model: '',
        additional_notes: ''
      });
      setShowAppointmentForm(false);

      await logConversation('Appointment booked via form', successMessage, 'appointment_created', {
        appointment_data: appointmentData,
        appointment_id: data?.[0]?.id
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = "Sorry, there was an error booking your appointment. Please try again or contact us directly.";
      addMessage(errorMessage, 'ai');
      await logConversation('Appointment booking failed', errorMessage, 'appointment_error', { error });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Book Service', action: () => setInputText('I want to book an appointment') },
    { label: 'My Appointments', action: () => setInputText('Show my appointments') },
    { label: 'Service Prices', action: () => setInputText('What are your prices?') },
    { label: 'Business Hours', action: () => setInputText('What are your hours?') }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '2rem'
    }}>
      {/* Header with Speech Toggle */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        borderBottom: `2px solid ${ORANGE}`,
        paddingBottom: '1rem',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          margin: 0,
          background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          SunnyAuto AI Assistant
        </h1>
        <p style={{
          color: '#9ca3af',
          marginTop: '0.5rem',
          fontSize: '1rem'
        }}>
          Intelligent automotive service assistant • Powered by real-time data
        </p>
        
        {/* Glass Effect Speech Toggle Button */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            color: '#9ca3af',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            {isSpeechEnabled ? 'Voice ON' : 'Voice OFF'}
          </span>
          <button
            onClick={toggleSpeech}
            style={{
              position: 'relative',
              width: '60px',
              height: '30px',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              background: isSpeechEnabled 
                ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`
                : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: isSpeechEnabled 
                ? `0 0 20px ${ORANGE}40, inset 0 1px 1px rgba(255,255,255,0.2)`
                : 'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              transform: isSpeechEnabled ? 'translateX(30px)' : 'translateX(0)',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: isSpeechEnabled ? ORANGE : '#9ca3af'
            }}>
              {isSpeaking ? '🔊' : isSpeechEnabled ? '🔈' : '🔇'}
            </div>
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        height: '70vh'
      }}>
        {/* Chat Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '0.5rem'
                }}
              >
                <div style={{
                  background: message.sender === 'user' 
                    ? `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%)`
                    : 'rgba(255, 255, 255, 0.1)',
                  color: message.sender === 'user' ? 'white' : '#e5e7eb',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  maxWidth: '70%',
                  border: message.sender === 'user' 
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.95rem',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line',
                  backdropFilter: 'blur(5px)'
                }}>
                  {message.text}
                  <div style={{
                    fontSize: '0.7rem',
                    opacity: 0.7,
                    marginTop: '0.25rem',
                    textAlign: message.sender === 'user' ? 'right' : 'left'
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.intent && ` • ${message.intent}`}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#e5e7eb',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.95rem',
                  backdropFilter: 'blur(5px)'
                }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: ORANGE,
                      animation: 'bounce 1.4s infinite ease-in-out both'
                    }}></div>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: ORANGE,
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.16s'
                    }}></div>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: ORANGE,
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.32s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about services, appointments, pricing..."
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backdropFilter: 'blur(5px)'
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
                style={{
                  background: inputText.trim() ? ORANGE : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  opacity: inputText.trim() ? 1 : 0.5,
                  backdropFilter: 'blur(5px)',
                  boxShadow: inputText.trim() ? `0 4px 15px ${ORANGE}40` : 'none'
                }}
              >
                Send
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1rem',
              flexWrap: 'wrap'
            }}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  style={{
                    background: 'transparent',
                    color: ORANGE,
                    border: `1px solid ${ORANGE}`,
                    borderRadius: '20px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${ORANGE}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          overflowY: 'auto',
          backdropFilter: 'blur(10px)'
        }}>
          {/* User Info */}
          <div>
            <h3 style={{
              color: ORANGE,
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              👤 User Information
            </h3>
            {userProfile ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)'
              }}>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  <strong>Name:</strong> {userProfile.name}
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  <strong>Email:</strong> {userProfile.email}
                </p>
                {userProfile.phone && (
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                    <strong>Phone:</strong> {userProfile.phone}
                  </p>
                )}
                {userProfile.vehicle_info && (
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                    <strong>Vehicle:</strong> {userProfile.vehicle_info}
                  </p>
                )}
                {userAppointments.length > 0 && (
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                    <strong>Appointments:</strong> {userAppointments.length} total
                  </p>
                )}
              </div>
            ) : (
              <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                Please log in to access your profile information.
              </p>
            )}
          </div>

          {/* Services Overview */}
          <div>
            <h3 style={{
              color: ORANGE,
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              🔧 Available Services
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxHeight: '200px',
              overflowY: 'auto',
              backdropFilter: 'blur(5px)'
            }}>
              {services.slice(0, 5).map((service, index) => (
                <div key={service.id} style={{
                  padding: '0.5rem 0',
                  borderBottom: index < 4 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ fontWeight: '600', color: ORANGE }}>{service.title}</div>
                  <div style={{ color: '#9ca3af' }}>{service.price} • {service.duration}</div>
                </div>
              ))}
              {services.length > 5 && (
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '0.5rem',
                  color: ORANGE,
                  fontSize: '0.8rem'
                }}>
                  +{services.length - 5} more services available
                </div>
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 style={{
              color: ORANGE,
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              🧭 Quick Navigation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: '🏠 Home Page', path: '/UserHome' },
                { label: '🔧 Services', path: '/Services' },
                { label: '👤 My Profile', path: '/UserProfile' },
                { label: '📅 Appointments', path: '/Appointment' },
                { label: '📞 Contact Us', path: '/Contactus' },
                { label: 'ℹ️ About Us', path: '/About' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  style={{
                    background: 'transparent',
                    color: '#e5e7eb',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.6rem 1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = ORANGE;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Form */}
          {showAppointmentForm && (
            <div>
              <h3 style={{
                color: ORANGE,
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                📅 Book Appointment
              </h3>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <select
                    value={appointmentData.service_type}
                    onChange={(e) => setAppointmentData(prev => ({
                      ...prev,
                      service_type: e.target.value
                    }))}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    <option value="">Select Service Type</option>
                    {services.map(service => (
                      <option key={service.id} value={service.title}>
                        {service.title} - {service.price}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={appointmentData.preferred_date}
                    onChange={(e) => setAppointmentData(prev => ({
                      ...prev,
                      preferred_date: e.target.value
                    }))}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      backdropFilter: 'blur(5px)'
                    }}
                  />
                  <input
                    type="time"
                    value={appointmentData.preferred_time}
                    onChange={(e) => setAppointmentData(prev => ({
                      ...prev,
                      preferred_time: e.target.value
                    }))}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      backdropFilter: 'blur(5px)'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Vehicle Model"
                    value={appointmentData.vehicle_model}
                    onChange={(e) => setAppointmentData(prev => ({
                      ...prev,
                      vehicle_model: e.target.value
                    }))}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      backdropFilter: 'blur(5px)'
                    }}
                  />
                  <textarea
                    placeholder="Additional Notes"
                    value={appointmentData.additional_notes}
                    onChange={(e) => setAppointmentData(prev => ({
                      ...prev,
                      additional_notes: e.target.value
                    }))}
                    rows={3}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      resize: 'vertical',
                      backdropFilter: 'blur(5px)'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleAppointmentSubmit}
                      style={{
                        background: ORANGE,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.6rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        flex: 1,
                        backdropFilter: 'blur(5px)',
                        boxShadow: `0 4px 15px ${ORANGE}40`
                      }}
                    >
                      Book Appointment
                    </button>
                    <button
                      onClick={() => setShowAppointmentForm(false)}
                      style={{
                        background: 'transparent',
                        color: '#9ca3af',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '0.6rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        backdropFilter: 'blur(5px)'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        select option {
          background: #000000;
          color: white;
        }

        /* Custom scrollbar */
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb {
          background: ${ORANGE};
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: ${ORANGE_LIGHT};
        }

        /* Glass morphism effects */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AIChatbot;