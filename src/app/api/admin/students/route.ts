import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://couhzxvhzdipbffrkerf.supabase.co';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

function getAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  const supabase = getAdminClient();

  try {
    let users: any[] = [];
    let profiles: any[] = [];
    let enrolledLeads: any[] = [];

    // 1. Fetch auth users
    try {
      const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      users = usersData?.users || [];
    } catch (authErr) {
      console.warn('Supabase auth.admin.listUsers note:', authErr);
    }

    // 2. Fetch profiles
    try {
      const { data: profilesData } = await supabase.from('profiles').select('*');
      profiles = profilesData || [];
    } catch (profErr) {
      console.warn('Supabase profiles fetch note:', profErr);
    }

    // 3. Fetch enrolled leads for cross-device backup
    try {
      const { data: leadsData } = await supabase.from('leads').select('*').eq('status', 'enrolled');
      enrolledLeads = leadsData || [];
    } catch (leadsErr) {
      console.warn('Supabase enrolled leads fetch note:', leadsErr);
    }

    const profMap = new Map(profiles.map((p: any) => [p.id, p]));
    const profEmailMap = new Map(profiles.map((p: any) => [(p.email || '').toLowerCase().trim(), p]));

    const leadsEmailMap = new Map();
    for (const l of enrolledLeads) {
      const em = (l.email || '').toLowerCase().trim();
      if (em) {
        let meta: any = {};
        try {
          if (l.academic_background && l.academic_background.startsWith('{')) {
            meta = JSON.parse(l.academic_background);
          }
        } catch {}
        leadsEmailMap.set(em, { ...l, leadMeta: meta });
      }
    }

    // Filter out staff/admin accounts and map student users
    const mergedStudents = users
      .filter((u: any) => {
        const meta = u.user_metadata || {};
        const emailLower = (u.email || '').toLowerCase().trim();
        return (
          meta.accountType !== 'staff' &&
          meta.role !== 'staff' &&
          meta.role !== 'admin' &&
          meta.accountType !== 'admin' &&
          !meta.staff_data &&
          emailLower !== 'moaz27632@gmail.com' &&
          emailLower !== 'ahsank746@gmail.com'
        );
      })
      .map((u: any) => {
        const emailLower = (u.email || '').toLowerCase().trim();
        const p = profMap.get(u.id) || profEmailMap.get(emailLower) || {};
        const lead = leadsEmailMap.get(emailLower) || {};
        const leadMeta = lead.leadMeta || {};
        const meta = u.user_metadata || {};

        const fullName =
          meta.full_name ||
          p.full_name ||
          lead.name ||
          `${meta.first_name || ''} ${meta.last_name || ''}`.trim() ||
          u.email?.split('@')[0] ||
          'Student';

        const pkgName =
          meta.selected_package ||
          meta.selectedPackage ||
          p.selected_package ||
          p.selectedPackage ||
          leadMeta.selected_package ||
          'Ahsora IMAT Ascend';

        const pkgPrice =
          meta.package_price ||
          meta.packagePrice ||
          p.package_price ||
          p.packagePrice ||
          leadMeta.package_price ||
          '€299';

        const country = meta.country || p.country || lead.target_country || 'Italy';
        const whatsapp =
          meta.whatsapp_number ||
          meta.whatsappNumber ||
          meta.phone ||
          p.whatsapp_number ||
          p.phone ||
          lead.phone ||
          'Not specified';

        const address =
          meta.address ||
          meta.physical_address ||
          meta.street_address ||
          p.address ||
          leadMeta.address ||
          'Address on file';

        const paymentApproved = p.payment_approved !== undefined ? p.payment_approved : true;
        const cleanAmaId =
          p.ama_id ? p.ama_id.trim() : (meta.ama_id || leadMeta.ama_id || `AMA-${u.id.substring(0, 6).toUpperCase()}`);

        return {
          id: u.id,
          ama_id: cleanAmaId,
          full_name: fullName,
          firstName: meta.first_name || fullName.split(' ')[0],
          lastName: meta.last_name || fullName.split(' ').slice(1).join(' '),
          email: u.email,
          country: country,
          address: address,
          whatsapp_number: whatsapp,
          whatsappNumber: whatsapp,
          phone: whatsapp,
          selected_package: pkgName,
          selectedPackage: pkgName,
          package_price: pkgPrice,
          packagePrice: pkgPrice,
          payment_approved: paymentApproved,
          stages: meta.medpath_stages || p.stages || null,
          created_at: p.created_at || u.created_at,
        };
      });

    // Also include any profiles that might not have been matched in auth.users
    const authUserIds = new Set(users.map((u: any) => u.id));
    const processedEmails = new Set(mergedStudents.map((s: any) => (s.email || '').toLowerCase().trim()));

    profiles.forEach((p: any) => {
      const emailLower = (p.email || '').toLowerCase().trim();
      if (
        !authUserIds.has(p.id) &&
        !processedEmails.has(emailLower) &&
        p.email &&
        p.role !== 'staff' &&
        p.role !== 'admin' &&
        p.accountType !== 'staff' &&
        p.accountType !== 'admin' &&
        emailLower !== 'moaz27632@gmail.com' &&
        emailLower !== 'ahsank746@gmail.com'
      ) {
        processedEmails.add(emailLower);
        const lead = leadsEmailMap.get(emailLower) || {};
        const leadMeta = lead.leadMeta || {};
        const cleanAmaId = p.ama_id ? p.ama_id.trim() : (leadMeta.ama_id || `AMA-${p.id.substring(0, 6).toUpperCase()}`);

        mergedStudents.push({
          id: p.id,
          ama_id: cleanAmaId,
          full_name: p.full_name || lead.name || p.email.split('@')[0],
          firstName: (p.full_name || lead.name || '').split(' ')[0] || 'Student',
          lastName: (p.full_name || lead.name || '').split(' ').slice(1).join(' ') || '',
          email: p.email,
          country: p.country || lead.target_country || 'Italy',
          address: p.address || leadMeta.address || 'Address on file',
          whatsapp_number: p.whatsapp_number || p.phone || lead.phone || 'Not specified',
          whatsappNumber: p.whatsapp_number || p.phone || lead.phone || 'Not specified',
          phone: p.whatsapp_number || p.phone || lead.phone || 'Not specified',
          selected_package: p.selected_package || p.selectedPackage || leadMeta.selected_package || 'Ahsora IMAT Ascend',
          selectedPackage: p.selected_package || p.selectedPackage || leadMeta.selected_package || 'Ahsora IMAT Ascend',
          package_price: p.package_price || p.packagePrice || leadMeta.package_price || '€299',
          packagePrice: p.package_price || p.packagePrice || leadMeta.package_price || '€299',
          payment_approved: p.payment_approved !== undefined ? p.payment_approved : true,
          stages: p.stages || null,
          created_at: p.created_at || new Date().toISOString(),
        });
      }
    });

    // Also include any enrolled leads that weren't matched in auth or profiles
    for (const [em, lead] of leadsEmailMap.entries()) {
      if (!processedEmails.has(em)) {
        processedEmails.add(em);
        const leadMeta = lead.leadMeta || {};
        const studentId = leadMeta.studentId || lead.id || `lead-${Date.now()}`;
        const cleanAmaId = leadMeta.ama_id || `AMA-${studentId.substring(0, 6).toUpperCase()}`;

        mergedStudents.push({
          id: studentId,
          ama_id: cleanAmaId,
          full_name: lead.name || em.split('@')[0],
          firstName: (lead.name || '').split(' ')[0] || 'Student',
          lastName: (lead.name || '').split(' ').slice(1).join(' ') || '',
          email: em,
          country: lead.target_country || 'Italy',
          address: leadMeta.address || 'Address on file',
          whatsapp_number: lead.phone || 'Not specified',
          whatsappNumber: lead.phone || 'Not specified',
          phone: lead.phone || 'Not specified',
          selected_package: leadMeta.selected_package || 'Ahsora IMAT Ascend',
          selectedPackage: leadMeta.selected_package || 'Ahsora IMAT Ascend',
          package_price: leadMeta.package_price || '€299',
          packagePrice: leadMeta.package_price || '€299',
          payment_approved: true,
          stages: null,
          created_at: lead.created_at || new Date().toISOString(),
        });
      }
    }

    return NextResponse.json(
      { success: true, students: mergedStudents },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    console.error('API /api/admin/students error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = getAdminClient();

  try {
    const body = await request.json();
    const rawEmail = (body.email || '').toLowerCase().trim();
    const rawId = body.id || body.studentId;
    const {
      fullName,
      firstName,
      lastName,
      address,
      country,
      whatsappNumber,
      phone,
      selectedPackage,
      packagePrice,
      ama_id,
      password,
    } = body;

    const finalPhone = whatsappNumber || phone || '';

    // 1. Locate auth user and update user_metadata with address and full student details
    let targetUserId = rawId;
    if (rawEmail) {
      try {
        const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const found = (usersData?.users || []).find((u: any) => (u.email || '').toLowerCase().trim() === rawEmail);
        if (found) targetUserId = found.id;
      } catch (err) {
        console.warn('Auth lookup warning:', err);
      }
    }

    // If auth user does not exist yet (e.g. client signup failed or had network/rate-limit issues), create it server-side
    if (!targetUserId && rawEmail) {
      try {
        const { data: created, error: createErr } = await supabase.auth.admin.createUser({
          email: rawEmail,
          password: password || 'AhsoraStudent2027!',
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            first_name: firstName || fullName?.split(' ')[0],
            last_name: lastName || fullName?.split(' ').slice(1).join(' '),
            address: address || '',
            country: country || 'Italy',
            whatsapp_number: finalPhone,
            phone: finalPhone,
            selected_package: selectedPackage,
            package_price: packagePrice,
            ama_id: ama_id,
          },
        });
        if (created?.user) {
          targetUserId = created.user.id;
        } else if (createErr) {
          console.warn('Server auth.admin.createUser note:', createErr.message);
        }
      } catch (cErr) {
        console.warn('Server auth.admin.createUser exception:', cErr);
      }
    }

    if (targetUserId) {
      try {
        await supabase.auth.admin.updateUserById(targetUserId, {
          user_metadata: {
            full_name: fullName,
            first_name: firstName || fullName?.split(' ')[0],
            last_name: lastName || fullName?.split(' ').slice(1).join(' '),
            address: address || '',
            country: country || 'Italy',
            whatsapp_number: finalPhone,
            phone: finalPhone,
            selected_package: selectedPackage,
            package_price: packagePrice,
            ama_id: ama_id,
          },
        });
      } catch (uErr) {
        console.warn('Auth metadata update warning:', uErr);
      }
    }

    // 2. Safe upsert to profiles table only with columns that exist in the schema
    if (targetUserId) {
      try {
        const profileData: any = {
          id: targetUserId,
          full_name: fullName,
          email: rawEmail,
          payment_approved: true,
          role: 'student',
          account_type: 'student',
          is_active: true,
        };
        if (ama_id) profileData.ama_id = ama_id;

        await supabase.from('profiles').upsert(profileData);
      } catch (pErr) {
        console.warn('Profile upsert warning:', pErr);
      }
    }

    // 3. Backup to leads table with enrolled status for immediate cross-device sync
    try {
      await supabase.from('leads').insert({
        name: fullName,
        email: rawEmail,
        phone: finalPhone,
        target_exam: 'IMAT',
        target_country: country || 'Italy',
        academic_background: JSON.stringify({
          studentId: targetUserId,
          ama_id: ama_id,
          address: address || '',
          selected_package: selectedPackage,
          package_price: packagePrice,
          registered_at: new Date().toISOString(),
        }),
        status: 'enrolled',
      });
    } catch (lErr) {
      console.warn('Leads enrolled backup notice:', lErr);
    }

    return NextResponse.json({ success: true, studentId: targetUserId, message: 'Student registered and address synced' });
  } catch (error: any) {
    console.error('API /api/admin/students POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabase = getAdminClient();

  try {
    const body = await request.json();
    const rawStudentId = body.studentId || body.id;
    const rawEmail = (body.studentEmail || body.email || '').toLowerCase().trim();
    const { selectedPackage, packagePrice, paymentApproved, ama_id, enrollmentNumber } = body;
    const resolvedAmaId = ama_id || enrollmentNumber;

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
      try {
        const updateData: any = { user_metadata: {} };
        if (selectedPackage) {
          updateData.user_metadata.selected_package = selectedPackage;
        }
        if (packagePrice) {
          updateData.user_metadata.package_price = packagePrice;
        }
        if (resolvedAmaId) {
          updateData.user_metadata.ama_id = resolvedAmaId;
        }
        if (Object.keys(updateData.user_metadata).length > 0) {
          await supabase.auth.admin.updateUserById(targetUserId, updateData);
        }
      } catch (uErr) {
        console.warn('Update user metadata warning:', uErr);
      }
    }

    // 2. Update profiles table
    const profileUpdate: any = {};
    if (paymentApproved !== undefined) {
      profileUpdate.payment_approved = paymentApproved;
    }
    if (selectedPackage) {
      profileUpdate.selected_package = selectedPackage;
    }
    if (packagePrice) {
      profileUpdate.package_price = packagePrice;
    }
    if (resolvedAmaId) {
      profileUpdate.ama_id = resolvedAmaId;
    }
    if (Object.keys(profileUpdate).length > 0) {
      try {
        if (targetUserId) {
          await supabase.from('profiles').update(profileUpdate).eq('id', targetUserId);
        } else if (rawEmail) {
          await supabase.from('profiles').update(profileUpdate).eq('email', rawEmail);
        }
      } catch (pErr) {
        console.warn('Update profiles table warning:', pErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Student updated successfully', targetUserId });
  } catch (error: any) {
    console.error('API /api/admin/students update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
