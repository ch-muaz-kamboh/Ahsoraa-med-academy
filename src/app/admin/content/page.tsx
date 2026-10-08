'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileSignature,
  Newspaper,
  FileText,
  Zap,
  Tag,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Sparkles,
  Search,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Clock,
  Download
} from 'lucide-react';

import {
  getNewsPosts,
  addNewsPost,
  deleteNewsPost,
  syncNewsFromSupabase,
  NewsItem,
  getResourceDocuments,
  addResourceDocument,
  deleteResourceDocument,
  syncDocumentsFromSupabase,
  ResourceDocument,
  getTickerItems,
  addTickerItem,
  deleteTickerItem,
  syncTickerFromSupabase,
  TickerItem,
  getDynamicPackagePrices,
  updatePackagePricing,
  syncPricesFromSupabase,
  DynamicPackagePrice
} from '@/lib/cms-store';

import { createClient } from '@/lib/supabase/client';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'docs' | 'ticker' | 'pricing' | 'hero'>('news');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // ── 1. News Posts State ──────────────────────────────────────────────────
  const [newsPosts, setNewsPosts] = useState<NewsItem[]>([]);
  const [newsSearch, setNewsSearch] = useState('');
  const [newNews, setNewNews] = useState({
    title: '',
    category: 'Admissions',
    excerpt: '',
    content: '',
    author: 'Ahsora Team',
    readTime: '5 min read',
    featured: false,
  });

  // ── 2. Resource Documents State ──────────────────────────────────────────
  const [documents, setDocuments] = useState<ResourceDocument[]>([]);
  const [docSearch, setDocSearch] = useState('');
  const [newDoc, setNewDoc] = useState({
    title: '',
    description: '',
    category: 'Syllabus & Blueprint',
    format: 'PDF' as 'PDF' | 'DOCX' | 'ZIP',
    fileUrl: '/docs/sample_document.pdf',
    fileSize: '2.5 MB',
  });

  // ── 3. Ticker Items State ────────────────────────────────────────────────
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [newTickerText, setNewTickerText] = useState('');
  const [newTickerIcon, setNewTickerIcon] = useState('🎓');

  // ── 4. Package Pricing State ─────────────────────────────────────────────
  const [prices, setPrices] = useState<DynamicPackagePrice[]>([]);

  // ── 5. Hero Content State ────────────────────────────────────────────────
  const [heroContent, setHeroContent] = useState({
    hero_headline_1: 'THE IMAT IS THE TEST.',
    hero_headline_2: 'YOUR JOURNEY IS MUCH BIGGER.',
    hero_subtitle: 'Prepare with live expert teaching, structured practice and realistic testing.',
    hero_btn_primary: 'EXPLORE PROGRAMMES',
    hero_btn_secondary: 'TAKE A FREE IMAT MOCK',
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = useCallback(async () => {
    setLoading(true);
    // Load local first
    setNewsPosts(getNewsPosts());
    setDocuments(getResourceDocuments());
    setTickerItems(getTickerItems());
    setPrices(getDynamicPackagePrices());

    // Sync with Supabase asynchronously
    try {
      const [syncedNews, syncedDocs, syncedTicker, syncedPrices] = await Promise.all([
        syncNewsFromSupabase(),
        syncDocumentsFromSupabase(),
        syncTickerFromSupabase(),
        syncPricesFromSupabase(),
      ]);
      setNewsPosts(syncedNews);
      setDocuments(syncedDocs);
      setTickerItems(syncedTicker);
      setPrices(syncedPrices);
    } catch (err) {
      console.warn('Supabase initial fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ── News Handlers ────────────────────────────────────────────────────────
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.excerpt) {
      showToast('error', 'Please fill in post title and summary excerpt.');
      return;
    }
    const created = addNewsPost({
      title: newNews.title,
      slug: newNews.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newNews.category,
      excerpt: newNews.excerpt,
      content: newNews.content || newNews.excerpt,
      author: newNews.author,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: newNews.readTime,
      featured: newNews.featured,
    });
    setNewsPosts([created, ...newsPosts]);
    setNewNews({
      title: '',
      category: 'Admissions',
      excerpt: '',
      content: '',
      author: 'Ahsora Team',
      readTime: '5 min read',
      featured: false,
    });
    showToast('success', '✅ News & Update published & synced with Database!');
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Are you sure you want to remove this news article?')) {
      deleteNewsPost(id);
      setNewsPosts(newsPosts.filter((p) => p.id !== id));
      showToast('success', 'Article removed.');
    }
  };

  // ── Document Handlers ────────────────────────────────────────────────────
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.description) {
      showToast('error', 'Please fill in document title and description.');
      return;
    }
    const created = addResourceDocument({
      title: newDoc.title,
      description: newDoc.description,
      category: newDoc.category,
      format: newDoc.format,
      fileUrl: newDoc.fileUrl,
      fileSize: newDoc.fileSize,
    });
    setDocuments([created, ...documents]);
    setNewDoc({
      title: '',
      description: '',
      category: 'Syllabus & Blueprint',
      format: 'PDF',
      fileUrl: '/docs/sample_document.pdf',
      fileSize: '2.5 MB',
    });
    showToast('success', '✅ Document added to Resource Vault & synced with Database!');
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm('Are you sure you want to remove this document from the vault?')) {
      deleteResourceDocument(id);
      setDocuments(documents.filter((d) => d.id !== id));
      showToast('success', 'Document removed.');
    }
  };

  // ── Ticker Handlers ──────────────────────────────────────────────────────
  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerText.trim()) {
      showToast('error', 'Please enter ticker text.');
      return;
    }
    const created = addTickerItem(newTickerText.trim(), newTickerIcon);
    setTickerItems([...tickerItems, created]);
    setNewTickerText('');
    showToast('success', '✅ Moving strip ticker updated & synced!');
  };

  const handleDeleteTicker = (id: string) => {
    deleteTickerItem(id);
    setTickerItems(tickerItems.filter((t) => t.id !== id));
    showToast('success', 'Ticker item removed.');
  };

  // ── Pricing Handlers ─────────────────────────────────────────────────────
  const handlePricingChange = (
    id: string,
    field: keyof DynamicPackagePrice,
    val: any
  ) => {
    setPrices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleSavePrice = (id: string) => {
    const target = prices.find((p) => p.id === id);
    if (!target) return;
    updatePackagePricing(
      target.id,
      target.price,
      Number(target.numericPrice) || 0,
      target.originalPrice,
      target.numericOriginalPrice ? Number(target.numericOriginalPrice) : undefined,
      target.discountBadge,
      target.isDiscountActive ?? true
    );
    showToast('success', `✅ ${target.name} price & discount updated across website!`);
  };

  // ── Hero Handlers ────────────────────────────────────────────────────────
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = createClient();
      await supabase.from('site_content').upsert({
        id: 1,
        hero_headline_1: heroContent.hero_headline_1,
        hero_headline_2: heroContent.hero_headline_2,
        hero_subtitle: heroContent.hero_subtitle,
        hero_btn_primary: heroContent.hero_btn_primary,
        hero_btn_secondary: heroContent.hero_btn_secondary,
      });
      showToast('success', '✅ Hero banner text updated!');
    } catch {
      showToast('success', '✅ Hero text saved to local configuration!');
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#0F172A' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: toast.type === 'success' ? '#065F46' : '#991B1B',
            color: '#FFFFFF',
            padding: '14px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} color="#86EFAC" /> : <AlertCircle size={18} color="#FCA5A5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSignature size={28} color="#059669" /> Website &amp; CMS Content Control Panel
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem', margin: '4px 0 0 0' }}>
            Manage News, Resource Documents, Homepage Moving Ticker, and Course Prices/Discounts synced with Database.
          </p>
        </div>

        <button
          onClick={loadAllData}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            backgroundColor: '#FFFFFF',
            color: '#475569',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Sync Database Data
        </button>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {[
          { id: 'news', label: 'News & Blogs', icon: <Newspaper size={18} />, badge: newsPosts.length },
          { id: 'docs', label: 'Resource Vault (Docs Only)', icon: <FileText size={18} />, badge: documents.length },
          { id: 'ticker', label: 'Homepage Moving Strip', icon: <Zap size={18} />, badge: tickerItems.length },
          { id: 'pricing', label: 'Course Pricing & Discounts', icon: <Tag size={18} />, badge: prices.length },
          { id: 'hero', label: 'Hero Banner Copy', icon: <FileSignature size={18} /> },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: active ? '#059669' : '#FFFFFF',
                color: active ? '#FFFFFF' : '#475569',
                boxShadow: active ? '0 4px 12px rgba(5,150,105,0.25)' : 'none',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  style={{
                    backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                    color: active ? '#FFFFFF' : '#64748B',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: NEWS & BLOGS MANAGER ────────────────────────────────────── */}
      {activeTab === 'news' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px', alignItems: 'start' }}>
          
          {/* Left: News List */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Published News &amp; Updates ({newsPosts.length})
              </h3>
              <div style={{ position: 'relative', width: '220px' }}>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 12px 6px 32px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {newsPosts
                .filter((p) => p.title.toLowerCase().includes(newsSearch.toLowerCase()) || p.category.toLowerCase().includes(newsSearch.toLowerCase()))
                .map((post) => (
                  <div
                    key={post.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: post.featured ? '#F0FFF4' : '#FFFFFF',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ backgroundColor: '#DCFCE7', color: '#047857', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                          {post.category}
                        </span>
                        {post.featured && (
                          <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                            Featured
                          </span>
                        )}
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{post.date} • {post.readTime}</span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                        {post.title}
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                        {post.excerpt}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteNews(post.id)}
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      title="Delete news article"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Right: Add News Form */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', position: 'sticky', top: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="#059669" /> Add New Update or Article
            </h3>

            <form onSubmit={handleAddNews} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IMAT 2027 Registration Guidelines Released"
                  value={newNews.title}
                  onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Category</label>
                <select
                  value={newNews.category}
                  onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="Admissions">Admissions</option>
                  <option value="IMAT Tips">IMAT Tips</option>
                  <option value="University Guide">University Guide</option>
                  <option value="Study Plan">Study Plan</option>
                  <option value="Licensing">Licensing</option>
                  <option value="Visa & Living">Visa &amp; Living</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Summary Excerpt</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Short overview snippet shown on news cards..."
                  value={newNews.excerpt}
                  onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Full Content Details</label>
                <textarea
                  rows={5}
                  placeholder="Full article content text..."
                  value={newNews.content}
                  onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Author</label>
                  <input
                    type="text"
                    value={newNews.author}
                    onChange={(e) => setNewNews({ ...newNews, author: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Read Time</label>
                  <input
                    type="text"
                    value={newNews.readTime}
                    onChange={(e) => setNewNews({ ...newNews, readTime: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#334155', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  checked={newNews.featured}
                  onChange={(e) => setNewNews({ ...newNews, featured: e.target.checked })}
                />
                Mark as Featured Main Hero Post
              </label>

              <button
                type="submit"
                style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={18} /> Publish Update to News Page
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ── TAB 2: RESOURCE DOCUMENTS MANAGER (DOCS ONLY) ────────────────── */}
      {activeTab === 'docs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px', alignItems: 'start' }}>
          
          {/* Left: Documents List */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Resource Vault Documents ({documents.length})
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>Note: Resources Page displays documents ONLY</span>
              </div>

              <div style={{ position: 'relative', width: '220px' }}>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 12px 6px 32px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {documents
                .filter((d) => d.title.toLowerCase().includes(docSearch.toLowerCase()) || d.category.toLowerCase().includes(docSearch.toLowerCase()))
                .map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                          {doc.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                          {doc.format} • {doc.fileSize}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                        {doc.title}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                        {doc.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      title="Delete document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Right: Add Document Form */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="#059669" /> Upload / Add Document
            </h3>

            <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official IMAT 2027 Biology Practice Bank"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Category</label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="Syllabus & Blueprint">Syllabus &amp; Blueprint</option>
                  <option value="Biology Notes">Biology Notes</option>
                  <option value="Chemistry Cheat Sheets">Chemistry Cheat Sheets</option>
                  <option value="Past Papers">Past Papers</option>
                  <option value="Physics & Math">Physics &amp; Math</option>
                  <option value="Admissions Checklists">Admissions Checklists</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Short description of the PDF document..."
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Format</label>
                  <select
                    value={newDoc.format}
                    onChange={(e) => setNewDoc({ ...newDoc, format: e.target.value as any })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="ZIP">ZIP</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>File Size</label>
                  <input
                    type="text"
                    value={newDoc.fileSize}
                    onChange={(e) => setNewDoc({ ...newDoc, fileSize: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>File URL / Download Path</label>
                <input
                  type="text"
                  required
                  value={newDoc.fileUrl}
                  onChange={(e) => setNewDoc({ ...newDoc, fileUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={18} /> Add Document to Resource Page
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ── TAB 3: HOMEPAGE MOVING STRIP TICKER ────────────────────────────── */}
      {activeTab === 'ticker' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Live Preview Bar */}
          <div style={{ backgroundColor: '#0F172A', padding: '20px', borderRadius: '16px', color: '#FFFFFF', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8125rem', color: '#5CED73', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              ⚡ Live Homepage Moving Strip Preview
            </div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ display: 'inline-flex', gap: '24px' }}>
                {tickerItems.map((item) => (
                  <span key={item.id} style={{ color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                    <span style={{ color: '#475569', marginLeft: '12px' }}>•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px', alignItems: 'start' }}>
            {/* Left: Ticker Items List */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                Active Moving Strip Announcements ({tickerItems.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tickerItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>
                      <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTicker(item.id)}
                      style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Add Ticker Form */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="#059669" /> Add Moving Strip Announcement
              </h3>

              <form onSubmit={handleAddTicker} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Icon Emoji</label>
                  <select
                    value={newTickerIcon}
                    onChange={(e) => setNewTickerIcon(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="🎓">🎓 Graduation / Admission</option>
                    <option value="⚡">⚡ Announcement / Discount</option>
                    <option value="🏆">🏆 Achievement / Questions</option>
                    <option value="📜">📜 Visa & Legal Support</option>
                    <option value="💼">💼 Doctors & Mentors</option>
                    <option value="✨">✨ Special Sparkle</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Ticker Text</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IMAT 2027 Registration Open — Special Discount Offer Active"
                    value={newTickerText}
                    onChange={(e) => setNewTickerText(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={18} /> Add to Homepage Moving Strip
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: COURSE PRICING & DISCOUNTS ───────────────────────────────── */}
      {activeTab === 'pricing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#F0FFF4', border: '1px solid #BBF7D0', padding: '16px 20px', borderRadius: '12px', color: '#166534', fontSize: '0.9rem' }}>
            <strong>Dynamic Pricing &amp; Discount Engine:</strong> Edit prices, original crossed-out prices, and discount badges here. Updates reflect instantly across the Courses page, Homepage cards, and Registration checkout.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {prices.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {pkg.name}
                  </h3>
                  <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                    Package ID: {pkg.id}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Current Sale Price (e.g. €299)</label>
                  <input
                    type="text"
                    value={pkg.price}
                    onChange={(e) => handlePricingChange(pkg.id, 'price', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', fontWeight: 700, color: '#059669' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Original Crossed-Out Price (e.g. €399)</label>
                  <input
                    type="text"
                    value={pkg.originalPrice || ''}
                    onChange={(e) => handlePricingChange(pkg.id, 'originalPrice', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', color: '#64748B' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Discount Badge Text (e.g. 25% OFF)</label>
                  <input
                    type="text"
                    value={pkg.discountBadge || ''}
                    onChange={(e) => handlePricingChange(pkg.id, 'discountBadge', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={pkg.isDiscountActive ?? true}
                    onChange={(e) => handlePricingChange(pkg.id, 'isDiscountActive', e.target.checked)}
                  />
                  Enable Active Discount Display
                </label>

                <button
                  onClick={() => handleSavePrice(pkg.id)}
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: 'auto',
                  }}
                >
                  <Save size={16} /> Save Price Changes
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: HERO BANNER COPY ─────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', maxWidth: '750px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px' }}>
            Public Landing Page Hero Copy
          </h3>

          <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Main Headline (Line 1)</label>
              <input
                type="text"
                value={heroContent.hero_headline_1}
                onChange={(e) => setHeroContent({ ...heroContent, hero_headline_1: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Headline Highlight (Line 2 — Green Accent)</label>
              <input
                type="text"
                value={heroContent.hero_headline_2}
                onChange={(e) => setHeroContent({ ...heroContent, hero_headline_2: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', color: '#059669', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Supporting Subtitle</label>
              <textarea
                rows={3}
                value={heroContent.hero_subtitle}
                onChange={(e) => setHeroContent({ ...heroContent, hero_subtitle: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Primary Button Text</label>
                <input
                  type="text"
                  value={heroContent.hero_btn_primary}
                  onChange={(e) => setHeroContent({ ...heroContent, hero_btn_primary: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Secondary Button Text</label>
                <input
                  type="text"
                  value={heroContent.hero_btn_secondary}
                  onChange={(e) => setHeroContent({ ...heroContent, hero_btn_secondary: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#059669',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '12px',
              }}
            >
              <Save size={18} /> Save Hero Copy
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
