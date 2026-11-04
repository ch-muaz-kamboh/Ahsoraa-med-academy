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
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'enrolled')
        .order('created_at', { ascending: true });
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
        const prev = leadsEmailMap.get(em);
        const prevMeta = prev?.leadMeta || {};
        leadsEmailMap.set(em, {
          ...prev,
          ...l,
          leadMeta: { ...prevMeta, ...meta },
        });
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
          lead.name ||
          meta.full_name ||
          p.full_name ||
          `${meta.first_name || ''} ${meta.last_name || ''}`.trim() ||
          u.email?.split('@')[0] ||
          'Student';

        const pkgName =
          leadMeta.selected_package ||
          meta.selected_package ||
          meta.selectedPackage ||
          p.selected_package ||
          p.selectedPackage ||
          'Ahsora IMAT Ascend';

        const pkgPrice =
          leadMeta.package_price ||
          meta.package_price ||
          meta.packagePrice ||
          p.package_price ||
          p.packagePrice ||
          '€299';

        const country =
          leadMeta.country ||
          lead.target_country ||
          meta.country ||
          p.country ||
          '';

        const whatsapp =
          leadMeta.whatsapp_number ||
          leadMeta.phone ||
          lead.phone ||
          meta.whatsapp_number ||
          meta.whatsappNumber ||
          meta.phone ||
          p.whatsapp_number ||
          p.phone ||
          '';

        const address =
          leadMeta.address ||
          meta.address ||
          meta.physical_address ||
          meta.street_address ||
          p.address ||
          '';

        const paymentApproved =
          leadMeta.payment_approved !== undefined
            ? Boolean(leadMeta.payment_approved)
            : p.payment_approved !== undefined && p.payment_approved !== null
            ? Boolean(p.payment_approved)
            : meta.payment_approved !== undefined
            ? Boolean(meta.payment_approved)
            : false;

        const cleanAmaId =
          p.ama_id ? p.ama_id.trim() : (leadMeta.ama_id || meta.ama_id || `AMA-${u.id.substring(0, 6).toUpperCase()}`);

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
          paymentApproved: paymentApproved,
          stages: leadMeta.stages || meta.medpath_stages || p.stages || null,
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
        const whatsapp = leadMeta.whatsapp_number || leadMeta.phone || lead.phone || p.whatsapp_number || p.phone || '';
        const paymentApproved =
          leadMeta.payment_approved !== undefined
            ? Boolean(leadMeta.payment_approved)
            : p.payment_approved !== undefined && p.payment_approved !== null
            ? Boolean(p.payment_approved)
            : false;

        mergedStudents.push({
          id: p.id,
          ama_id: cleanAmaId,
          full_name: lead.name || p.full_name || p.email.split('@')[0],
          firstName: (lead.name || p.full_name || '').split(' ')[0] || 'Student',
          lastName: (lead.name || p.full_name || '').split(' ').slice(1).join(' ') || '',
          email: p.email,
          country: leadMeta.country || lead.target_country || p.country || '',
          address: leadMeta.address || p.address || '',
          whatsapp_number: whatsapp,
          whatsappNumber: whatsapp,
          phone: whatsapp,
          selected_package: leadMeta.selected_package || p.selected_package || p.selectedPackage || 'Ahsora IMAT Ascend',
          selectedPackage: leadMeta.selected_package || p.selected_package || p.selectedPackage || 'Ahsora IMAT Ascend',
          package_price: leadMeta.package_price || p.package_price || p.packagePrice || '€299',
          packagePrice: leadMeta.package_price || p.package_price || p.packagePrice || '€299',
          payment_approved: paymentApproved,
          paymentApproved: paymentApproved,
          stages: leadMeta.stages || p.stages || null,
          created_at: p.created_at || lead.created_at || new Date().toISOString(),
        });
      }
    });

    // Also include any enrolled leads that weren't matched in auth or profiles
    for (const [em, lead] of leadsEmailMap.entries()) {
      if (!processedEmails.has(em)) {
        processedEmails.add(em);
        const leadMeta = lead.leadMeta || {};
        const studentId = leadMeta.studentId || lead.id || `lead-${Date.now()}`;
        const cleanAmaId = leadMeta.ama_id || `AMA-${String(studentId).substring(0, 6).toUpperCase()}`;
        const whatsapp = leadMeta.whatsapp_number || leadMeta.phone || lead.phone || '';
        const paymentApproved =
          leadMeta.payment_approved !== undefined ? Boolean(leadMeta.payment_approved) : false;

        mergedStudents.push({
          id: studentId,
          ama_id: cleanAmaId,
          full_name: lead.name || em.split('@')[0],
          firstName: (lead.name || '').split(' ')[0] || 'Student',
          lastName: (lead.name || '').split(' ').slice(1).join(' ') || '',
          email: em,
          country: leadMeta.country || lead.target_country || '',
          address: leadMeta.address || '',
          whatsapp_number: whatsapp,
          whatsappNumber: whatsapp,
          phone: whatsapp,
          selected_package: leadMeta.selected_package || 'Ahsora IMAT Ascend',
          selectedPackage: leadMeta.selected_package || 'Ahsora IMAT Ascend',
          package_price: leadMeta.package_price || '€299',
          packagePrice: leadMeta.package_price || '€299',
          payment_approved: paymentApproved,
          paymentApproved: paymentApproved,
          stages: leadMeta.stages || null,
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

    const isApproved = body.paymentApproved === true || body.payment_approved === true;
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
            country: country || '',
            whatsapp_number: finalPhone,
            phone: finalPhone,
            selected_package: selectedPackage,
            package_price: packagePrice,
            ama_id: ama_id,
            payment_approved: isApproved,
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
            country: country || '',
            whatsapp_number: finalPhone,
            phone: finalPhone,
            selected_package: selectedPackage,
            package_price: packagePrice,
            ama_id: ama_id,
            payment_approved: isApproved,
          },
        });
      } catch (uErr) {
        console.warn('Auth metadata update warning:', uErr);
      }
    }

    // 2. Safe upsert to profiles table
    if (targetUserId) {
      try {
        const baseProfileData: any = {
          id: targetUserId,
          full_name: fullName,
          email: rawEmail,
          payment_approved: isApproved,
          role: 'student',
        };
        if (ama_id) baseProfileData.ama_id = ama_id;

        const extendedProfileData: any = {
          ...baseProfileData,
          country: country || '',
          address: address || '',
          whatsapp_number: finalPhone,
          phone: finalPhone,
          selected_package: selectedPackage,
          package_price: packagePrice,
        };

        const { error: extErr } = await supabase.from('profiles').upsert(extendedProfileData);
        if (extErr) {
          await supabase.from('profiles').upsert(baseProfileData);
        }
      } catch (pErr) {
        console.warn('Profile upsert warning:', pErr);
      }
    }

    // 3. Upsert/replace in leads table with enrolled status for immediate cross-device sync
    try {
      if (rawEmail) {
        await supabase.from('leads').delete().eq('email', rawEmail).eq('status', 'enrolled');
      }
      await supabase.from('leads').insert({
        name: fullName,
        email: rawEmail,
        phone: finalPhone,
        target_exam: 'IMAT',
        target_country: country || '',
        academic_background: JSON.stringify({
          studentId: targetUserId,
          ama_id: ama_id,
          address: address || '',
          country: country || '',
          whatsapp_number: finalPhone,
          phone: finalPhone,
          selected_package: selectedPackage,
          package_price: packagePrice,
          payment_approved: isApproved,
          registered_at: new Date().toISOString(),
        }),
        status: 'enrolled',
      });
    } catch (lErr) {
      console.warn('Leads enrolled backup notice:', lErr);
    }

    return NextResponse.json({
      success: true,
      studentId: targetUserId,
      paymentApproved: isApproved,
      message: 'Student registered and synced',
    });
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
    const {
      selectedPackage,
      packagePrice,
      paymentApproved,
      ama_id,
      enrollmentNumber,
      country,
      address,
      whatsappNumber,
      phone,
      fullName,
      stages,
    } = body;
    const resolvedAmaId = ama_id || enrollmentNumber;
    const resolvedPhone = whatsappNumber !== undefined ? whatsappNumber : phone;

    if (!rawStudentId && !rawEmail) {
      return NextResponse.json({ success: false, error: 'studentId or studentEmail required' }, { status: 400 });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let targetUserId = rawStudentId && uuidRegex.test(rawStudentId) ? rawStudentId : null;
    let existingUserMeta: any = {};

    // Look up real user in Supabase Auth by email or ID
    try {
      const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const found = (usersData?.users || []).find(
        (u) =>
          (rawEmail && (u.email || '').toLowerCase().trim() === rawEmail) ||
          (targetUserId && u.id === targetUserId)
      );
      if (found) {
        targetUserId = found.id;
        existingUserMeta = found.user_metadata || {};
      }
    } catch (lookupErr) {
      console.warn('Auth user lookup warning:', lookupErr);
    }

    // 1. Update Auth metadata if we have a valid UUID
    if (targetUserId) {
      try {
        const nextMeta: any = { ...existingUserMeta };
        if (selectedPackage !== undefined) nextMeta.selected_package = selectedPackage;
        if (packagePrice !== undefined) nextMeta.package_price = packagePrice;
        if (resolvedAmaId !== undefined) nextMeta.ama_id = resolvedAmaId;
        if (paymentApproved !== undefined) nextMeta.payment_approved = Boolean(paymentApproved);
        if (country !== undefined) nextMeta.country = country;
        if (address !== undefined) nextMeta.address = address;
        if (resolvedPhone !== undefined) {
          nextMeta.whatsapp_number = resolvedPhone;
          nextMeta.phone = resolvedPhone;
        }
        if (fullName !== undefined) nextMeta.full_name = fullName;
        if (stages !== undefined) nextMeta.medpath_stages = stages;

        await supabase.auth.admin.updateUserById(targetUserId, { user_metadata: nextMeta });
      } catch (uErr) {
        console.warn('Update user metadata warning:', uErr);
      }
    }

    // 2. Update profiles table safely (first guaranteed columns, then extended columns)
    const baseProfileUpdate: any = {};
    if (paymentApproved !== undefined) {
      baseProfileUpdate.payment_approved = Boolean(paymentApproved);
    }
    if (resolvedAmaId !== undefined) {
      baseProfileUpdate.ama_id = resolvedAmaId;
    }
    if (fullName !== undefined) {
      baseProfileUpdate.full_name = fullName;
    }

    if (Object.keys(baseProfileUpdate).length > 0) {
      try {
        if (targetUserId) {
          await supabase.from('profiles').update(baseProfileUpdate).eq('id', targetUserId);
        }
        if (rawEmail) {
          await supabase.from('profiles').update(baseProfileUpdate).eq('email', rawEmail);
        }
      } catch (pErr) {
        console.warn('Update base profiles table warning:', pErr);
      }
    }

    const extendedProfileUpdate: any = { ...baseProfileUpdate };
    if (selectedPackage !== undefined) extendedProfileUpdate.selected_package = selectedPackage;
    if (packagePrice !== undefined) extendedProfileUpdate.package_price = packagePrice;
    if (country !== undefined) extendedProfileUpdate.country = country;
    if (address !== undefined) extendedProfileUpdate.address = address;
    if (resolvedPhone !== undefined) {
      extendedProfileUpdate.whatsapp_number = resolvedPhone;
      extendedProfileUpdate.phone = resolvedPhone;
    }
    if (Object.keys(extendedProfileUpdate).length > Object.keys(baseProfileUpdate).length) {
      try {
        if (targetUserId) {
          await supabase.from('profiles').update(extendedProfileUpdate).eq('id', targetUserId);
        } else if (rawEmail) {
          await supabase.from('profiles').update(extendedProfileUpdate).eq('email', rawEmail);
        }
      } catch {}
    }

    // 3. Also update leads table (status='enrolled') so cross-device GET always reflects latest approval & student details
    if (rawEmail) {
      try {
        const { data: existingLeads } = await supabase
          .from('leads')
          .select('*')
          .eq('email', rawEmail)
          .eq('status', 'enrolled')
          .order('created_at', { ascending: false });

        if (existingLeads && existingLeads.length > 0) {
          const latestLead = existingLeads[0];
          let prevMeta: any = {};
          try {
            if (latestLead.academic_background && latestLead.academic_background.startsWith('{')) {
              prevMeta = JSON.parse(latestLead.academic_background);
            }
          } catch {}

          const nextMeta = {
            ...prevMeta,
            ...(targetUserId ? { studentId: targetUserId } : {}),
            ...(resolvedAmaId !== undefined ? { ama_id: resolvedAmaId } : {}),
            ...(selectedPackage !== undefined ? { selected_package: selectedPackage } : {}),
            ...(packagePrice !== undefined ? { package_price: packagePrice } : {}),
            ...(paymentApproved !== undefined ? { payment_approved: Boolean(paymentApproved) } : {}),
            ...(country !== undefined ? { country } : {}),
            ...(address !== undefined ? { address } : {}),
            ...(resolvedPhone !== undefined ? { whatsapp_number: resolvedPhone, phone: resolvedPhone } : {}),
            ...(stages !== undefined ? { stages } : {}),
            updated_at: new Date().toISOString(),
          };

          const leadUpdate: any = {
            academic_background: JSON.stringify(nextMeta),
          };
          if (fullName !== undefined) leadUpdate.name = fullName;
          if (resolvedPhone !== undefined) leadUpdate.phone = resolvedPhone;
          if (country !== undefined) leadUpdate.target_country = country;

          await supabase.from('leads').update(leadUpdate).eq('id', latestLead.id);
        } else {
          const nextMeta = {
            studentId: targetUserId || rawStudentId,
            ...(resolvedAmaId !== undefined ? { ama_id: resolvedAmaId } : {}),
            ...(selectedPackage !== undefined ? { selected_package: selectedPackage } : {}),
            ...(packagePrice !== undefined ? { package_price: packagePrice } : {}),
            ...(paymentApproved !== undefined ? { payment_approved: Boolean(paymentApproved) } : {}),
            ...(country !== undefined ? { country } : {}),
            ...(address !== undefined ? { address } : {}),
            ...(resolvedPhone !== undefined ? { whatsapp_number: resolvedPhone, phone: resolvedPhone } : {}),
            ...(stages !== undefined ? { stages } : {}),
            updated_at: new Date().toISOString(),
          };
          await supabase.from('leads').insert({
            name: fullName || rawEmail.split('@')[0],
            email: rawEmail,
            phone: resolvedPhone || '',
            target_exam: 'IMAT',
            target_country: country || '',
            academic_background: JSON.stringify(nextMeta),
            status: 'enrolled',
          });
        }
      } catch (lErr) {
        console.warn('Update enrolled lead warning:', lErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Student updated successfully', targetUserId });
  } catch (error: any) {
    console.error('API /api/admin/students update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
