'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ACADEMY_PACKAGES, CoursePackage, getPackageByIdOrName, saveStudentPackageMapping } from '@/lib/packages';
import { getDynamicPackagePrices, syncPricesFromSupabase, DynamicPackagePrice } from '@/lib/cms-store';
import { ArrowRight, Check, CheckCircle2, Globe, Lock, Mail, Phone, Sparkles, User, ShieldCheck, Eye, EyeOff, MapPin } from 'lucide-react';
import Logo from '@/components/brand/Logo';

interface CountryDialCode {
  name: string;
  code: string;
  dial: string;
  flag: string;
}

const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { name: 'Italy', code: 'IT', dial: '+39', flag: '🇮🇹' },
  { name: 'Pakistan', code: 'PK', dial: '+92', flag: '🇵🇰' },
  { name: 'United Arab Emirates', code: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
  { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
  { name: 'Turkey', code: 'TR', dial: '+90', flag: '🇹🇷' },
  { name: 'Egypt', code: 'EG', dial: '+20', flag: '🇪🇬' },
  { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
  { name: 'Oman', code: 'OM', dial: '+968', flag: '🇴🇲' },
  { name: 'Qatar', code: 'QA', dial: '+974', flag: '🇶🇦' },
  { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼' },
  { name: 'Bahrain', code: 'BH', dial: '+973', flag: '🇧🇭' },
  { name: 'Jordan', code: 'JO', dial: '+962', flag: '🇯🇴' },
  { name: 'Bangladesh', code: 'BD', dial: '+880', flag: '🇧🇩' },
  { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'Spain', code: 'ES', dial: '+34', flag: '🇪🇸' },
  { name: 'Switzerland', code: 'CH', dial: '+41', flag: '🇨🇭' },
  { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
  { name: 'Other', code: 'OT', dial: '+1', flag: '🌐' },
];

const COUNTRIES = COUNTRY_DIAL_CODES.map((c) => c.name);

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    country: 'Italy',
    countryCode: '+39',
    localPhone: '',
    whatsappNumber: '+39',
    selectedPackage: 'ascend', // default: Ahsora IMAT Ascend (€299)
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic pricing & discounts
  const [dynamicPrices, setDynamicPrices] = useState<DynamicPackagePrice[]>([]);

  React.useEffect(() => {
    const loadPrices = () => {
      const prices = getDynamicPackagePrices();
      setDynamicPrices(prices);
      // Auto-switch to available package if currently selected is disabled
      const current = prices.find((p) => p.id === formData.selectedPackage);
      if (current && current.isAvailable === false) {
        const firstAvailable = ACADEMY_PACKAGES.find((pkg) => {
          const match = prices.find((p) => p.id === pkg.id);
          return match?.isAvailable !== false;
        });
        if (firstAvailable) {
          setFormData((prev) => ({ ...prev, selectedPackage: firstAvailable.id }));
        }
      }
    };

    loadPrices();
    syncPricesFromSupabase().then((prices) => {
      if (prices && prices.length > 0) setDynamicPrices(prices);
    });

    const handlePriceUpdate = () => loadPrices();
    window.addEventListener('ahsora_cms_prices_updated', handlePriceUpdate);
    window.addEventListener('ahsora_cms_package_availability_updated', handlePriceUpdate);
    window.addEventListener('storage', handlePriceUpdate);

    return () => {
      window.removeEventListener('ahsora_cms_prices_updated', handlePriceUpdate);
      window.removeEventListener('ahsora_cms_package_availability_updated', handlePriceUpdate);
      window.removeEventListener('storage', handlePriceUpdate);
    };
  }, [formData.selectedPackage]);

  const getPriceData = (pkgId: string) => {
    const found = dynamicPrices.find((p) => p.id === pkgId);
    if (!found) {
      const defaultOrig = pkgId === 'ascend' ? '€399' : pkgId === 'mastery' ? '€649' : '€999';
      const defaultSale = pkgId === 'ascend' ? '€299' : pkgId === 'mastery' ? '€499' : '€799';
      const defaultBadge = pkgId === 'ascend' ? '25% OFF' : pkgId === 'mastery' ? '23% OFF' : '20% OFF';
      return {
        price: defaultSale,
        originalPrice: defaultOrig,
        badge: defaultBadge,
        discountPercentage: defaultBadge,
      };
    }

    let calculatedBadge = found.discountBadge;
    if (!calculatedBadge && found.numericOriginalPrice && found.numericPrice && found.numericOriginalPrice > found.numericPrice) {
      const pct = Math.round(((found.numericOriginalPrice - found.numericPrice) / found.numericOriginalPrice) * 100);
      calculatedBadge = `${pct}% OFF`;
    }

    const isAvail = found ? found.isAvailable !== false : true;
    const disabledNotice = found?.disabledNotice || 'Currently Unavailable';

    return {
      price: found ? found.price : (pkgId === 'ascend' ? '€299' : pkgId === 'mastery' ? '€499' : '€799'),
      originalPrice: (found?.isDiscountActive ?? true) ? (found?.originalPrice || null) : null,
      badge: !isAvail ? 'UNAVAILABLE' : ((found?.isDiscountActive ?? true) ? (calculatedBadge || found?.discountBadge || null) : null),
      discountPercentage: calculatedBadge || found?.discountBadge || null,
      isAvailable: isAvail,
      disabledNotice,
    };
  };

  // Agreement checkbox
  const [agreed, setAgreed] = useState(false);

  const allAgreed = agreed;

  const selectedPkg: CoursePackage = getPackageByIdOrName(formData.selectedPackage);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      !formData.address.trim() ||
      (!formData.whatsappNumber.trim() && !formData.localPhone.trim())
    ) {
      setError('Please fill in all mandatory fields (*), including address, WhatsApp number, and password confirmation.');
      return;
    }

    const finalWhatsApp = (formData.whatsappNumber.trim() && formData.whatsappNumber.trim() !== formData.countryCode)
      ? formData.whatsappNumber.trim()
      : (formData.localPhone.trim() ? `${formData.countryCode} ${formData.localPhone.trim()}` : '');

    if (!finalWhatsApp || finalWhatsApp === formData.countryCode) {
      setError('Please enter a valid WhatsApp phone number with your country code.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please ensure Password and Confirm Password match.');
      return;
    }
    if (!allAgreed) {
      setError('Please agree to the Terms & Conditions, Privacy Policy, Refund Policy, and Admissions Disclaimer before proceeding.');
      return;
    }

    const priceCheck = getPriceData(formData.selectedPackage);
    if (!priceCheck.isAvailable) {
      setError(`The selected package "${selectedPkg.name}" is currently unavailable for enrollment. Kindly choose another package.`);
      return;
    }

    setLoading(true);
    setError(null);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const pkgObj = getPackageByIdOrName(formData.selectedPackage);

    try {
      const supabase = createClient();

      // 1. SignUp via Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: fullName,
            address: formData.address,
            country: formData.country,
            whatsapp_number: finalWhatsApp,
            phone: finalWhatsApp,
            selected_package: pkgObj.name,
            package_price: pkgObj.price,
          },
        },
      });

      if (signUpError) {
        // If account already exists or another error, warn or proceed to profile save
        console.warn('Supabase auth warning:', signUpError.message);
      }

      // 2. Insert or Upsert into profiles table if user created
      if (authData?.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          full_name: fullName,
          email: formData.email,
          address: formData.address,
          country: formData.country,
          payment_approved: true,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Supabase fallback:', err);
    }

    // Persist package mapping for instant resolution across admin and student portals
    saveStudentPackageMapping(formData.email, pkgObj.name, pkgObj.price);

    // Store in localStorage for demo fallback persistence
    const pendingStudent = {
      id: `usr-reg-${Date.now()}`,
      ama_id: `AMA-${Math.floor(100000 + Math.random() * 900000)}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: fullName,
      email: formData.email,
      address: formData.address,
      country: formData.country,
      whatsappNumber: finalWhatsApp,
      phone: finalWhatsApp,
      selectedPackage: pkgObj.name,
      packagePrice: pkgObj.price,
      paymentApproved: true,
      payment_approved: true,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('recentRegistration', JSON.stringify(pendingStudent));
      localStorage.setItem('ahsora_currentUser', JSON.stringify({
        id: pendingStudent.id,
        role: 'student',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        phone: finalWhatsApp,
        whatsappNumber: finalWhatsApp,
        country: formData.country,
        isVerified: true,
        selectedPackage: pkgObj.name,
        packagePrice: pkgObj.price,
        createdAt: pendingStudent.createdAt,
      }));
      
      // Also update local pending students list for admin demo view
      const existingListStr = localStorage.getItem('adminStudentList');
      const existingList: any[] = existingListStr ? JSON.parse(existingListStr) : [];
      const filteredList = existingList.filter(
        (item: any) => !item.email || item.email.toLowerCase() !== formData.email.toLowerCase()
      );
      filteredList.unshift(pendingStudent);
      localStorage.setItem('adminStudentList', JSON.stringify(filteredList));

      // Also ensure student is in approved emails and cached admin students
      try {
        const approvedEmailsRaw = localStorage.getItem('ahsora_approved_emails');
        const approvedEmails: string[] = approvedEmailsRaw ? JSON.parse(approvedEmailsRaw) : [];
        const cleanEmail = formData.email.toLowerCase().trim();
        if (cleanEmail && !approvedEmails.includes(cleanEmail)) {
          approvedEmails.push(cleanEmail);
          localStorage.setItem('ahsora_approved_emails', JSON.stringify(approvedEmails));
        }

        const cachedAdminStr = localStorage.getItem('ahsora_cached_admin_students');
        const cachedAdmin: any[] = cachedAdminStr ? JSON.parse(cachedAdminStr) : [];
        const filteredCached = cachedAdmin.filter(
          (item: any) => !item.email || item.email.toLowerCase().trim() !== cleanEmail
        );
        filteredCached.unshift({
          id: pendingStudent.id,
          ama_id: pendingStudent.ama_id,
          full_name: pendingStudent.fullName,
          firstName: pendingStudent.firstName,
          lastName: pendingStudent.lastName,
          email: pendingStudent.email,
          country: pendingStudent.country,
          whatsapp_number: pendingStudent.whatsappNumber,
          selected_package: pendingStudent.selectedPackage,
          selectedPackage: pendingStudent.selectedPackage,
          package_price: pendingStudent.packagePrice,
          packagePrice: pendingStudent.packagePrice,
          payment_approved: true,
          created_at: pendingStudent.createdAt,
        });
        localStorage.setItem('ahsora_cached_admin_students', JSON.stringify(filteredCached));
      } catch (e) {}

      // Trigger instant real-time sync across open admin tabs and dashboard
      window.dispatchEvent(new Event('ahsora_student_updated'));
      window.dispatchEvent(new Event('storage'));

      // If Ahsora MedPath Elite package selected, auto-add to MedPath Elite list
      if (pkgObj.id === 'elite') {
        const eliteItem = {
          id: pendingStudent.id,
          studentId: pendingStudent.id,
          studentName: fullName,
          email: formData.email,
          registeredAt: pendingStudent.createdAt,
          stages: {
            pre_enrollment: 'pending',
            dov_submission: 'pending',
            university_application: 'pending',
            admission_decision: 'pending',
            visa_process: 'pending',
            housing_arrival: 'pending',
          },
        };
        const existingEliteStr = localStorage.getItem('ahsora_elite_students');
        const existingElite: any[] = existingEliteStr ? JSON.parse(existingEliteStr) : [];
        const filteredElite = existingElite.filter(
          (e: any) => !e.email || e.email.toLowerCase() !== formData.email.toLowerCase()
        );
        filteredElite.unshift(eliteItem);
        localStorage.setItem('ahsora_elite_students', JSON.stringify(filteredElite));
      } else {
        // If registering as Ascend or Mastery, strictly remove from elite list
        const existingEliteStr = localStorage.getItem('ahsora_elite_students');
        if (existingEliteStr) {
          try {
            const existingElite: any[] = JSON.parse(existingEliteStr);
            const filteredElite = existingElite.filter(
              (e: any) => !e.email || e.email.toLowerCase() !== formData.email.toLowerCase()
            );
            localStorage.setItem('ahsora_elite_students', JSON.stringify(filteredElite));
          } catch {}
        }
      }
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }

    setLoading(false);

    // Redirect to Pending Payment screen with selected package info!
    const targetUrl = `/pending-payment?package=${encodeURIComponent(pkgObj.name)}&price=${encodeURIComponent(pkgObj.price)}&email=${encodeURIComponent(formData.email)}`;
    router.push(targetUrl);
  };

  return (
    <div
      className="register-page-wrapper"
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '116px 20px 60px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        className="register-card"
        style={{
          width: '100%',
          maxWidth: '920px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Bar */}
        <div
          className="register-card-header"
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '24px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Logo height={42} />
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Student Registration Portal
              </h1>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '2px 0 0' }}>
                Join Ahsora Meds Academy • Medical Entrance & Licensing Prep
              </p>
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#5CED73',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} /> Official Admission Portal
          </div>
        </div>

        {/* Main Content Area */}
        <div className="register-card-body" style={{ padding: '36px 40px' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '14px 18px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                marginBottom: '28px',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Section 1: Personal Details */}
            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#059669',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#F0FFF4',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  1
                </span>
                Personal & Contact Details
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {/* First Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    First Name <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zainab"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Second Name / Last Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Second / Last Name <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Al-Mansoor"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email Address <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Full Address (Mandatory) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Full Physical Address <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      placeholder="House/Street, City, Postal Code"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Password <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px',
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Confirm Password <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px',
                      }}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Country of Residence <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select
                      value={formData.country}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        const match = COUNTRY_DIAL_CODES.find((c) => c.name === newCountry);
                        const newDial = match ? match.dial : formData.countryCode;
                        setFormData((prev) => ({
                          ...prev,
                          country: newCountry,
                          countryCode: newDial,
                          whatsappNumber: `${newDial} ${prev.localPhone}`.trim(),
                        }));
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 42px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9375rem',
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {COUNTRY_DIAL_CODES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.flag} {c.name} ({c.dial})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* WhatsApp Number with Dedicated Country Code Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    WhatsApp Phone Number <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Country Dial Code Dropdown */}
                    <div style={{ width: '135px', flexShrink: 0 }}>
                      <select
                        value={formData.countryCode}
                        onChange={(e) => {
                          const newDial = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            countryCode: newDial,
                            whatsappNumber: `${newDial} ${prev.localPhone}`.trim(),
                          }));
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 8px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          backgroundColor: '#F8FAFC',
                          color: '#0F172A',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {COUNTRY_DIAL_CODES.map((c) => (
                          <option key={`${c.code}-${c.dial}`} value={c.dial}>
                            {c.flag} {c.dial} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Local Phone Number Input */}
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Phone size={17} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        required
                        placeholder="300 1234567"
                        value={formData.localPhone}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/[^\d\s-]/g, '');
                          setFormData((prev) => ({
                            ...prev,
                            localPhone: clean,
                            whatsappNumber: `${prev.countryCode} ${clean}`.trim(),
                          }));
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 40px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.9375rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Standardized WhatsApp format:</span>
                    <strong style={{ color: '#059669', fontFamily: 'monospace' }}>
                      {formData.countryCode} {formData.localPhone || '300 1234567'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Package Selection (4 Packages) */}
            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#059669',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#F0FFF4',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  2
                </span>
                Select Your Academy Package
              </div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '20px' }}>
                Choose the preparation plan that best matches your target medical exam goals.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {ACADEMY_PACKAGES.map((pkg) => {
                  const pData = getPriceData(pkg.id);
                  const isAvail = pData.isAvailable !== false;
                  const isSelected = isAvail && (formData.selectedPackage === pkg.id || formData.selectedPackage === pkg.name);
                  const displayBadge = !isAvail ? 'UNAVAILABLE' : (pData.badge || pkg.badge);

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        if (!isAvail) {
                          setError(`"${pkg.name}" is currently unavailable for enrollment. Please choose an active package.`);
                          return;
                        }
                        setError(null);
                        setFormData({ ...formData, selectedPackage: pkg.id });
                      }}
                      style={{
                        border: isSelected ? '2px solid #059669' : !isAvail ? '1.5px dashed #CBD5E1' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#F0FFF4' : !isAvail ? '#F8FAFC' : '#FFFFFF',
                        borderRadius: '16px',
                        padding: '20px 16px',
                        cursor: !isAvail ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        opacity: !isAvail ? 0.72 : 1,
                        boxShadow: isSelected ? '0 10px 25px -5px rgba(5, 150, 105, 0.2)' : 'none',
                      }}
                    >
                      {displayBadge && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-12px',
                            right: '12px',
                            backgroundColor: !isAvail ? '#DC2626' : (isSelected ? '#059669' : '#0F172A'),
                            color: '#FFFFFF',
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {displayBadge}
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: !isAvail ? '#64748B' : '#0F172A', margin: 0 }}>
                            {pkg.name}
                          </h3>
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: isSelected ? '6px solid #059669' : '2px solid #CBD5E1',
                              backgroundColor: !isAvail ? '#E2E8F0' : '#FFFFFF',
                              flexShrink: 0,
                            }}
                          />
                        </div>

                        {!isAvail && (
                          <div
                            style={{
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FECACA',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '0.75rem',
                              color: '#991B1B',
                              fontWeight: 700,
                              marginBottom: '10px',
                            }}
                          >
                            ⚠️ {pData.disabledNotice || 'Enrollment paused for this package'}
                          </div>
                        )}

                        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: isSelected ? '#047857' : '#0F172A' }}>
                            {pData.price}
                          </span>
                          {pData.originalPrice && (
                            <span style={{ fontSize: '0.95rem', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 600 }}>
                              {pData.originalPrice}
                            </span>
                          )}
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            / {pkg.period}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.4, marginBottom: '14px' }}>
                          {pkg.description}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {pkg.features.map((feat, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.75rem', color: '#334155' }}>
                              <CheckCircle2 size={14} color={isSelected ? '#059669' : '#16A34A'} style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Policy Agreements */}
            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#059669',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#F0FFF4',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: '#059669',
                  }}
                >
                  3
                </span>
                Agreement &amp; Consent
              </div>

              <div
                style={{
                  backgroundColor: '#F0FFF4',
                  border: `1px solid ${agreed ? '#6EE7B7' : '#BBF7D0'}`,
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {/* Single combined checkbox */}
                <label
                  htmlFor="agree-all"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: agreed ? 'rgba(5,150,105,0.07)' : '#FFFFFF',
                    border: `1px solid ${agreed ? '#6EE7B7' : '#E2E8F0'}`,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    id="agree-all"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#059669',
                      flexShrink: 0,
                      marginTop: '3px',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', lineHeight: '1.5' }}>
                    I have read and agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer"
                      style={{ color: '#059669', textDecoration: 'underline', fontWeight: 700 }}
                      onClick={(e) => e.stopPropagation()}>
                      Terms &amp; Conditions
                    </a>
                    ,{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer"
                      style={{ color: '#059669', textDecoration: 'underline', fontWeight: 700 }}
                      onClick={(e) => e.stopPropagation()}>
                      Privacy Policy
                    </a>
                    ,{' '}
                    <a href="/refund-policy" target="_blank" rel="noopener noreferrer"
                      style={{ color: '#059669', textDecoration: 'underline', fontWeight: 700 }}
                      onClick={(e) => e.stopPropagation()}>
                      Refund Policy
                    </a>
                    ,{' '}
                    <a href="/admissions-disclaimer" target="_blank" rel="noopener noreferrer"
                      style={{ color: '#059669', textDecoration: 'underline', fontWeight: 700 }}
                      onClick={(e) => e.stopPropagation()}>
                      Admissions Disclaimer
                    </a>
                  </div>
                </label>

                {/* Legal confirmation paragraphs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                  {/* Statement 1 — Guardian authority */}
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: '#374151',
                      lineHeight: '1.7',
                      padding: '12px 14px',
                      backgroundColor: '#ECFDF5',
                      borderRadius: '10px',
                      border: '1px solid #A7F3D0',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{
                      flexShrink: 0,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#059669',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}>1</span>
                    <span>
                      I confirm that I am the parent or legal guardian of{' '}
                      <strong style={{ color: '#059669' }}>
                        {formData.firstName || formData.lastName
                          ? `${formData.firstName} ${formData.lastName}`.trim()
                          : '[Student Name]'}
                      </strong>
                      , am of legal age and legally able to enter this contract, and am purchasing this course on the student&apos;s behalf. I authorise their participation and accept responsibility for the purchaser&apos;s payment obligations and for supervising the student&apos;s compliance with the course and account-use rules, as described in the{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer"
                        style={{ color: '#059669', textDecoration: 'underline', fontWeight: 600 }}>
                        Terms of Use
                      </a>{' '}and{' '}
                      <a href="/terms#course-purchase" target="_blank" rel="noopener noreferrer"
                        style={{ color: '#059669', textDecoration: 'underline', fontWeight: 600 }}>
                        Course Purchase Terms
                      </a>
                      .
                    </span>
                  </div>

                  {/* Statement 2 — Personal legal capacity */}
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: '#374151',
                      lineHeight: '1.7',
                      padding: '12px 14px',
                      backgroundColor: '#ECFDF5',
                      borderRadius: '10px',
                      border: '1px solid #A7F3D0',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{
                      flexShrink: 0,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#059669',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}>2</span>
                    <span>
                      I confirm that I am of legal age and legally able to enter this contract under the law applicable to me. I accept the purchaser&apos;s responsibilities set out in the{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer"
                        style={{ color: '#059669', textDecoration: 'underline', fontWeight: 600 }}>
                        Terms of Use
                      </a>{' '}and{' '}
                      <a href="/terms#course-purchase" target="_blank" rel="noopener noreferrer"
                        style={{ color: '#059669', textDecoration: 'underline', fontWeight: 600 }}>
                        Course Purchase Terms
                      </a>
                      .
                    </span>
                  </div>

                  {/* Statement 3 — Individual access & no credential sharing */}
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: '#374151',
                      lineHeight: '1.7',
                      padding: '12px 14px',
                      backgroundColor: '#ECFDF5',
                      borderRadius: '10px',
                      border: '1px solid #A7F3D0',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{
                      flexShrink: 0,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#059669',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}>3</span>
                    <span>
                      I understand that this purchase gives{' '}
                      <strong style={{ color: '#059669' }}>
                        {formData.firstName || formData.lastName
                          ? `${formData.firstName} ${formData.lastName}`.trim()
                          : '[Student Name]'}
                      </strong>{' '}
                      individual access. I must not share credentials or redistribute restricted course materials. Misuse may result in suspension or termination under section 12 of the{' '}
                      <a href="/terms#section-12" target="_blank" rel="noopener noreferrer"
                        style={{ color: '#059669', textDecoration: 'underline', fontWeight: 600 }}>
                        Terms
                      </a>
                      , subject to applicable law.
                    </span>
                  </div>

                </div>
              </div>
            </div>
            <div
              className="register-checkout-bar"
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Selected Package:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>{selectedPkg.name} —</span>
                  <span style={{ color: '#059669' }}>{getPriceData(selectedPkg.id).price}</span>
                  {getPriceData(selectedPkg.id).originalPrice && (
                    <span style={{ color: '#94A3B8', textDecoration: 'line-through', fontSize: '0.9rem', fontWeight: 600 }}>
                      {getPriceData(selectedPkg.id).originalPrice}
                    </span>
                  )}
                  {getPriceData(selectedPkg.id).badge && (
                    <span style={{ backgroundColor: '#DCFCE7', color: '#047857', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                      {getPriceData(selectedPkg.id).badge}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary register-submit-btn"
                style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                {loading ? (
                  'Processing Registration...'
                ) : (
                  <>
                    <span>Proceed to Payment Screen</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9375rem', color: '#64748B' }}>
            Already registered?{' '}
            <Link href="/portal" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
              Sign in to Student Portal
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .register-page-wrapper {
            padding: 100px 12px 40px !important;
          }
          .register-card-header {
            padding: 18px 16px !important;
          }
          .register-card-body {
            padding: 20px 16px !important;
          }
          .register-checkout-bar {
            padding: 18px 16px !important;
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .register-submit-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}
