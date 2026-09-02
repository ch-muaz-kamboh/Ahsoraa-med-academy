'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, LogOut } from 'lucide-react';

export default function PendingPaymentPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        if (data.payment_approved) {
          router.push('/portal'); // Already approved
        } else {
          setProfile(data);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '48px 40px', width: '100%', maxWidth: '520px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Clock size={32} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Payment Verification Pending</h1>
        <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Your account has been successfully created, but we need to verify your payment before granting access to the student portal.
        </p>

        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Your Student Details
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E2E8F0' }}>
            <span style={{ color: '#475569', fontWeight: 500 }}>Student ID</span>
            <span style={{ color: '#0F172A', fontWeight: 800 }}>{profile?.ama_id || 'Generating...'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E2E8F0' }}>
            <span style={{ color: '#475569', fontWeight: 500 }}>Name</span>
            <span style={{ color: '#0F172A', fontWeight: 600 }}>{profile?.full_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
            <span style={{ color: '#475569', fontWeight: 500 }}>Status</span>
            <span style={{ color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> Pending Review
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
            Check Verification Status
          </button>
          
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', padding: '10px' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
