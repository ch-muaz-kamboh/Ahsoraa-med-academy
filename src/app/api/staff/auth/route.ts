import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_STAFF = [
  {
    id: 'staff-farhan',
    email: 'dr.farhan@ahsorameds.com',
    displayName: 'Dr. Farhan Ahmed',
    accountType: 'staff',
    role: 'teacher',
    assignedSubjects: ['Biology', 'Anatomy', 'Physiology'],
    assignedCohorts: ['IMAT 2026 Alpha Cohort', 'MedPath Elite Track'],
    password: 'password123',
    status: 'approved',
    isActive: true,
    permissions: ['schedule', 'question_bank', 'doubts', 'assessments', 'students', 'attendance', 'medpath_elite'],
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'staff-sarah',
    email: 'dr.sarah@ahsorameds.com',
    displayName: 'Dr. Sarah Jenkins',
    accountType: 'staff',
    role: 'teacher',
    assignedSubjects: ['General Chemistry', 'Organic Chemistry'],
    assignedCohorts: ['IMAT 2026 Alpha Cohort'],
    password: 'password123',
    status: 'approved',
    isActive: true,
    permissions: ['schedule', 'question_bank', 'doubts', 'assessments', 'students', 'attendance'],
    createdAt: '2026-01-15T10:00:00.000Z',
  },
];

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sample-project.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sample-anon-key';
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  const supabase = getSupabase();
  try {
    const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const staffFromAuth = (usersData?.users || [])
      .filter((u) => u.user_metadata?.accountType === 'staff' || u.user_metadata?.role === 'staff' || u.user_metadata?.staff_data)
      .map((u) => {
        const meta = u.user_metadata?.staff_data || u.user_metadata || {};
        return {
          id: u.id,
          email: u.email || '',
          displayName: meta.displayName || meta.display_name || meta.full_name || u.email?.split('@')[0] || '',
          accountType: 'staff',
          role: meta.role || 'teacher',
          assignedSubjects: meta.assignedSubjects || meta.assigned_subjects || ['Biology'],
          assignedCohorts: meta.assignedCohorts || meta.assigned_cohorts || ['IMAT 2026 Alpha Cohort'],
          status: meta.status || 'pending',
          isActive: meta.isActive ?? (meta.status === 'approved'),
          permissions: meta.permissions || ['schedule', 'question_bank', 'doubts', 'assessments', 'students', 'attendance', 'medpath_elite'],
          createdAt: u.created_at,
        };
      });

    // Merge default staff if not present
    const combined = [...staffFromAuth];
    DEFAULT_STAFF.forEach((def) => {
      if (!combined.some((s) => (s.email || '').toLowerCase() === def.email.toLowerCase())) {
        combined.unshift(def);
      }
    });

    return NextResponse.json({ success: true, staff: combined });
  } catch (error: any) {
    return NextResponse.json({ success: true, staff: DEFAULT_STAFF });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, email, password, accountData, staffId, status, permissions } = body;
  const cleanEmail = (email || '').toLowerCase().trim();
  const supabase = getSupabase();

  // 1. Staff Sign-in / Login
  if (action === 'login') {
    // Check built-in preset staff accounts first
    const preset = DEFAULT_STAFF.find((s) => s.email.toLowerCase() === cleanEmail);
    if (preset) {
      if (password && preset.password && preset.password !== password) {
        return NextResponse.json({ success: false, message: 'Incorrect password. Please verify your credentials.' }, { status: 401 });
      }
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        staff: preset,
      });
    }

    // Check Supabase Auth users
    try {
      const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const foundUser = (usersData?.users || []).find((u) => (u.email || '').toLowerCase().trim() === cleanEmail);

      if (!foundUser) {
        return NextResponse.json({ success: false, message: 'No staff account found with this email address.' }, { status: 404 });
      }

      const meta = foundUser.user_metadata?.staff_data || foundUser.user_metadata || {};
      const staffStatus = meta.status || 'pending';
      const staffActive = meta.isActive ?? (staffStatus === 'approved');

      if (staffStatus === 'pending') {
        return NextResponse.json({ success: false, status: 'pending', message: 'Your faculty sign-up request is pending Admin approval.' }, { status: 403 });
      }

      if (staffStatus === 'rejected' || !staffActive) {
        return NextResponse.json({ success: false, status: 'rejected', message: 'Your faculty account access has been declined or disabled by an Admin.' }, { status: 403 });
      }

      // Check password if stored in metadata or authenticate
      if (meta.password && password && meta.password !== password) {
        return NextResponse.json({ success: false, message: 'Incorrect password. Please verify your credentials.' }, { status: 401 });
      }

      const staffProfile = {
        id: foundUser.id,
        email: foundUser.email || '',
        displayName: meta.displayName || meta.display_name || meta.full_name || foundUser.email?.split('@')[0] || '',
        accountType: 'staff',
        role: meta.role || 'teacher',
        assignedSubjects: meta.assignedSubjects || meta.assigned_subjects || ['Biology'],
        assignedCohorts: meta.assignedCohorts || meta.assigned_cohorts || ['IMAT 2026 Alpha Cohort'],
        status: staffStatus,
        isActive: staffActive,
        permissions: meta.permissions || ['schedule', 'question_bank', 'doubts', 'assessments', 'students', 'attendance', 'medpath_elite'],
        createdAt: foundUser.created_at,
      };

      return NextResponse.json({ success: true, message: 'Login successful', staff: staffProfile });
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message || 'Authentication error' }, { status: 500 });
    }
  }

  // 2. Staff Registration
  if (action === 'register') {
    const regEmail = (accountData?.email || cleanEmail).toLowerCase().trim();
    if (!regEmail) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    try {
      const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      let existingUser = (usersData?.users || []).find((u) => (u.email || '').toLowerCase().trim() === regEmail);

      const staffPayload = {
        displayName: accountData?.displayName || regEmail.split('@')[0],
        accountType: 'staff',
        role: accountData?.role || 'teacher',
        assignedSubjects: accountData?.assignedSubjects || ['Biology'],
        assignedCohorts: accountData?.assignedCohorts || ['IMAT 2026 Alpha Cohort'],
        status: 'pending',
        isActive: false,
        password: accountData?.password || password || '',
        permissions: accountData?.permissions || ['schedule', 'question_bank', 'doubts', 'assessments', 'students', 'attendance', 'medpath_elite'],
        createdAt: new Date().toISOString(),
      };

      if (!existingUser) {
        const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
          email: regEmail,
          password: accountData?.password || password || 'AhsoraFaculty2026!',
          email_confirm: true,
          user_metadata: {
            role: 'staff',
            accountType: 'staff',
            staff_data: staffPayload,
          },
        });
        if (createErr) {
          console.warn('Supabase create staff user warning:', createErr.message);
        }
      } else {
        await supabase.auth.admin.updateUserById(existingUser.id, {
          user_metadata: {
            ...existingUser.user_metadata,
            role: 'staff',
            accountType: 'staff',
            staff_data: staffPayload,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Registration submitted! Your faculty account is pending Admin approval.',
      });
    } catch (err: any) {
      console.error('Staff register error:', err);
      return NextResponse.json({ success: false, message: err.message || 'Registration failed' }, { status: 500 });
    }
  }

  // 3. Admin Update Status (Approve / Reject)
  if (action === 'update_status') {
    const targetIdOrEmail = staffId || cleanEmail;
    try {
      const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const found = (usersData?.users || []).find(
        (u) => u.id === targetIdOrEmail || (u.email || '').toLowerCase().trim() === targetIdOrEmail.toLowerCase().trim()
      );

      if (found) {
        const currentMeta = found.user_metadata?.staff_data || found.user_metadata || {};
        const updatedMeta = {
          ...currentMeta,
          status: status || 'approved',
          isActive: status === 'approved',
        };
        await supabase.auth.admin.updateUserById(found.id, {
          user_metadata: {
            ...found.user_metadata,
            staff_data: updatedMeta,
          },
        });
      }

      return NextResponse.json({ success: true, message: `Staff status updated to ${status}` });
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
  }

  // 4. Admin Update Permissions
  if (action === 'update_permissions') {
    const targetIdOrEmail = staffId || cleanEmail;
    try {
      const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const found = (usersData?.users || []).find(
        (u) => u.id === targetIdOrEmail || (u.email || '').toLowerCase().trim() === targetIdOrEmail.toLowerCase().trim()
      );

      if (found) {
        const currentMeta = found.user_metadata?.staff_data || found.user_metadata || {};
        const updatedMeta = {
          ...currentMeta,
          permissions: permissions || [],
        };
        await supabase.auth.admin.updateUserById(found.id, {
          user_metadata: {
            ...found.user_metadata,
            staff_data: updatedMeta,
          },
        });
      }

      return NextResponse.json({ success: true, message: 'Permissions updated' });
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
}
