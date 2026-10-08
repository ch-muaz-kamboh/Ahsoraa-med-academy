import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Fetch all users from Supabase Auth (contains real user_metadata with selected_package)
    const [usersRes, profilesRes] = await Promise.all([
      supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabase.from('profiles').select('*'),
    ]);

    const profiles = profilesRes.data || [];
    const profMap = new Map(profiles.map((p: any) => [p.id, p]));
    const profEmailMap = new Map(profiles.map((p: any) => [(p.email || '').toLowerCase().trim(), p]));

    const users = usersRes.data?.users || [];

    const mergedStudents = users.map((u: any) => {
      const emailLower = (u.email || '').toLowerCase().trim();
      const p = profMap.get(u.id) || profEmailMap.get(emailLower) || {};
      const meta = u.user_metadata || {};

      const fullName =
        meta.full_name ||
        p.full_name ||
        `${meta.first_name || ''} ${meta.last_name || ''}`.trim() ||
        u.email?.split('@')[0] ||
        'Student';

      const pkgName = meta.selected_package || meta.selectedPackage || p.selected_package || 'Ahsora IMAT Ascend';
      const pkgPrice = meta.package_price || meta.packagePrice || p.package_price || '€299';
      const country = meta.country || p.country || 'Italy';
      const whatsapp = meta.whatsapp_number || meta.whatsappNumber || p.whatsapp_number || 'Not specified';
      const paymentApproved = p.payment_approved !== undefined ? p.payment_approved : false;

      return {
        id: u.id,
        ama_id: p.ama_id || `AMA-${u.id.substring(0, 6).toUpperCase()}`,
        full_name: fullName,
        firstName: meta.first_name || fullName.split(' ')[0],
        lastName: meta.last_name || fullName.split(' ').slice(1).join(' '),
        email: u.email,
        country: country,
        whatsapp_number: whatsapp,
        whatsappNumber: whatsapp,
        selected_package: pkgName,
        selectedPackage: pkgName,
        package_price: pkgPrice,
        packagePrice: pkgPrice,
        payment_approved: paymentApproved,
        created_at: p.created_at || u.created_at,
      };
    });

    // Also include any profiles that might not have been matched in auth.users
    const authUserIds = new Set(users.map((u: any) => u.id));
    profiles.forEach((p: any) => {
      if (!authUserIds.has(p.id) && p.email) {
        mergedStudents.push({
          id: p.id,
          ama_id: p.ama_id || `AMA-${p.id.substring(0, 6).toUpperCase()}`,
          full_name: p.full_name || p.email.split('@')[0],
          firstName: (p.full_name || '').split(' ')[0] || 'Student',
          lastName: (p.full_name || '').split(' ').slice(1).join(' ') || '',
          email: p.email,
          country: p.country || 'Italy',
          whatsapp_number: p.whatsapp_number || 'Not specified',
          whatsappNumber: p.whatsapp_number || 'Not specified',
          selected_package: p.selected_package || 'Ahsora IMAT Ascend',
          selectedPackage: p.selected_package || 'Ahsora IMAT Ascend',
          package_price: p.package_price || '€299',
          packagePrice: p.package_price || '€299',
          payment_approved: p.payment_approved || false,
          created_at: p.created_at || new Date().toISOString(),
        });
      }
    });

    return NextResponse.json({ success: true, students: mergedStudents });
  } catch (error: any) {
    console.error('API /api/admin/students error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const body = await request.json();
    const rawStudentId = body.studentId || body.id;
    const rawEmail = (body.studentEmail || body.email || '').toLowerCase().trim();
    const { selectedPackage, packagePrice, paymentApproved } = body;

    if (!rawStudentId && !rawEmail) {
      return NextResponse.json({ success: false, error: 'studentId or studentEmail required' }, { status: 400 });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let targetUserId = rawStudentId && uuidRegex.test(rawStudentId) ? rawStudentId : null;

    // If targetUserId is not a valid UUID, look up real user in Supabase Auth by email
    if (!targetUserId && rawEmail) {
      try {
        const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const found = (usersData?.users || []).find((u) => (u.email || '').toLowerCase().trim() === rawEmail);
        if (found) {
          targetUserId = found.id;
        }
      } catch (lookupErr) {
        console.warn('Auth user lookup warning:', lookupErr);
      }
    }

    // 1. Update Auth metadata if we have a valid UUID
    if (targetUserId) {
      const updateData: any = { user_metadata: {} };
      if (selectedPackage) {
        updateData.user_metadata.selected_package = selectedPackage;
      }
      if (packagePrice) {
        updateData.user_metadata.package_price = packagePrice;
      }
      if (Object.keys(updateData.user_metadata).length > 0) {
        await supabase.auth.admin.updateUserById(targetUserId, updateData);
      }
    }

    // 2. Update profiles table
    const profileUpdate: any = {};
    if (paymentApproved !== undefined) {
      profileUpdate.payment_approved = paymentApproved;
    }
    if (Object.keys(profileUpdate).length > 0) {
      if (targetUserId) {
        await supabase.from('profiles').update(profileUpdate).eq('id', targetUserId);
      } else if (rawEmail) {
        await supabase.from('profiles').update(profileUpdate).eq('email', rawEmail);
      }
    }

    return NextResponse.json({ success: true, message: 'Student updated successfully', targetUserId });
  } catch (error: any) {
    console.error('API /api/admin/students update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
