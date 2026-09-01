'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { useAppStore } from '@/lib/store';
import { Shield, Bell, Lock, Key, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, currentRole, adminLoggedIn, setAdminLoggedIn } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password123') {
      setAdminLoggedIn(true);
      setError('');
    } else {
      setError('Invalid Username or Password. Please try again.');
    }
  };

  if (!adminLoggedIn) {
    return (
      <div style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '40px 20px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          backgroundColor: '#1E293B',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          width: '100%',
          maxWidth: '460px',
          padding: '40px',
          border: '1px solid rgba(71, 85, 105, 0.4)',
          position: 'relative',
          color: '#FFFFFF'
        }}>
          {/* Decorative Top Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
            borderRadius: '24px 24px 0 0'
          }} />

          {/* Logo / Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '8px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
            }}>
              <img
                src="/logo.png"
                alt="Ahsora Meds Academy"
                style={{
                  height: '60px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
              Staff & Admin Portal
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginTop: '6px' }}>
              Sign in with your administrator credentials
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#FCA5A5',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid #475569',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                />
                <Shield size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid #475569',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                />
                <Key size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              </div>
            </div>


            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                justifyContent: 'center',
                fontSize: '0.9375rem',
                fontWeight: 700,
                borderRadius: '10px',
                backgroundColor: '#F59E0B',
                color: '#0F172A',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Access Admin Panel
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link href="/" style={{ color: '#94A3B8', fontSize: '0.875rem', textDecoration: 'underline' }}>
                ← Return to Public Guest Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Admin Dark Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Admin Top Bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-blue">
              <Shield size={12} />
              SYSTEM ROLE: {currentRole.toUpperCase()}
            </span>
            <span style={{ fontSize: '0.875rem', color: '#64748B' }}>
              Logged in as <strong>{currentUser.firstName} {currentUser.lastName}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/admin/leads"
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
            >
              + Create Lead
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '32px 28px', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
