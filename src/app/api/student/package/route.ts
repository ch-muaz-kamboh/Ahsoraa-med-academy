import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ success: false, error: 'Email parameter required' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { data: usersData, error: userError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (userError) throw userError;

    const matchedUser = (usersData.users || []).find(
      (u) => (u.email || '').toLowerCase().trim() === email
    );

    if (matchedUser) {
      const meta = matchedUser.user_metadata || {};
      const pkgName = meta.selected_package || meta.selectedPackage || 'Ahsora IMAT Ascend';
      const pkgPrice = meta.package_price || meta.packagePrice || '€299';

      const isElite = pkgName.toLowerCase().includes('elite');
      const isMastery = pkgName.toLowerCase().includes('mastery') || isElite;
      const tier = isElite ? 'elite' : isMastery ? 'mastery' : 'ascend';

      return NextResponse.json({
        success: true,
        selectedPackage: pkgName,
        packagePrice: pkgPrice,
        userId: matchedUser.id,
        tier,
        permissions: {
          schedule: isMastery,
          medpath: isElite,
          documentVault: isElite,
          lectures: true,
          library: true,
          practiceBank: true,
          cbtMocks: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      selectedPackage: 'Ahsora IMAT Ascend',
      packagePrice: '€299',
      tier: 'ascend',
      permissions: {
        schedule: false,
        medpath: false,
        documentVault: false,
        lectures: true,
        library: true,
        practiceBank: true,
        cbtMocks: true,
      },
    });
  } catch (error: any) {
    console.error('API /api/student/package error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
