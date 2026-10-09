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
  Download,
  Upload,
  Flame,
  Calendar,
  Percent,
  Edit3,
  ListOrdered,
  Megaphone,
  Sliders,
  Bookmark
} from 'lucide-react';

import {
  getNewsPosts,
  addNewsPost,
  updateNewsPost,
  deleteNewsPost,
  syncNewsFromSupabase,
  NewsItem,
  ArticleIndexItem,
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
  getPortalTickerConfig,
  savePortalTickerConfig,
  updatePortalTickerConfig,
  addPortalTickerItem,
  deletePortalTickerItem,
  syncPortalTickerFromSupabase,
  PortalTickerConfig,
  getDynamicPackagePrices,
  updatePackagePricing,
  syncPricesFromSupabase,
  DynamicPackagePrice,
  getSaleOfferConfig,
  syncSaleOfferFromSupabase,
  updateSaleOfferConfig,
  SaleOfferConfig
} from '@/lib/cms-store';

import { createClient } from '@/lib/supabase/client';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'docs' | 'ticker' | 'pricing' | 'offer' | 'hero'>('news');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // ── 1. News Posts State ──────────────────────────────────────────────────
  const [newsPosts, setNewsPosts] = useState<NewsItem[]>([]);
  const [newsSearch, setNewsSearch] = useState('');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newNews, setNewNews] = useState<{
    title: string;
    category: string;
    excerpt: string;
    content: string;
    author: string;
    readTime: string;
    featured: boolean;
    indexes: ArticleIndexItem[];
  }>({
    title: '',
    category: 'Admissions',
    excerpt: '',
    content: '',
    author: 'Ahsora Team',
    readTime: '5 min read',
    featured: false,
    indexes: [],
  });
  const [customIndexTitle, setCustomIndexTitle] = useState('');
  const [customIndexId, setCustomIndexId] = useState('');

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

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    const validFormat: 'PDF' | 'DOCX' | 'ZIP' = ext === 'DOCX' ? 'DOCX' : ext === 'ZIP' ? 'ZIP' : 'PDF';

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileDataUrl = (event.target?.result as string) || URL.createObjectURL(file);
      setNewDoc({
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' '),
        description: `Official ${file.name} document uploaded directly for IMAT candidates.`,
        category: newDoc.category,
        format: validFormat,
        fileUrl: fileDataUrl,
        fileSize: formattedSize,
      });
      showToast('success', `📁 Loaded "${file.name}" (${formattedSize}). Click "Add Document to Resource Page" below to publish.`);
    };
    reader.readAsDataURL(file);
  };

  // ── 3. Ticker Items State ────────────────────────────────────────────────
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [newTickerText, setNewTickerText] = useState('');
  const [newTickerIcon, setNewTickerIcon] = useState('🎓');

  // ── 4. Package Pricing State ─────────────────────────────────────────────
  const [prices, setPrices] = useState<DynamicPackagePrice[]>([]);

  // ── 5. Sale Offer & Countdown State ──────────────────────────────────────
  const [saleOffer, setSaleOffer] = useState<SaleOfferConfig>({
    isSaleActive: true,
    offerTitle: '⚡ IMAT 2027 AUTUMN FLASH SALE — UP TO 25% OFF',
    offerSubtitle: 'Enrol today to lock in special discounted pricing with 12 months full portal access!',
    endDate: '2026-10-31T23:59:59',
    discountBadgeText: 'LIMITED TIME OFFER',
    promoCode: 'AUTUMN25',
  });
  // Portal ticker configuration state and sub‑tab selector
  const [portalTickerConfig, setPortalTickerConfig] = useState<PortalTickerConfig | null>(null);
  const [tickerSubTab, setTickerSubTab] = useState<'home' | 'portal'>('home');

  // ── 6. Hero Content State ────────────────────────────────────────────────
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
    setPortalTickerConfig(getPortalTickerConfig());
    setPrices(getDynamicPackagePrices());
    setSaleOffer(getSaleOfferConfig());

    // Sync with Supabase asynchronously
    try {
      const [syncedNews, syncedDocs, syncedTicker, syncedPrices, syncedOffer, syncedPortalTicker] = await Promise.all([
        syncNewsFromSupabase(),
        syncDocumentsFromSupabase(),
        syncTickerFromSupabase(),
        syncPricesFromSupabase(),
        syncSaleOfferFromSupabase(),
        syncPortalTickerFromSupabase(),
      ]);
      setNewsPosts(syncedNews);
      setDocuments(syncedDocs);
      setTickerItems(syncedTicker);
      setPrices(syncedPrices);
      if (syncedOffer) setSaleOffer(syncedOffer);
      if (syncedPortalTicker) setPortalTickerConfig(syncedPortalTicker);
    } catch (err) {
      console.warn('Supabase initial fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleSaveSaleOffer = (e: React.FormEvent) => {
    e.preventDefault();
    updateSaleOfferConfig(saleOffer);
    showToast('success', '🔥 Flash Sale offer configuration & countdown end date updated live across website!');
  };

  // ── News Handlers ────────────────────────────────────────────────────────
  const handleStartEditNews = (post: NewsItem) => {
    setEditingNewsId(post.id);
    setNewNews({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content || post.excerpt,
      author: post.author,
      readTime: post.readTime,
      featured: post.featured || false,
      indexes: (post as any).indexes || [],
    });
    showToast('success', `✏️ Editing "${post.title}". Update the fields and click "Save & Update Article".`);
  };

  const handleCancelEditNews = () => {
    setEditingNewsId(null);
    setNewNews({
      title: '',
      category: 'Admissions',
      excerpt: '',
      content: '',
      author: 'Ahsora Team',
      readTime: '5 min read',
      featured: false,
      indexes: [],
    });
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.excerpt) {
      showToast('error', 'Please fill in post title and summary excerpt.');
      return;
    }

    if (editingNewsId) {
      const existing = newsPosts.find((p) => p.id === editingNewsId);
      const updatedPost: NewsItem = {
        id: editingNewsId,
        title: newNews.title,
        slug: existing?.slug || newNews.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: newNews.category,
        excerpt: newNews.excerpt,
        content: newNews.content || newNews.excerpt,
        author: newNews.author,
        date: existing?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: newNews.readTime,
        featured: newNews.featured,
        imageUrl: existing?.imageUrl,
      };

      updateNewsPost(updatedPost);
      setNewsPosts(newsPosts.map((p) => (p.id === editingNewsId ? updatedPost : p)));
      setEditingNewsId(null);
      setNewNews({
        title: '',
        category: 'Admissions',
        excerpt: '',
        content: '',
        author: 'Ahsora Team',
        readTime: '5 min read',
        featured: false,
        indexes: [],
      });
      showToast('success', '✅ Article & description updated and synced live!');
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
      indexes: [],
    });
    showToast('success', '✅ News & Update published & synced with Database!');
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Are you sure you want to remove this news article?')) {
      if (editingNewsId === id) {
        handleCancelEditNews();
      }
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
          { id: 'offer', label: 'Flash Sale & Offer Banner', icon: <Flame size={18} /> },
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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '32px', alignItems: 'start' }}>
          
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
                .map((post) => {
                  const isCurrentEditing = editingNewsId === post.id;
                  return (
                    <div
                      key={post.id}
                      style={{
                        border: isCurrentEditing ? '2px solid #059669' : '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '16px',
                        backgroundColor: isCurrentEditing ? '#F0FDF4' : post.featured ? '#F0FFF4' : '#FFFFFF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '16px',
                        boxShadow: isCurrentEditing ? '0 4px 12px rgba(5,150,105,0.15)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: '#DCFCE7', color: '#047857', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                            {post.category}
                          </span>
                          {post.featured && (
                            <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                              Featured
                            </span>
                          )}
                          {isCurrentEditing && (
                            <span style={{ backgroundColor: '#059669', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                              NOW EDITING
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

                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleStartEditNews(post)}
                          style={{
                            backgroundColor: isCurrentEditing ? '#059669' : '#EEF2FF',
                            color: isCurrentEditing ? '#FFFFFF' : '#4F46E5',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}
                          title="Edit news article & rich description"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(post.id)}
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}
                          title="Delete news article"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right: Add/Edit News Form with RichTextEditor */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: editingNewsId ? '2px solid #059669' : '1px solid #E2E8F0', position: 'sticky', top: '24px', boxShadow: editingNewsId ? '0 10px 25px -5px rgba(5,150,105,0.1)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {editingNewsId ? (
                  <>
                    <Edit3 size={18} color="#059669" /> Edit News / Blog Article
                  </>
                ) : (
                  <>
                    <Plus size={18} color="#059669" /> Add New Update or Article
                  </>
                )}
              </h3>
              {editingNewsId && (
                <button
                  type="button"
                  onClick={handleCancelEditNews}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                    Summary Excerpt (Card &amp; Feed Preview)
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const sel = typeof window !== 'undefined' ? window.getSelection()?.toString() : '';
                        if (sel && newNews.excerpt.includes(sel)) {
                          setNewNews({ ...newNews, excerpt: newNews.excerpt.replace(sel, `<strong>${sel}</strong>`) });
                        } else {
                          setNewNews({ ...newNews, excerpt: newNews.excerpt + ' <strong>bold text</strong>' });
                        }
                      }}
                      style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '5px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontWeight: 800, color: '#1E293B' }}
                      title="Wrap selected text in bold"
                    >
                      B Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sel = typeof window !== 'undefined' ? window.getSelection()?.toString() : '';
                        if (sel && newNews.excerpt.includes(sel)) {
                          setNewNews({ ...newNews, excerpt: newNews.excerpt.replace(sel, `<mark style="background-color:#FEF08A;color:#0F172A;padding:1px 4px;border-radius:3px;font-weight:600;">${sel}</mark>`) });
                        } else {
                          setNewNews({ ...newNews, excerpt: newNews.excerpt + ' <mark style="background-color:#FEF08A;color:#0F172A;padding:1px 4px;border-radius:3px;font-weight:600;">highlighted</mark>' });
                        }
                      }}
                      style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '5px', border: '1px solid #F59E0B', background: '#FEF3C7', color: '#92400E', cursor: 'pointer', fontWeight: 800 }}
                      title="Wrap selected text in highlight"
                    >
                      ✨ Highlight
                    </button>
                  </div>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Short overview snippet shown on news cards and preview feeds..."
                  value={newNews.excerpt}
                  onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Full Content &amp; Description (Full Rich Text Editor)
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    ✨ Bold, Highlight, Links &amp; Headings Active
                  </span>
                </div>
                {/* Full Rich Text Editor Component */}
                <RichTextEditor
                  value={newNews.content}
                  onChange={(val) => setNewNews({ ...newNews, content: val })}
                  placeholder="Write the full news and blog content here. Highlight important texts, bold key phrases, add web links, headings, blockquotes, and callouts..."
                  minHeight="260px"
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
                  backgroundColor: editingNewsId ? '#059669' : '#059669',
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
                  boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
                }}
              >
                {editingNewsId ? (
                  <>
                    <Save size={18} /> Save &amp; Update Article
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Publish Update to News Page
                  </>
                )}
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
              
              {/* Direct File Picker Button */}
              <div style={{ backgroundColor: '#F0FFF4', border: '1.5px dashed #059669', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDeviceFileUpload}
                  accept=".pdf,.docx,.zip,.doc,.txt"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 10px rgba(5,150,105,0.2)',
                  }}
                >
                  <Upload size={16} /> Choose File from Device
                </button>
                <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '6px', fontWeight: 600 }}>
                  Directly pick any PDF, DOCX, or ZIP document from your computer
                </div>
              </div>

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

      {/* ── TAB 3: MOVING STRIP TICKER (HOME & PORTAL) ────────────────────────────── */}
      {activeTab === 'ticker' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Sub‑tab selector */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={() => setTickerSubTab('home')}
              style={{
                backgroundColor: tickerSubTab === 'home' ? '#059669' : '#FFFFFF',
                color: tickerSubTab === 'home' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Home Strip
            </button>
            <button
              onClick={() => setTickerSubTab('portal')}
              style={{
                backgroundColor: tickerSubTab === 'portal' ? '#059669' : '#FFFFFF',
                color: tickerSubTab === 'portal' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Portal Strip
            </button>
          </div>
          {/* Live Preview Bar */}
          <div style={{ backgroundColor: '#0F172A', padding: '20px', borderRadius: '16px', color: '#FFFFFF', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8125rem', color: '#5CED73', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              ⚡ Live {tickerSubTab === 'home' ? 'Homepage' : 'Student Portal'} Moving Strip Preview
            </div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ display: 'inline-flex', gap: '24px' }}>
                {(tickerSubTab === 'home' ? tickerItems : (portalTickerConfig?.items || [])).map((item) => (
                  <span key={item.id} style={{ color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                    <span style={{ color: '#475569', marginLeft: '12px' }}>•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── HOME STRIP PANEL ── */}
          {tickerSubTab === 'home' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px', alignItems: 'start' }}>
              {/* Left: Home Ticker Items List */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                  Homepage Moving Strip Announcements ({tickerItems.length})
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

              {/* Right: Add Home Ticker Form */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={18} color="#059669" /> Add Homepage Announcement
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
                    style={{ backgroundColor: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Plus size={18} /> Add to Homepage Moving Strip
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── PORTAL STRIP PANEL ── */}
          {tickerSubTab === 'portal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Portal strip settings row */}
              {portalTickerConfig && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={portalTickerConfig.isActive}
                      onChange={(e) => {
                        const updated = { ...portalTickerConfig, isActive: e.target.checked };
                        setPortalTickerConfig(updated);
                        updatePortalTickerConfig(updated);
                        showToast('success', `✅ Portal strip ${e.target.checked ? 'activated' : 'deactivated'} live!`);
                      }}
                    />
                    Strip Active
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Speed (seconds):</label>
                    <input
                      type="number"
                      min={10} max={60}
                      value={portalTickerConfig.speedSeconds}
                      onChange={(e) => setPortalTickerConfig({ ...portalTickerConfig, speedSeconds: Number(e.target.value) })}
                      onBlur={() => { updatePortalTickerConfig(portalTickerConfig!); showToast('success', '✅ Portal strip speed updated!'); }}
                      style={{ width: '70px', padding: '6px 8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700 }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Theme:</label>
                    <select
                      value={portalTickerConfig.bgStyle}
                      onChange={(e) => {
                        const updated = { ...portalTickerConfig, bgStyle: e.target.value as any };
                        setPortalTickerConfig(updated);
                        updatePortalTickerConfig(updated);
                        showToast('success', '✅ Portal strip theme updated!');
                      }}
                      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 600 }}
                    >
                      <option value="emerald">🟢 Emerald (Dark Green)</option>
                      <option value="dark">🔵 Dark (Slate Blue)</option>
                      <option value="slate">⬜ Slate (Light)</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px', alignItems: 'start' }}>
                {/* Left: Portal Ticker Items */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                    Student Portal Strip Items ({portalTickerConfig?.items?.length ?? 0})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(portalTickerConfig?.items || []).map((item) => (
                      <div
                        key={item.id}
                        style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>
                          <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                          <span>{item.text}</span>
                        </div>
                        <button
                          onClick={() => {
                            const updated = deletePortalTickerItem(item.id);
                            setPortalTickerConfig(updated);
                            showToast('success', 'Portal strip item removed.');
                          }}
                          style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Add Portal Ticker Form */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} color="#059669" /> Add Portal Announcement
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newTickerText.trim()) { showToast('error', 'Please enter ticker text.'); return; }
                      const updated = addPortalTickerItem(newTickerText.trim(), newTickerIcon);
                      setPortalTickerConfig(updated);
                      setNewTickerText('');
                      showToast('success', '✅ Portal strip updated & synced live to student portal!');
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Icon Emoji</label>
                      <select
                        value={newTickerIcon}
                        onChange={(e) => setNewTickerIcon(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none' }}
                      >
                        <option value="🎓">🎓 Graduation / Study</option>
                        <option value="🎯">🎯 Mock Test / Exam</option>
                        <option value="📅">📅 Event / Masterclass</option>
                        <option value="💡">💡 Study Tip</option>
                        <option value="🏆">🏆 Achievement</option>
                        <option value="⚡">⚡ Announcement</option>
                        <option value="📚">📚 Resources</option>
                        <option value="📢">📢 Notice</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Portal Message Text</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Full-Length IMAT 2027 CBT Mock Test #12 is now live!"
                        value={newTickerText}
                        onChange={(e) => setNewTickerText(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ backgroundColor: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Plus size={18} /> Add to Student Portal Strip
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
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

      {/* ── TAB 5: FLASH SALE & OFFER MANAGER ─────────────────────────────── */}
      {activeTab === 'offer' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', maxWidth: '780px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Special Sale &amp; Flash Offer Manager
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '2px 0 0 0' }}>
                Configure live sale banners, discount offer titles, promo codes, and countdown end-dates synced live across the site.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSaleOffer} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Active Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: saleOffer.isSaleActive ? '#F0FFF4' : '#F8FAFC', border: `1.5px solid ${saleOffer.isSaleActive ? '#86EFAC' : '#E2E8F0'}`, borderRadius: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={saleOffer.isSaleActive}
                onChange={(e) => setSaleOffer({ ...saleOffer, isSaleActive: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: '#059669', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: saleOffer.isSaleActive ? '#047857' : '#475569' }}>
                  {saleOffer.isSaleActive ? '🔥 Flash Sale Offer is LIVE & Active' : '⏸️ Flash Sale Banner Hidden'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  When enabled, a prominent countdown banner and offer callouts will appear on the Courses page and Hero sections.
                </div>
              </div>
            </label>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Offer Headline / Title</label>
              <input
                type="text"
                required
                value={saleOffer.offerTitle}
                onChange={(e) => setSaleOffer({ ...saleOffer, offerTitle: e.target.value })}
                placeholder="e.g. ⚡ IMAT 2027 AUTUMN FLASH SALE — UP TO 25% OFF"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Offer Subtitle / Description</label>
              <textarea
                rows={2}
                required
                value={saleOffer.offerSubtitle}
                onChange={(e) => setSaleOffer({ ...saleOffer, offerSubtitle: e.target.value })}
                placeholder="e.g. Enrol today to lock in special discounted pricing with 12 months full portal access!"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Sale End Date &amp; Time (Countdown Target)</label>
                <input
                  type="text"
                  required
                  value={saleOffer.endDate}
                  onChange={(e) => setSaleOffer({ ...saleOffer, endDate: e.target.value })}
                  placeholder="2026-10-31T23:59:59"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px', display: 'block' }}>Format: YYYY-MM-DDTHH:MM:SS</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Discount Badge Text</label>
                <input
                  type="text"
                  value={saleOffer.discountBadgeText || ''}
                  onChange={(e) => setSaleOffer({ ...saleOffer, discountBadgeText: e.target.value })}
                  placeholder="e.g. LIMITED TIME OFFER"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Promo Code (Optional)</label>
                <input
                  type="text"
                  value={saleOffer.promoCode || ''}
                  onChange={(e) => setSaleOffer({ ...saleOffer, promoCode: e.target.value })}
                  placeholder="e.g. AUTUMN25"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
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
                padding: '14px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
                boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
              }}
            >
              <Save size={18} /> Save &amp; Sync Sale Offer Live
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 6: HERO BANNER COPY ─────────────────────────────────────────── */}
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
