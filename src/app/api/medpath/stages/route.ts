import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get('email') || '').toLowerCase().trim();
  const studentId = searchParams.get('studentId') || '';

  if (!email && !studentId) {
    return NextResponse.json({ success: false, error: 'email or studentId required' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = (usersData?.users || []).find(
      (u) =>
        (email && (u.email || '').toLowerCase().trim() === email) ||
        (studentId && u.id === studentId)
    );

    if (user) {
      const stages = user.user_metadata?.medpath_stages || {};
      const { data: profile } = await supabase
        .from('profiles')
        .select('ama_id')
        .eq('id', user.id)
        .maybeSingle();
      const amaId = profile?.ama_id || user.user_metadata?.ama_id || '';
      return NextResponse.json({
        success: true,
        stages,
        student: { id: user.id, email: user.email, ama_id: amaId },
      });
    }

    // Try profiles table fallback
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .or(`email.ilike.${email},id.eq.${studentId || '00000000-0000-0000-0000-000000000000'}`)
      .maybeSingle();

    if (profile) {
      return NextResponse.json({
        success: true,
        stages: profile.stages || {},
        student: { id: profile.id, email: profile.email, ama_id: profile.ama_id },
      });
    }

    return NextResponse.json({ success: true, stages: {} });
  } catch (error: any) {
    console.error('API /api/medpath/stages GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const body = await request.json();
    const rawEmail = (body.email || body.studentEmail || '').toLowerCase().trim();
    const rawStudentId = body.studentId || body.id || '';
    const { stageKey, stageData, allStages, enrollmentNumber, ama_id } = body;
    const resolvedAmaId = enrollmentNumber || ama_id;

    if (!rawEmail && !rawStudentId) {
      return NextResponse.json({ success: false, error: 'email or studentId required' }, { status: 400 });
    }

    // Lookup user in Auth
    const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const targetUser = (usersData?.users || []).find(
      (u) =>
        (rawEmail && (u.email || '').toLowerCase().trim() === rawEmail) ||
        (rawStudentId && u.id === rawStudentId)
    );

    let updatedStages: Record<string, any> = {};

    if (targetUser) {
      const currentStages = targetUser.user_metadata?.medpath_stages || {};
      if (allStages) {
        updatedStages = { ...currentStages, ...allStages };
      } else if (stageKey) {
        updatedStages = {
          ...currentStages,
          [stageKey]: {
            ...(currentStages[stageKey] || {}),
            ...stageData,
            updatedAt: new Date().toISOString(),
          },
        };
      }

      const updatedMeta: any = {
        ...targetUser.user_metadata,
        medpath_stages: Object.keys(updatedStages).length > 0 ? updatedStages : targetUser.user_metadata?.medpath_stages,
      };
      if (resolvedAmaId) {
        updatedMeta.ama_id = resolvedAmaId;
      }

      await supabase.auth.admin.updateUserById(targetUser.id, {
        user_metadata: updatedMeta,
      });
    }

    // Also attempt updating profiles table if it exists
    try {
      const profileUpdates: any = {};
      if (Object.keys(updatedStages).length > 0) profileUpdates.stages = updatedStages;
      if (resolvedAmaId) profileUpdates.ama_id = resolvedAmaId;

      if (Object.keys(profileUpdates).length > 0) {
        const query = rawStudentId
          ? supabase.from('profiles').update(profileUpdates).eq('id', rawStudentId)
          : supabase.from('profiles').update(profileUpdates).ilike('email', rawEmail);
        await query;
      }
    } catch {}

    return NextResponse.json({ success: true, stages: updatedStages, enrollmentNumber: resolvedAmaId });
  } catch (error: any) {
    console.error('API /api/medpath/stages POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
