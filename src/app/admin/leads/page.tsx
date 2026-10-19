'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Filter,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  MoreVertical,
  MessageSquare,
  Download,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Send,
  ShieldCheck,
  Tag,
  KanbanSquare,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Lead, LeadStage, ContactInquiry, NewsletterSubscriber } from '@/types';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

const DEFAULT_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-demo-1',
    name: 'Elena Dumitru',
    firstName: 'Elena',
    lastName: 'Dumitru',
    email: 'elena.dumitru@example.com',
    phone: '+39 349 112 8844',
    topic: 'Italian Medical University Placement',
    message: 'Hello, I scored 65 in the IMAT and want guidance on applying to Milan Bicocca vs Pavia. Are non-EU seats still available?',
    source: 'Contact Page Form',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'inq-demo-2',
    name: 'Hamza Tariq',
    firstName: 'Hamza',
    lastName: 'Tariq',
    email: 'hamza.tariq@example.com',
    phone: '+92 300 123 4567',
    topic: 'Scholarships & Financial Aid',
    message: 'Could you please explain the DSU regional scholarship procedure and deadlines for Messina medical school?',
    source: 'Contact Page Form',
    status: 'in_review',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'inq-demo-3',
    name: 'Sofia Rossi',
    firstName: 'Sofia',
    lastName: 'Rossi',
    email: 'sofia.rossi@example.com',
    phone: '+39 333 456 7890',
    topic: 'IMAT Preparation & Courses',
    message: 'I would like to enrol in the MedPath Elite 2027 live batch. Do you provide 1-on-1 chemistry mentorship sessions?',
    source: 'Contact Page Form',
    status: 'replied',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-demo-1',
    name: 'Marcus Vance',
    email: 'marcus.v@gmail.com',
    source: 'IMAT Starter Kit Download',
    status: 'subscribed',
    subscribedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'sub-demo-2',
    name: 'Amina El-Sayed',
    email: 'amina.med@outlook.com',
    source: 'News & Updates Newsletter',
    status: 'subscribed',
    subscribedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'sub-demo-3',
    name: 'Lucas Bernard',
    email: 'l.bernard@yahoo.fr',
    source: 'IMAT Starter Kit Download',
    status: 'subscribed',
    subscribedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export default function AdminLeadsPage() {
  const { leads, updateLeadStage } = useAppStore();

  // Active Main Tab: 'inquiries' | 'subscribers' | 'pipeline'
  const [activeTab, setActiveTab] = useState<'inquiries' | 'subscribers' | 'pipeline'>('inquiries');

  // Pipeline view mode: 'kanban' | 'table'
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState<string>('all');
  const [inquiryFilterTopic, setInquiryFilterTopic] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Subscribers State
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberSourceFilter, setSubscriberSourceFilter] = useState<string>('all');
  const [copyToast, setCopyToast] = useState(false);
  const [inquiryCopyToast, setInquiryCopyToast] = useState(false);

  // Pipeline Filter States
  const [pipelineSearch, setPipelineSearch] = useState('');
  const [pipelineExamFilter, setPipelineExamFilter] = useState<string>('all');
  const [pipelinePriorityFilter, setPipelinePriorityFilter] = useState<string>('all');

  // Cloud Sync State
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('Just now');
  const [cloudStatus, setCloudStatus] = useState<'synced' | 'connecting' | 'local'>('synced');

  // Load Inquiries & Subscribers from LocalStorage + Supabase
  const loadStoredData = () => {
    if (typeof window === 'undefined') return;

    try {
      const storedInquiries = localStorage.getItem('ahsora_contact_inquiries');
      if (storedInquiries) {
        setInquiries(JSON.parse(storedInquiries));
      } else {
        localStorage.setItem('ahsora_contact_inquiries', JSON.stringify(DEFAULT_INQUIRIES));
        setInquiries(DEFAULT_INQUIRIES);
      }
    } catch {
      setInquiries(DEFAULT_INQUIRIES);
    }

    try {
      const storedSubs = localStorage.getItem('ahsora_subscribers');
      const starterKitLeads = localStorage.getItem('ahsora_starter_kit_leads');
      let combined: NewsletterSubscriber[] = [];

      if (storedSubs) {
        combined = JSON.parse(storedSubs);
      } else {
        combined = [...DEFAULT_SUBSCRIBERS];
      }

      // Merge any leads from starter kit
      if (starterKitLeads) {
        try {
          const kitList = JSON.parse(starterKitLeads);
          kitList.forEach((k: { name?: string; email: string; createdAt: string; source?: string }) => {
            if (!combined.some((s) => s.email.toLowerCase() === k.email.toLowerCase())) {
              combined.push({
                id: `kit-${Date.now()}-${Math.random()}`,
                name: k.name || 'Candidate',
                email: k.email,
                source: k.source || 'IMAT Starter Kit Download',
                status: 'subscribed',
                subscribedAt: k.createdAt || new Date().toISOString(),
              });
            }
          });
        } catch {}
      }

      localStorage.setItem('ahsora_subscribers', JSON.stringify(combined));
      setSubscribers(combined);
    } catch {
      setSubscribers(DEFAULT_SUBSCRIBERS);
    }
  };

  // Sync with Supabase Database
  const syncWithSupabase = async () => {
    setSyncing(true);
    setCloudStatus('connecting');

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data: dbLeads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase leads query note:', error.message);
        setCloudStatus('local');
      } else if (dbLeads && dbLeads.length > 0) {
        setCloudStatus('synced');

        // 1. Process contact inquiries from Supabase
        const remoteInquiries: ContactInquiry[] = [];
        const remoteSubscribers: NewsletterSubscriber[] = [];

        dbLeads.forEach((row: any) => {
          const notesStr = row.notes || '';
          const isContactInquiry =
            row.academic_background === 'Contact Page Inquiry' ||
            notesStr.includes('[Topic:') ||
            notesStr.includes('[INQ-') ||
            row.source === 'Contact Page Form';

          if (isContactInquiry) {
            let topic = row.target_exam || 'General Inquiry';
            let message = notesStr;
            const topicMatch = notesStr.match(/\[Topic:\s*([^\]]+)\]\s*(.*)/i);
            if (topicMatch) {
              topic = topicMatch[1];
              message = topicMatch[2];
            }

            remoteInquiries.push({
              id: `remote-${row.id}`,
              name: row.name || 'Student Lead',
              email: row.email,
              phone: row.phone || undefined,
              topic,
              message,
              source: 'Contact Page Form',
              status: row.status === 'converted' ? 'resolved' : 'new',
              createdAt: row.created_at || new Date().toISOString(),
            });
          }

          const isSubscriber =
            row.academic_background === 'Starter Kit Download' ||
            row.academic_background === 'IMAT Starter Kit' ||
            row.academic_background === 'Newsletter Subscriber' ||
            notesStr.toLowerCase().includes('starter kit') ||
            notesStr.toLowerCase().includes('newsletter');

          if (isSubscriber) {
            remoteSubscribers.push({
              id: `sub-remote-${row.id}`,
              name: row.name || 'Candidate',
              email: row.email,
              source: notesStr.toLowerCase().includes('newsletter')
                ? 'News & Updates Newsletter'
                : 'IMAT Starter Kit Download',
              status: 'subscribed',
              subscribedAt: row.created_at || new Date().toISOString(),
            });
          }
        });

        // Merge inquiries
        if (remoteInquiries.length > 0) {
          setInquiries((prev) => {
            const merged = [...prev];
            remoteInquiries.forEach((ri) => {
              if (!merged.some((m) => m.email.toLowerCase() === ri.email.toLowerCase() && m.message === ri.message)) {
                merged.unshift(ri);
              }
            });
            localStorage.setItem('ahsora_contact_inquiries', JSON.stringify(merged));
            return merged;
          });
        }

        // Merge subscribers
        if (remoteSubscribers.length > 0) {
          setSubscribers((prev) => {
            const merged = [...prev];
            remoteSubscribers.forEach((rs) => {
              if (!merged.some((m) => m.email.toLowerCase() === rs.email.toLowerCase())) {
                merged.unshift(rs);
              }
            });
            localStorage.setItem('ahsora_subscribers', JSON.stringify(merged));
            return merged;
          });
        }
      }

      setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      console.warn('Supabase sync exception:', e);
      setCloudStatus('local');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadStoredData();
    syncWithSupabase();

    // Listen to live events dispatched by contact form and subscribe components
    const handleInquiryUpdate = (e: any) => {
      loadStoredData();
    };

    const handleSubscriberUpdate = (e: any) => {
      loadStoredData();
    };

    window.addEventListener('ahsora_contact_updated', handleInquiryUpdate);
    window.addEventListener('ahsora_subscribers_updated', handleSubscriberUpdate);
    window.addEventListener('storage', handleInquiryUpdate);

    return () => {
      window.removeEventListener('ahsora_contact_updated', handleInquiryUpdate);
      window.removeEventListener('ahsora_subscribers_updated', handleSubscriberUpdate);
      window.removeEventListener('storage', handleInquiryUpdate);
    };
  }, []);

  // Inquiries status update handler
  const handleUpdateInquiryStatus = (id: string, newStatus: ContactInquiry['status']) => {
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, status: newStatus } : inq
    );
    setInquiries(updated);
    localStorage.setItem('ahsora_contact_inquiries', JSON.stringify(updated));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  // Inquiries delete handler
  const handleDeleteInquiry = (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    localStorage.setItem('ahsora_contact_inquiries', JSON.stringify(updated));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
  };

  // Subscribers delete handler
  const handleDeleteSubscriber = (id: string) => {
    if (!confirm('Remove this subscriber from the mailing list?')) return;
    const updated = subscribers.filter((s) => s.id !== id);
    setSubscribers(updated);
    localStorage.setItem('ahsora_subscribers', JSON.stringify(updated));
  };

  // Copy all subscribers emails
  const handleCopyAllEmails = () => {
    const emailList = filteredSubscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Export subscribers to CSV
  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Source,Status,SubscribedAt\n';
    const rows = filteredSubscribers
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.email}","${s.source}","${s.status}","${s.subscribedAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ahsora_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy all contact inquiry emails
  const handleCopyInquiryEmails = () => {
    const emailList = filteredInquiries.map((i) => i.email).filter(Boolean).join(', ');
    if (!emailList) {
      alert('No email addresses found to copy.');
      return;
    }
    navigator.clipboard.writeText(emailList);
    setInquiryCopyToast(true);
    setTimeout(() => setInquiryCopyToast(false), 2500);
  };

  // Export contact inquiries to CSV
  const handleExportInquiryCSV = () => {
    if (filteredInquiries.length === 0) {
      alert('No contact inquiries match the current filter to export.');
      return;
    }
    const headers = 'Inquiry ID,Full Name,Email,Phone,Topic,Status,Created At,Message\n';
    const rows = filteredInquiries
      .map(
        (i) =>
          `"${i.id}","${(i.name || '').replace(/"/g, '""')}","${(i.email || '').replace(/"/g, '""')}","${(i.phone || '').replace(/"/g, '""')}","${(i.topic || '').replace(/"/g, '""')}","${i.status}","${i.createdAt}","${(i.message || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ahsora_contact_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        (inq.phone && inq.phone.includes(inquirySearch)) ||
        inq.topic.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inq.message.toLowerCase().includes(inquirySearch.toLowerCase());

      const matchStatus =
        inquiryFilterStatus === 'all' || inq.status === inquiryFilterStatus;

      const matchTopic =
        inquiryFilterTopic === 'all' || inq.topic === inquiryFilterTopic;

      return matchSearch && matchStatus && matchTopic;
    });
  }, [inquiries, inquirySearch, inquiryFilterStatus, inquiryFilterTopic]);

  // Filtered Subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchSearch =
        sub.name.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
        sub.email.toLowerCase().includes(subscriberSearch.toLowerCase());

      const matchSource =
        subscriberSourceFilter === 'all' || sub.source === subscriberSourceFilter;

      return matchSearch && matchSource;
    });
  }, [subscribers, subscriberSearch, subscriberSourceFilter]);

  // Unique topics for inquiries filter
  const uniqueTopics = useMemo(() => {
    return Array.from(new Set(inquiries.map((i) => i.topic).filter(Boolean)));
  }, [inquiries]);

  // Unique sources for subscribers filter
  const uniqueSources = useMemo(() => {
    return Array.from(new Set(subscribers.map((s) => s.source).filter(Boolean)));
  }, [subscribers]);

  // Filtered Leads for CRM Pipeline
  const filteredLeads = useMemo(() => {
    return leads.filter((ld) => {
      const matchSearch =
        !pipelineSearch ||
        ld.name.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
        ld.email.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
        (ld.phone && ld.phone.includes(pipelineSearch)) ||
        ld.leadCode.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
        ld.targetExam.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
        ld.country.toLowerCase().includes(pipelineSearch.toLowerCase());

      const matchExam =
        pipelineExamFilter === 'all' ||
        ld.targetExam.toLowerCase().includes(pipelineExamFilter.toLowerCase());

      const matchPriority =
        pipelinePriorityFilter === 'all' || ld.priority === pipelinePriorityFilter;

      return matchSearch && matchExam && matchPriority;
    });
  }, [leads, pipelineSearch, pipelineExamFilter, pipelinePriorityFilter]);

  // Counts
  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  const stages: { stage: LeadStage; title: string; color: string }[] = [
    { stage: 'new', title: 'New Leads', color: '#14B8A6' },
    { stage: 'contacted', title: 'Contacted', color: '#6366F1' },
    { stage: 'qualified', title: 'Qualified', color: '#8B5CF6' },
    { stage: 'counselling_booked', title: 'Counselling Booked', color: '#F59E0B' },
    { stage: 'proposal_sent', title: 'Proposal Sent', color: '#EC4899' },
    { stage: 'converted', title: 'Converted / Enrolled', color: '#10B981' },
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* ── TOP HEADER & SYNC CONTROLS ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Leads, Inquiries &amp; Subscriptions Hub
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: cloudStatus === 'synced' ? '#ECFDF5' : '#FEF3C7',
                color: cloudStatus === 'synced' ? '#059669' : '#D97706',
                border: `1px solid ${cloudStatus === 'synced' ? '#A7F3D0' : '#FDE68A'}`,
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: cloudStatus === 'synced' ? '#10B981' : '#F59E0B',
                }}
              />
              {cloudStatus === 'synced' ? 'Supabase Cloud Synced' : 'Offline / Local Ready'}
            </span>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.9375rem', margin: 0 }}>
            Unified live inbox for Contact Page form inquiries, Starter Kit &amp; Newsletter subscribers, and CRM admissions pipeline.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={syncWithSupabase}
            disabled={syncing}
            style={{
              padding: '9px 16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              color: '#334155',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: syncing ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <RefreshCw size={15} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{syncing ? 'Syncing...' : 'Sync Cloud Now'}</span>
            <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>({lastSynced})</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.875rem' }}
          >
            <Plus size={16} />
            <span>Add Manual Lead</span>
          </button>
        </div>
      </div>

      {/* ── METRICS OVERVIEW CARDS ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Metric 1 */}
        <div
          onClick={() => setActiveTab('inquiries')}
          style={{
            backgroundColor: activeTab === 'inquiries' ? '#F0FDF4' : '#FFFFFF',
            border: `1.5px solid ${activeTab === 'inquiries' ? '#22C55E' : '#E2E8F0'}`,
            borderRadius: '14px',
            padding: '18px 20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Contact Inquiries
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={17} color="#16A34A" />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
            {inquiries.length}
          </div>
          <div style={{ fontSize: '0.8125rem', color: unreadInquiriesCount > 0 ? '#DC2626' : '#16A34A', fontWeight: 600, marginTop: '6px' }}>
            {unreadInquiriesCount > 0 ? `● ${unreadInquiriesCount} new / pending review` : '✓ All inquiries reviewed'}
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => setActiveTab('subscribers')}
          style={{
            backgroundColor: activeTab === 'subscribers' ? '#F0FDF4' : '#FFFFFF',
            border: `1.5px solid ${activeTab === 'subscribers' ? '#22C55E' : '#E2E8F0'}`,
            borderRadius: '14px',
            padding: '18px 20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Subscribers &amp; Kit Downloads
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={17} color="#4F46E5" />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
            {subscribers.length}
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#6366F1', fontWeight: 600, marginTop: '6px' }}>
            {subscribers.filter((s) => s.source.includes('Starter Kit')).length} Starter Kit + {subscribers.filter((s) => s.source.includes('Newsletter')).length} Newsletter
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => setActiveTab('pipeline')}
          style={{
            backgroundColor: activeTab === 'pipeline' ? '#F0FDF4' : '#FFFFFF',
            border: `1.5px solid ${activeTab === 'pipeline' ? '#22C55E' : '#E2E8F0'}`,
            borderRadius: '14px',
            padding: '18px 20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              CRM Admissions Pipeline
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KanbanSquare size={17} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
            {leads.length}
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, marginTop: '6px' }}>
            {leads.filter((l) => l.stage === 'converted').length} converted students enrolled
          </div>
        </div>
      </div>

      {/* ── MAIN TABS NAVIGATION ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #E2E8F0',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => setActiveTab('inquiries')}
          style={{
            padding: '12px 20px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'inquiries' ? '3px solid #16A34A' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'inquiries' ? '#16A34A' : '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <MessageSquare size={17} />
          <span>Contact Page Form Inquiries</span>
          {unreadInquiriesCount > 0 && (
            <span
              style={{
                backgroundColor: '#DC2626',
                color: '#FFF',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '1px 7px',
                borderRadius: '10px',
              }}
            >
              {unreadInquiriesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          style={{
            padding: '12px 20px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'subscribers' ? '3px solid #16A34A' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'subscribers' ? '#16A34A' : '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <Mail size={17} />
          <span>Subscribers &amp; Kit Downloads</span>
          <span
            style={{
              backgroundColor: '#F1F5F9',
              color: '#475569',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '1px 8px',
              borderRadius: '10px',
            }}
          >
            {subscribers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          style={{
            padding: '12px 20px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'pipeline' ? '3px solid #16A34A' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'pipeline' ? '#16A34A' : '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <KanbanSquare size={17} />
          <span>CRM Pipeline ({leads.length})</span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: CONTACT FORM INQUIRIES ── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'inquiries' && (
        <div>
          {/* Inquiries Filters Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flex: '1 1 340px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Search inquiries by student name, email, phone, topic, or message..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Topic Filter */}
              <select
                value={inquiryFilterTopic}
                onChange={(e) => setInquiryFilterTopic(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                }}
              >
                <option value="all">All Topics ({inquiries.length})</option>
                {uniqueTopics.map((top) => (
                  <option key={top} value={top}>
                    {top}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Tabs Filter */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { key: 'all', label: 'All Inquiries' },
                { key: 'new', label: 'New / Unread' },
                { key: 'in_review', label: 'In Review' },
                { key: 'replied', label: 'Replied' },
                { key: 'resolved', label: 'Resolved' },
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => setInquiryFilterStatus(st.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: inquiryFilterStatus === st.key ? '#16A34A' : '#E2E8F0',
                    backgroundColor: inquiryFilterStatus === st.key ? '#DCFCE7' : '#FFFFFF',
                    color: inquiryFilterStatus === st.key ? '#15803D' : '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Action Buttons: Copy All Emails & Export CSV */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleCopyInquiryEmails}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {inquiryCopyToast ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                <span>{inquiryCopyToast ? 'Copied Emails!' : 'Copy All Emails'}</span>
              </button>

              <button
                onClick={handleExportInquiryCSV}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Inquiries Cards List */}
          {filteredInquiries.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px dashed #CBD5E1',
                padding: '60px 20px',
                textAlign: 'center',
              }}
            >
              <MessageSquare size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#1E293B', marginBottom: '6px' }}>No contact inquiries found</h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                Try adjusting your search query or status filter. New submissions from the contact page will automatically show up here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredInquiries.map((inq) => {
                const isNew = inq.status === 'new';
                const formattedDate = new Date(inq.createdAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={inq.id}
                    style={{
                      backgroundColor: isNew ? '#F0FDF4' : '#FFFFFF',
                      borderRadius: '14px',
                      border: isNew ? '2px solid #16A34A' : '1px solid #E2E8F0',
                      borderLeft: isNew ? '6px solid #16A34A' : '4px solid #CBD5E1',
                      padding: '20px 24px',
                      boxShadow: isNew ? '0 4px 18px rgba(22, 163, 74, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Inquiry Top Row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: isNew ? '#DCFCE7' : '#F1F5F9',
                            color: isNew ? '#16A34A' : '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1rem',
                            border: isNew ? '1px solid #86EFAC' : 'none',
                          }}
                        >
                          {inq.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                              {inq.name}
                            </h3>
                            {isNew && (
                              <span
                                style={{
                                  backgroundColor: '#16A34A',
                                  color: '#FFFFFF',
                                  fontSize: '0.6875rem',
                                  fontWeight: 800,
                                  padding: '2px 9px',
                                  borderRadius: '12px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  letterSpacing: '0.5px',
                                  boxShadow: '0 2px 6px rgba(22, 163, 74, 0.35)',
                                }}
                              >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'inline-block' }} />
                                NEW / UNREAD
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', gap: '12px', marginTop: '2px', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={13} color="#94A3B8" /> {inq.email}
                            </span>
                            {inq.phone && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Phone size={13} color="#16A34A" /> {inq.phone}
                              </span>
                            )}
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={13} color="#94A3B8" /> {formattedDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Selector & Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {isNew && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'in_review')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#DCFCE7',
                              border: '1px solid #86EFAC',
                              color: '#166534',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Mark Reviewed
                          </button>
                        )}

                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '20px',
                            backgroundColor: '#F0FDF4',
                            color: '#15803D',
                            border: '1px solid #BBF7D0',
                          }}
                        >
                          <Tag size={11} style={{ marginRight: '4px', display: 'inline' }} />
                          {inq.topic}
                        </span>

                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            outline: 'none',
                            cursor: 'pointer',
                            border: '1px solid #CBD5E1',
                            backgroundColor:
                              inq.status === 'replied'
                                ? '#DCFCE7'
                                : inq.status === 'in_review'
                                ? '#FEF3C7'
                                : inq.status === 'resolved'
                                ? '#E2E8F0'
                                : '#FFFFFF',
                            color:
                              inq.status === 'replied'
                                ? '#166534'
                                : inq.status === 'in_review'
                                ? '#B45309'
                                : inq.status === 'resolved'
                                ? '#475569'
                                : '#0F172A',
                          }}
                        >
                          <option value="new">Status: New</option>
                          <option value="in_review">Status: In Review</option>
                          <option value="replied">Status: Replied</option>
                          <option value="resolved">Status: Resolved</option>
                        </select>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        borderLeft: '4px solid #16A34A',
                        marginBottom: '14px',
                        fontSize: '0.9375rem',
                        color: '#334155',
                        lineHeight: 1.6,
                      }}
                    >
                      {inq.message}
                    </div>

                    {/* Inquiry Actions Bar */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #F1F5F9',
                        paddingTop: '12px',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                        Source: <strong>{inq.source || 'Contact Form'}</strong> • Ref ID: <code>{inq.id}</code>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {/* Mailto Action */}
                        <a
                          href={`mailto:${inq.email}?subject=Re: [Ahsora Meds] ${encodeURIComponent(inq.topic)}&body=Dear ${encodeURIComponent(inq.name)},%0D%0A%0D%0AThank you for reaching out to Ahsora Meds regarding "${encodeURIComponent(inq.topic)}".%0D%0A%0D%0ARegarding your inquiry: "${encodeURIComponent(inq.message)}"%0D%0A%0D%0A`}
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'replied')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            backgroundColor: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            color: '#15803D',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <Send size={13} /> Reply via Email
                        </a>

                        {/* WhatsApp Action */}
                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(inq.name)},%20this%20is%20Ahsora%20Meds%20Admissions%20following%20up%20on%20your%20inquiry%20regarding%20${encodeURIComponent(inq.topic)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'in_review')}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '6px',
                              backgroundColor: '#DCFCE7',
                              border: '1px solid #86EFAC',
                              color: '#166534',
                              fontSize: '0.8125rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <Phone size={13} /> Chat on WhatsApp
                          </a>
                        )}

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #F1F5F9',
                            backgroundColor: '#FFFFFF',
                            color: '#94A3B8',
                            fontSize: '0.8125rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          title="Delete inquiry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: SUBSCRIBERS & STARTER KIT DOWNLOADS ── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'subscribers' && (
        <div>
          {/* Subscribers Controls Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flex: '1 1 340px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Filter subscribers by name or email..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Source Filter */}
              <select
                value={subscriberSourceFilter}
                onChange={(e) => setSubscriberSourceFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                }}
              >
                <option value="all">All Sources ({subscribers.length})</option>
                {uniqueSources.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Export & Copy Actions */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handleCopyAllEmails}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {copyToast ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                <span>{copyToast ? 'Copied Emails!' : 'Copy All Emails'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Subscribers Table View */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: 0, overflow: 'hidden', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '14px 18px' }}>Subscriber Name</th>
                  <th style={{ padding: '14px 18px' }}>Email Address</th>
                  <th style={{ padding: '14px 18px' }}>Acquisition Source</th>
                  <th style={{ padding: '14px 18px' }}>Subscribed Date</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                      No subscribers match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => {
                    const isKit = sub.source.toLowerCase().includes('starter kit');
                    const formattedSubDate = new Date(sub.subscribedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A' }}>
                          {sub.name}
                        </td>
                        <td style={{ padding: '14px 18px', color: '#16A34A', fontWeight: 600 }}>
                          <a
                            href={`mailto:${sub.email}`}
                            style={{ color: '#059669', textDecoration: 'none' }}
                          >
                            {sub.email}
                          </a>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '16px',
                              backgroundColor: isKit ? '#EEF2FF' : '#F0FDF4',
                              color: isKit ? '#4338CA' : '#15803D',
                              border: `1px solid ${isKit ? '#C7D2FE' : '#BBF7D0'}`,
                            }}
                          >
                            {sub.source}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '0.8125rem' }}>
                          {formattedSubDate}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '10px',
                              backgroundColor: '#DCFCE7',
                              color: '#166534',
                              textTransform: 'uppercase',
                            }}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <a
                              href={`mailto:${sub.email}?subject=Hello from Ahsora Meds Academy`}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#F1F5F9',
                                color: '#475569',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Send size={12} /> Email
                            </a>
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #F1F5F9',
                                backgroundColor: '#FFFFFF',
                                color: '#EF4444',
                                cursor: 'pointer',
                              }}
                              title="Delete subscriber"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 3: CRM PIPELINE VIEW ── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pipeline' && (
        <div>
          {/* CRM Controls & Search Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', flex: '1 1 340px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Search leads by name, code, email, exam..."
                  value={pipelineSearch}
                  onChange={(e) => setPipelineSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Exam Filter */}
              <select
                value={pipelineExamFilter}
                onChange={(e) => setPipelineExamFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                }}
              >
                <option value="all">All Exams</option>
                <option value="IMAT">IMAT</option>
                <option value="USMLE">USMLE</option>
                <option value="TOLC-MED">TOLC-MED</option>
                <option value="NEET">NEET</option>
              </select>

              {/* Priority Filter */}
              <select
                value={pipelinePriorityFilter}
                onChange={(e) => setPipelinePriorityFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                }}
              >
                <option value="all">All Priorities</option>
                <option value="hot">🔥 Hot Priority</option>
                <option value="warm">⚡ Warm</option>
                <option value="cold">❄️ Cold</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
              >
                <Plus size={15} />
                <span>Add CRM Lead</span>
              </button>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '3px',
                  display: 'flex',
                  gap: '2px',
                }}
              >
                <button
                  onClick={() => setViewMode('kanban')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    backgroundColor: viewMode === 'kanban' ? '#16A34A' : 'transparent',
                    color: viewMode === 'kanban' ? '#FFFFFF' : '#64748B',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    backgroundColor: viewMode === 'table' ? '#16A34A' : 'transparent',
                    color: viewMode === 'table' ? '#FFFFFF' : '#64748B',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* Kanban Board View */}
          {viewMode === 'kanban' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '16px',
                alignItems: 'start',
                overflowX: 'auto',
                paddingBottom: '20px',
              }}
            >
              {stages.map((col) => {
                const colLeads = filteredLeads.filter((l) => l.stage === col.stage);
                return (
                  <div
                    key={col.stage}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      minHeight: '400px',
                    }}
                  >
                    {/* Column Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '10px',
                        borderBottom: `2px solid ${col.color}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                        <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>{col.title}</strong>
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: '#F1F5F9',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          color: '#475569',
                        }}
                      >
                        {colLeads.length}
                      </span>
                    </div>

                    {/* Lead Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {colLeads.length === 0 ? (
                        <div style={{ padding: '24px 10px', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem', border: '1px dashed #E2E8F0', borderRadius: '8px' }}>
                          No leads in this stage
                        </div>
                      ) : (
                        colLeads.map((ld) => (
                          <div
                            key={ld.id}
                            style={{
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              borderRadius: '8px',
                              padding: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onClick={() => setSelectedLead(ld)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#16A34A' }}>
                                {ld.leadCode}
                              </span>
                              <span className={ld.priority === 'hot' ? 'badge badge-red' : 'badge badge-amber'} style={{ padding: '1px 6px', fontSize: '0.6875rem' }}>
                                {ld.priority.toUpperCase()}
                              </span>
                            </div>

                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem', marginBottom: '4px' }}>
                              {ld.name}
                            </div>

                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>
                              {ld.targetExam} • {ld.country}
                            </div>

                            {/* Direct Communication Quick Links */}
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }} onClick={(e) => e.stopPropagation()}>
                              <a
                                href={`mailto:${ld.email}?subject=Ahsora%20Meds%20Admissions%20Follow-up`}
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '5px',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  color: '#0F172A',
                                  fontSize: '0.72rem',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontWeight: 600,
                                }}
                              >
                                <Mail size={11} color="#64748B" /> Email
                              </a>
                              {ld.phone && (
                                <a
                                  href={`https://wa.me/${ld.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ld.name)},%20this%20is%20Ahsora%20Meds%20Admissions.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    padding: '3px 8px',
                                    borderRadius: '5px',
                                    backgroundColor: '#DCFCE7',
                                    border: '1px solid #86EFAC',
                                    color: '#166534',
                                    fontSize: '0.72rem',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 700,
                                  }}
                                >
                                  <Phone size={11} color="#16A34A" /> WhatsApp
                                </a>
                              )}
                            </div>

                            {/* Move Stage Selector */}
                            <div
                              style={{
                                borderTop: '1px solid #E2E8F0',
                                paddingTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <select
                                className="form-select"
                                style={{ fontSize: '0.75rem', padding: '3px 6px', width: '100%', borderRadius: '6px' }}
                                value={ld.stage}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updateLeadStage(ld.id, e.target.value as LeadStage)}
                              >
                                {stages.map((s) => (
                                  <option key={s.stage} value={s.stage}>
                                    Move to: {s.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: 0, overflow: 'hidden', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '14px 16px' }}>Code</th>
                    <th style={{ padding: '14px 16px' }}>Lead Name</th>
                    <th style={{ padding: '14px 16px' }}>Target Exam &amp; Country</th>
                    <th style={{ padding: '14px 16px' }}>Contact</th>
                    <th style={{ padding: '14px 16px' }}>Stage</th>
                    <th style={{ padding: '14px 16px' }}>Counsellor</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                        No leads match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((ld) => (
                      <tr key={ld.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#16A34A' }}>
                          {ld.leadCode}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>
                          <div style={{ cursor: 'pointer' }} onClick={() => setSelectedLead(ld)}>
                            {ld.name}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#334155' }}>
                          {ld.targetExam} ({ld.targetCountry})
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.8125rem' }}>
                          <div>{ld.email}</div>
                          <div style={{ color: '#16A34A', fontWeight: 600 }}>{ld.phone}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <select
                            value={ld.stage}
                            onChange={(e) => updateLeadStage(ld.id, e.target.value as LeadStage)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {stages.map((s) => (
                              <option key={s.stage} value={s.stage}>
                                {s.title}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#334155' }}>
                          {ld.assignedCounsellor || 'Unassigned'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <a
                              href={`mailto:${ld.email}`}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '5px',
                                backgroundColor: '#F1F5F9',
                                color: '#475569',
                                fontSize: '0.75rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <Mail size={12} /> Email
                            </a>
                            {ld.phone && (
                              <a
                                href={`https://wa.me/${ld.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ld.name)},%20this%20is%20Ahsora%20Meds.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '5px',
                                  backgroundColor: '#DCFCE7',
                                  color: '#166534',
                                  fontSize: '0.75rem',
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                }}
                              >
                                <Phone size={12} /> WA
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Selected Lead Modal */}
      {selectedLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '4px' }}>
                  {selectedLead.leadCode}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#0F172A', margin: '4px 0 0 0', fontWeight: 800 }}>
                  {selectedLead.name}
                </h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="btn-outline" style={{ padding: '4px 10px' }}>
                Close
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '20px' }}>
              <div>Email: <strong>{selectedLead.email}</strong></div>
              <div>Phone / WhatsApp: <strong>{selectedLead.phone}</strong></div>
              <div>Location: <strong>{selectedLead.country}</strong></div>
              <div>Target Exam: <strong>{selectedLead.targetExam}</strong></div>
              <div>Target Country: <strong>{selectedLead.targetCountry}</strong></div>
              <div>Academic Background: <strong>{selectedLead.academicBackground}</strong></div>
              <div>Budget: <strong>{selectedLead.budgetRange}</strong></div>
              {selectedLead.notes && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #16A34A' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Staff Notes</div>
                  <p style={{ color: '#334155', margin: '4px 0 0 0' }}>{selectedLead.notes}</p>
                </div>
              )}

              {/* Stage selector inside modal */}
              <div style={{ marginTop: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Current Pipeline Stage
                </label>
                <select
                  value={selectedLead.stage}
                  onChange={(e) => {
                    const newStage = e.target.value as LeadStage;
                    updateLeadStage(selectedLead.id, newStage);
                    setSelectedLead({ ...selectedLead, stage: newStage });
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {stages.map((s) => (
                    <option key={s.stage} value={s.stage}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Direct Communication Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <a
                  href={`mailto:${selectedLead.email}?subject=Ahsora%20Meds%20Academy%20Admissions`}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: '#F1F5F9',
                    color: '#0F172A',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Mail size={14} /> Send Email
                </a>
                {selectedLead.phone && (
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedLead.name)},%20this%20is%20Ahsora%20Meds.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Phone size={14} color="#16A34A" /> WhatsApp Chat
                  </a>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  updateLeadStage(selectedLead.id, 'converted');
                  setSelectedLead(null);
                }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', backgroundColor: '#10B981' }}
              >
                Convert to Enrolled Student Account
              </button>
            </div>
          </div>
        </div>
      )}

      <LeadCaptureModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
