'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function StudentStreakHistoryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/portal/progress/analysis');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '10px', color: '#64748B' }}>
      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#059669' }} />
      <span>Redirecting to Progress Analysis...</span>
    </div>
  );
}
