import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://couhzxvhzdipbffrkerf.supabase.co';
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sample-key';
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('GET /api/admin/news error:', error.message);
      return NextResponse.json({ success: false, error: error.message, posts: [] }, { status: 500 });
    }

    return NextResponse.json({ success: true, posts: data || [] }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (err: any) {
    console.error('GET /api/admin/news exception:', err);
    return NextResponse.json({ success: false, error: err.message, posts: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || 'upsert';
    const supabase = getSupabaseClient();

    if (action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Article ID required' }, { status: 400 });
      }

      const { error } = await supabase.from('news_posts').delete().eq('id', id);
      if (error) {
        console.warn('DELETE in /api/admin/news error:', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, deletedId: id });
    }

    // Upsert or create
    const post = body.post || body;
    if (!post || !post.title) {
      return NextResponse.json({ success: false, error: 'Article title required' }, { status: 400 });
    }

    const postId = post.id || `news-${Date.now()}`;
    let baseSlug = (post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
    if (!baseSlug) baseSlug = `article-${Date.now()}`;

    // Verify slug uniqueness if new post
    if (!post.id) {
      const { data: existing } = await supabase.from('news_posts').select('id').eq('slug', baseSlug).maybeSingle();
      if (existing) {
        baseSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    const payload = {
      id: postId,
      title: post.title,
      slug: baseSlug,
      excerpt: post.excerpt || '',
      content: post.content || post.excerpt || '',
      category: post.category || 'Admissions',
      author: post.author || 'Ahsora Team',
      date: post.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read_time: post.readTime || post.read_time || '5 min read',
      image_url: post.imageUrl || post.image_url || null,
      featured: Boolean(post.featured),
      meta_title: post.metaTitle || post.meta_title || post.title,
      meta_description: post.metaDescription || post.meta_description || post.excerpt || '',
      faq_items: Array.isArray(post.faqItems) ? post.faqItems : (Array.isArray(post.faq_items) ? post.faq_items : []),
    };

    const { data: saved, error: saveErr } = await supabase
      .from('news_posts')
      .upsert(payload)
      .select()
      .maybeSingle();

    if (saveErr) {
      console.warn('UPSERT in /api/admin/news error:', saveErr.message);
      return NextResponse.json({ success: false, error: saveErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: saved || payload });
  } catch (err: any) {
    console.error('POST /api/admin/news exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
