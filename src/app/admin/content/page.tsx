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
  Bookmark,
  Table as TableIcon,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { parseHeadingsFromHtml } from '@/components/news/ArticleTableOfContents';
import CutoffTableManager from '@/components/admin/CutoffTableManager';

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
  getImatTickerConfig,
  saveImatTickerConfig,
  updateImatTickerConfig,
  addImatTickerItem,
  deleteImatTickerItem,
  syncImatTickerFromSupabase,
  PortalTickerConfig,
  getDynamicPackagePrices,
  updatePackagePricing,
  syncPricesFromSupabase,
  DynamicPackagePrice,
  getSaleOfferConfig,
  syncSaleOfferFromSupabase,
  updateSaleOfferConfig,
  SaleOfferConfig,
  getHomeTickerSpeed,
  updateHomeTickerSpeed,
  DEFAULT_HOME_TICKER_SPEED
} from '@/lib/cms-store';

import { createClient } from '@/lib/supabase/client';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'cutoffs' | 'docs' | 'ticker' | 'pricing' | 'offer' | 'hero'>('news');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // ── 1. News Posts State ──────────────────────────────────────────────────
  const [newsPosts, setNewsPosts] = useState<NewsItem[]>([]);
  const [newsSearch, setNewsSearch] = useState('');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const [newNews, setNewNews] = useState<{
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    author: string;
    readTime: string;
    featured: boolean;
    metaTitle: string;
    metaDescription: string;
    faqItems: { question: string; answer: string }[];
    indexes: ArticleIndexItem[];
    imageUrl?: string;
  }>({
    title: '',
    slug: '',
    category: 'Admissions',
    excerpt: '',
    content: '',
    author: 'Ahsora Team',
    readTime: '5 min read',
    featured: false,
    metaTitle: '',
    metaDescription: '',
    faqItems: [],
    indexes: [],
    imageUrl: '',
  });
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [isMetaTitleCustom, setIsMetaTitleCustom] = useState(false);
  const [isMetaDescCustom, setIsMetaDescCustom] = useState(false);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
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
  const [homeTickerSpeed, setHomeTickerSpeed] = useState<number>(() => getHomeTickerSpeed());

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
  // Portal & IMAT ticker configuration states and sub‑tab selector
  const [portalTickerConfig, setPortalTickerConfig] = useState<PortalTickerConfig | null>(null);
  const [imatTickerConfig, setImatTickerConfig] = useState<PortalTickerConfig | null>(null);
  const [tickerSubTab, setTickerSubTab] = useState<'home' | 'imat' | 'portal'>('home');
  const [newImatTickerText, setNewImatTickerText] = useState('');
  const [newImatTickerIcon, setNewImatTickerIcon] = useState('🚨');

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
    setImatTickerConfig(getImatTickerConfig());
    setPrices(getDynamicPackagePrices());
    setSaleOffer(getSaleOfferConfig());

    // Sync with Supabase asynchronously
    try {
      const [syncedNews, syncedDocs, syncedTicker, syncedPrices, syncedOffer, syncedPortalTicker, syncedImatTicker] = await Promise.all([
        syncNewsFromSupabase(),
        syncDocumentsFromSupabase(),
        syncTickerFromSupabase(),
        syncPricesFromSupabase(),
        syncSaleOfferFromSupabase(),
        syncPortalTickerFromSupabase(),
        syncImatTickerFromSupabase(),
      ]);
      setNewsPosts(syncedNews);
      setDocuments(syncedDocs);
      setTickerItems(syncedTicker);
      setPrices(syncedPrices);
      if (syncedOffer) setSaleOffer(syncedOffer);
      if (syncedPortalTicker) setPortalTickerConfig(syncedPortalTicker);
      if (syncedImatTicker) setImatTickerConfig(syncedImatTicker);
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
    setIsSlugCustom(true);
    setIsMetaTitleCustom(true);
    setIsMetaDescCustom(true);
    setNewNews({
      title: post.title,
      slug: post.slug || slugify(post.title),
      category: post.category,
      excerpt: post.excerpt,
      content: post.content || post.excerpt,
      author: post.author,
      readTime: post.readTime,
      featured: post.featured || false,
      metaTitle: post.metaTitle || post.title.slice(0, 60),
      metaDescription: post.metaDescription || post.excerpt.replace(/<[^>]*>/g, '').slice(0, 160),
      faqItems: post.faqItems || [],
      indexes: (post as any).indexes || [],
      imageUrl: post.imageUrl || '',
    });
    showToast('success', `✏️ Editing "${post.title}". Update the fields and click "Save & Update Article".`);
  };

  const handleCancelEditNews = () => {
    setEditingNewsId(null);
    setIsSlugCustom(false);
    setIsMetaTitleCustom(false);
    setIsMetaDescCustom(false);
    setNewNews({
      title: '',
      slug: '',
      category: 'Admissions',
      excerpt: '',
      content: '',
      author: 'Ahsora Team',
      readTime: '5 min read',
      featured: false,
      metaTitle: '',
      metaDescription: '',
      faqItems: [],
      indexes: [],
      imageUrl: '',
    });
  };

  // ── Table of Contents (TOC) Handlers ─────────────────────────────────────
  const handleAutoDetectToc = () => {
    const detected = parseHeadingsFromHtml(newNews.content);
    if (detected.length > 0) {
      setNewNews((prev) => ({ ...prev, indexes: detected }));
      showToast('success', `⚡ Auto-detected ${detected.length} section headings from content!`);
    } else {
      showToast('error', 'No <h2> or <h3> headings found in content. Add headings in editor or add manually.');
    }
  };

  const handleAddManualToc = () => {
    if (!customIndexTitle.trim()) {
      showToast('error', 'Please enter a section heading title for Table of Contents.');
      return;
    }
    const slug = (customIndexId.trim() || slugify(customIndexTitle)).toLowerCase();
    const newItem: ArticleIndexItem = {
      id: slug,
      title: customIndexTitle.trim(),
    };
    setNewNews((prev) => ({
      ...prev,
      indexes: [...(prev.indexes || []), newItem],
    }));
    setCustomIndexTitle('');
    setCustomIndexId('');
    showToast('success', `Added "${newItem.title}" to Table of Contents`);
  };

  const handleDeleteToc = (indexToDelete: number) => {
    setNewNews((prev) => ({
      ...prev,
      indexes: (prev.indexes || []).filter((_, i) => i !== indexToDelete),
    }));
  };

  const handleMoveToc = (index: number, direction: 'up' | 'down') => {
    const current = [...(newNews.indexes || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    setNewNews((prev) => ({ ...prev, indexes: current }));
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.excerpt) {
      showToast('error', 'Please fill in post title and summary excerpt.');
      return;
    }

    const finalSlug = (newNews.slug.trim() || slugify(newNews.title)).toLowerCase();
    const finalMetaTitle = (newNews.metaTitle.trim() || newNews.title).slice(0, 60);
    const finalMetaDesc = (newNews.metaDescription.trim() || newNews.excerpt.replace(/<[^>]*>/g, '')).slice(0, 160);
    const finalImageUrl = newNews.imageUrl?.trim() || undefined;

    if (editingNewsId) {
      const existing = newsPosts.find((p) => p.id === editingNewsId);
      const updatedPost: NewsItem = {
        id: editingNewsId,
        title: newNews.title,
        slug: finalSlug,
        category: newNews.category,
        excerpt: newNews.excerpt,
        content: newNews.content || newNews.excerpt,
        author: newNews.author,
        date: existing?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: newNews.readTime,
        featured: newNews.featured,
        imageUrl: finalImageUrl || existing?.imageUrl,
        metaTitle: finalMetaTitle,
        metaDescription: finalMetaDesc,
        faqItems: newNews.faqItems,
        indexes: newNews.indexes || [],
      };

      updateNewsPost(updatedPost);
      setNewsPosts(newsPosts.map((p) => (p.id === editingNewsId ? updatedPost : p)));
      setEditingNewsId(null);
      setIsSlugCustom(false);
      setIsMetaTitleCustom(false);
      setIsMetaDescCustom(false);
      setNewNews({
        title: '',
        slug: '',
        category: 'Admissions',
        excerpt: '',
        content: '',
        author: 'Ahsora Team',
        readTime: '5 min read',
        featured: false,
        metaTitle: '',
        metaDescription: '',
        faqItems: [],
        indexes: [],
        imageUrl: '',
      });
      showToast('success', '✅ Article, URL slug, TOC & SEO metadata updated and synced live!');
      return;
    }

    const created = addNewsPost({
      title: newNews.title,
      slug: finalSlug,
      category: newNews.category,
      excerpt: newNews.excerpt,
      content: newNews.content || newNews.excerpt,
      author: newNews.author,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: newNews.readTime,
      featured: newNews.featured,
      imageUrl: finalImageUrl,
      metaTitle: finalMetaTitle,
      metaDescription: finalMetaDesc,
      faqItems: newNews.faqItems,
      indexes: newNews.indexes || [],
    });
    setNewsPosts([created, ...newsPosts]);
    setIsSlugCustom(false);
    setIsMetaTitleCustom(false);
    setIsMetaDescCustom(false);
    setNewNews({
      title: '',
      slug: '',
      category: 'Admissions',
      excerpt: '',
      content: '',
      author: 'Ahsora Team',
      readTime: '5 min read',
      featured: false,
      metaTitle: '',
      metaDescription: '',
      faqItems: [],
      indexes: [],
      imageUrl: '',
    });
    showToast('success', '✅ News & Update published with Table of Contents & synced to public website!');
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
      target.isDiscountActive ?? true,
      target.isAvailable ?? true,
      target.disabledNotice
    );
    showToast('success', `✅ ${target.name} price, discount & availability updated across website!`);
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
          { id: 'cutoffs', label: 'IMAT Cutoff Tables (EU & Non-EU)', icon: <TableIcon size={18} /> },
          { id: 'docs', label: 'Resource Vault (Docs Only)', icon: <FileText size={18} />, badge: documents.length },
          { id: 'ticker', label: 'Moving Strips (Home, IMAT, Portal)', icon: <Zap size={18} />, badge: tickerItems.length + (imatTickerConfig?.items?.length ?? 0) + (portalTickerConfig?.items?.length ?? 0) },
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
                          {post.indexes && post.indexes.length > 0 && (
                            <span style={{ backgroundColor: '#E0E7FF', color: '#3730A3', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                              📋 {post.indexes.length} TOC Sections
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', color: '#0E7490', fontFamily: 'monospace', backgroundColor: '#ECFEFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #CFFAFE' }}>
                            🔗 /news/{post.slug}
                          </span>
                          {post.metaTitle && (
                            <span style={{ fontSize: '0.68rem', color: '#047857', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              SEO Title ✓
                            </span>
                          )}
                          {post.metaDescription && (
                            <span style={{ fontSize: '0.68rem', color: '#047857', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              SEO Desc ✓
                            </span>
                          )}
                          {post.faqItems && post.faqItems.length > 0 && (
                            <span style={{ fontSize: '0.68rem', color: '#6B21A8', backgroundColor: '#F3E8FF', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              {post.faqItems.length} FAQs ✓
                            </span>
                          )}
                          <a
                            href={`/news/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.72rem',
                              color: '#059669',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              marginLeft: 'auto',
                            }}
                          >
                            Live SSR Page <ExternalLink size={12} />
                          </a>
                        </div>
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
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Title <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IMAT 2027 Registration Guidelines Released"
                  value={newNews.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewNews((prev) => ({
                      ...prev,
                      title: val,
                      slug: isSlugCustom ? prev.slug : slugify(val),
                      metaTitle: isMetaTitleCustom ? prev.metaTitle : val.slice(0, 60),
                    }));
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* URL Slug Field (Auto-generates with manual override) */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#0F291E', margin: 0 }}>
                    🔗 URL Slug (Permlink)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const generated = slugify(newNews.title);
                      setNewNews((prev) => ({ ...prev, slug: generated }));
                      setIsSlugCustom(false);
                      showToast('success', '🔄 Slug re-generated from article title');
                    }}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#059669',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    🔄 Reset from Title
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #CBD5E1', overflow: 'hidden' }}>
                  <span style={{ padding: '0 10px', fontSize: '0.8125rem', color: '#64748B', backgroundColor: '#F1F5F9', borderRight: '1px solid #CBD5E1', fontWeight: 600, userSelect: 'none', lineHeight: '38px' }}>
                    /news/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. imat-2027-guide"
                    value={newNews.slug}
                    onChange={(e) => {
                      setIsSlugCustom(true);
                      setNewNews({ ...newNews, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') });
                    }}
                    style={{ flex: 1, padding: '10px 12px', border: 'none', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ fontSize: '0.73rem', color: '#059669', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🌐 Public URL: https://ahsorameds.com/news/{newNews.slug || slugify(newNews.title) || 'your-slug'}
                </div>
              </div>

              {/* SEO Meta Title (Limit 60 chars) */}
              <div style={{ backgroundColor: '#F0FDF4', padding: '12px 14px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#065F46', margin: 0 }}>
                    🔍 SEO Meta Title (Google Search &amp; AI Crawlers)
                  </label>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: newNews.metaTitle.length >= 58 ? '#DC2626' : newNews.metaTitle.length >= 50 ? '#D97706' : '#059669',
                    }}
                  >
                    {newNews.metaTitle.length} / 60 max characters
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={60}
                  placeholder="e.g. IMAT 2027 Registration &amp; Prep Strategy Guide | Ahsora"
                  value={newNews.metaTitle}
                  onChange={(e) => {
                    setIsMetaTitleCustom(true);
                    setNewNews({ ...newNews, metaTitle: e.target.value });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #86EFAC',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '4px' }}>
                  Optimal length: 50–60 characters. Appears as the clickable headline on Google Search and AI answer cards.
                </div>
              </div>

              {/* SEO Meta Description (Limit 160 chars) */}
              <div style={{ backgroundColor: '#F0FDF4', padding: '12px 14px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#065F46', margin: 0 }}>
                    📝 SEO Meta Description (Search Snippet &amp; GPTBot)
                  </label>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: newNews.metaDescription.length >= 155 ? '#DC2626' : newNews.metaDescription.length >= 140 ? '#D97706' : '#059669',
                    }}
                  >
                    {newNews.metaDescription.length} / 160 max characters
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={160}
                  placeholder="e.g. Official Italian MUR announcement for IMAT 2027 admissions. Complete guide to deadlines, syllabus changes, and university application steps..."
                  value={newNews.metaDescription}
                  onChange={(e) => {
                    setIsMetaDescCustom(true);
                    setNewNews({ ...newNews, metaDescription: e.target.value });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #86EFAC',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '4px' }}>
                  Optimal length: 130–160 characters. Read by search crawlers and AI bots to summarize page context.
                </div>
              </div>

              {/* Dynamic FAQ / Q&A Schema Builder (for Google FAQPage & GPTBot Schema) */}
              <div style={{ backgroundColor: '#FAF5FF', padding: '14px', borderRadius: '10px', border: '1px solid #E9D5FF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#6B21A8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ❓ Q&amp;A Section (FAQPage Schema Markup)
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#7E22CE' }}>
                      Adds rich JSON-LD FAQ schema for search engines &amp; AI answers
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#F3E8FF', color: '#6B21A8', padding: '2px 8px', borderRadius: '12px' }}>
                    {newNews.faqItems?.length || 0} FAQs
                  </span>
                </div>

                {newNews.faqItems && newNews.faqItems.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                    {newNews.faqItems.map((faq, fIdx) => (
                      <div key={fIdx} style={{ backgroundColor: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #DDD6FE', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E1B4B' }}>Q: {faq.question}</div>
                          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>A: {faq.answer}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNewNews((prev) => ({
                              ...prev,
                              faqItems: prev.faqItems.filter((_, idx) => idx !== fIdx),
                            }));
                          }}
                          style={{ color: '#EF4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, padding: '2px 4px' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #DDD6FE' }}>
                  <input
                    type="text"
                    placeholder="Question: e.g. When do IMAT 2027 applications open?"
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Answer: e.g. Pre-enrollment opens in summer with exam scheduled for September."
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newFaqQ.trim() || !newFaqA.trim()) {
                          showToast('error', 'Please enter both question and answer for FAQ.');
                          return;
                        }
                        setNewNews((prev) => ({
                          ...prev,
                          faqItems: [...(prev.faqItems || []), { question: newFaqQ.trim(), answer: newFaqA.trim() }],
                        }));
                        setNewFaqQ('');
                        setNewFaqA('');
                        showToast('success', 'FAQ item added to schema markup');
                      }}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#7C3AED',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + Add FAQ to Schema
                    </button>
                  </div>
                </div>
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

              {/* ── TABLE OF CONTENTS (TOC) ARTICLE NAVIGATION BUILDER ── */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ListOrdered size={18} color="#059669" />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>
                        Article Table of Contents (Public Index)
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        Readers click these to smoothly jump to specific headings in the article
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={handleAutoDetectToc}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        border: '1px solid #A7F3D0',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Scan <h2> and <h3> tags from article content automatically"
                    >
                      <Sparkles size={12} /> Auto-Detect from Content
                    </button>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#E2E8F0',
                        color: '#475569',
                        padding: '3px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      {newNews.indexes?.length || 0} Sections
                    </span>
                  </div>
                </div>

                {/* Existing TOC Items List */}
                {newNews.indexes && newNews.indexes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    {newNews.indexes.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#059669',
                            color: '#FFFFFF',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </span>

                        <input
                          type="text"
                          value={item.title}
                          placeholder="Heading title..."
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewNews((prev) => {
                              const updated = [...(prev.indexes || [])];
                              updated[idx] = { ...updated[idx], title: val };
                              return { ...prev, indexes: updated };
                            });
                          }}
                          style={{
                            flex: 2,
                            padding: '4px 8px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            outline: 'none',
                          }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>#</span>
                          <input
                            type="text"
                            value={item.id}
                            placeholder="anchor-slug"
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewNews((prev) => {
                                const updated = [...(prev.indexes || [])];
                                updated[idx] = { ...updated[idx], id: val };
                                return { ...prev, indexes: updated };
                              });
                            }}
                            style={{
                              width: '100%',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              fontFamily: 'monospace',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '2px' }}>
                          <button
                            type="button"
                            onClick={() => handleMoveToc(idx, 'up')}
                            disabled={idx === 0}
                            style={{
                              padding: '4px',
                              border: 'none',
                              background: 'none',
                              cursor: idx === 0 ? 'default' : 'pointer',
                              color: idx === 0 ? '#CBD5E1' : '#64748B',
                            }}
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveToc(idx, 'down')}
                            disabled={idx === (newNews.indexes?.length || 0) - 1}
                            style={{
                              padding: '4px',
                              border: 'none',
                              background: 'none',
                              cursor: idx === (newNews.indexes?.length || 0) - 1 ? 'default' : 'pointer',
                              color: idx === (newNews.indexes?.length || 0) - 1 ? '#CBD5E1' : '#64748B',
                            }}
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteToc(idx)}
                            style={{
                              padding: '4px',
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              color: '#EF4444',
                            }}
                            title="Delete TOC section"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px dashed #CBD5E1',
                      fontSize: '0.78rem',
                      color: '#94A3B8',
                      textAlign: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    No Table of Contents sections defined yet. Click "Auto-Detect from Content" or add section anchors below.
                  </div>
                )}

                {/* Manual Add Input Strip */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Section Title: e.g. 1. Official MUR Announcement"
                      value={customIndexTitle}
                      onChange={(e) => setCustomIndexTitle(e.target.value)}
                      style={{
                        flex: 2,
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.78rem',
                        outline: 'none',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Anchor Slug: mur-announcement"
                      value={customIndexId}
                      onChange={(e) => setCustomIndexId(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.74rem',
                        fontFamily: 'monospace',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddManualToc}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      + Add Section
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Cover / Banner Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://... or /images/blog-banner.jpg"
                  value={newNews.imageUrl || ''}
                  onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
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

      {/* ── TAB: IMAT CUTOFF TABLES MANAGER ───────────────────────────────── */}
      {activeTab === 'cutoffs' && (
        <div style={{ marginBottom: '40px' }}>
          <CutoffTableManager />
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
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setTickerSubTab('home')}
              style={{
                backgroundColor: tickerSubTab === 'home' ? '#059669' : '#FFFFFF',
                color: tickerSubTab === 'home' ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              🏠 Homepage Strip ({tickerItems.length})
            </button>
            <button
              onClick={() => setTickerSubTab('imat')}
              style={{
                backgroundColor: tickerSubTab === 'imat' ? '#059669' : '#FFFFFF',
                color: tickerSubTab === 'imat' ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              🎯 IMAT Page Strip ({imatTickerConfig?.items?.length ?? 0})
            </button>
            <button
              onClick={() => setTickerSubTab('portal')}
              style={{
                backgroundColor: tickerSubTab === 'portal' ? '#059669' : '#FFFFFF',
                color: tickerSubTab === 'portal' ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              🎓 Student Portal Strip ({portalTickerConfig?.items?.length ?? 0})
            </button>
          </div>
          {/* Live Preview Bar */}
          <div style={{ backgroundColor: '#0F172A', padding: '20px', borderRadius: '16px', color: '#FFFFFF', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8125rem', color: '#5CED73', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              ⚡ Live {tickerSubTab === 'home' ? 'Homepage' : tickerSubTab === 'imat' ? 'IMAT Page (Mark Your Calendar)' : 'Student Portal'} Moving Strip Preview
            </div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ display: 'inline-flex', gap: '24px' }}>
                {(tickerSubTab === 'home' ? tickerItems : tickerSubTab === 'imat' ? (imatTickerConfig?.items || []) : (portalTickerConfig?.items || [])).map((item) => (
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Homepage strip speed settings row */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} color="#059669" />
                    <label style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>Homepage Strip Scroll Speed:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        min={10} max={120}
                        value={homeTickerSpeed}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setHomeTickerSpeed(val);
                          updateHomeTickerSpeed(val);
                        }}
                        style={{ width: '75px', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 800, fontSize: '0.9rem', outline: 'none' }}
                      />
                      <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>seconds per cycle</span>
                    </div>
                  </div>
                  {/* Quick speed presets */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Presets:</span>
                    {[
                      { label: '⚡ Fast (18s)', val: 18 },
                      { label: '🏃 Normal (34s)', val: 34 },
                      { label: '🚶 Relaxed (55s)', val: 55 },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => {
                          setHomeTickerSpeed(p.val);
                          updateHomeTickerSpeed(p.val);
                          showToast('success', `✅ Speed set to ${p.val}s!`);
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: homeTickerSpeed === p.val ? '1px solid #059669' : '1px solid #E2E8F0',
                          backgroundColor: homeTickerSpeed === p.val ? '#ECFDF5' : '#F8FAFC',
                          color: homeTickerSpeed === p.val ? '#059669' : '#475569',
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} /> Instant Real-time Live Update
                </div>
              </div>

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
            </div>
          )}

          {/* ── IMAT STRIP PANEL ── */}
          {tickerSubTab === 'imat' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* IMAT strip settings row */}
              {imatTickerConfig && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={imatTickerConfig.isActive}
                      onChange={(e) => {
                        const updated = { ...imatTickerConfig, isActive: e.target.checked };
                        setImatTickerConfig(updated);
                        updateImatTickerConfig(updated);
                        showToast('success', `✅ IMAT page strip ${e.target.checked ? 'activated' : 'deactivated'} live!`);
                      }}
                    />
                    IMAT Strip Active
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Speed (seconds):</label>
                    <input
                      type="number"
                      min={10} max={120}
                      value={imatTickerConfig.speedSeconds}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated = { ...imatTickerConfig, speedSeconds: val };
                        setImatTickerConfig(updated);
                        updateImatTickerConfig(updated);
                      }}
                      onBlur={() => { updateImatTickerConfig(imatTickerConfig!); showToast('success', '✅ IMAT strip speed updated!'); }}
                      style={{ width: '70px', padding: '6px 8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700 }}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[
                        { label: '⚡ Fast (20s)', val: 20 },
                        { label: '🏃 Normal (40s)', val: 40 },
                        { label: '🚶 Relaxed (65s)', val: 65 },
                      ].map((p) => (
                        <button
                          key={p.val}
                          type="button"
                          onClick={() => {
                            const updated = { ...imatTickerConfig, speedSeconds: p.val };
                            setImatTickerConfig(updated);
                            updateImatTickerConfig(updated);
                            showToast('success', `✅ IMAT strip speed set to ${p.val}s!`);
                          }}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: imatTickerConfig.speedSeconds === p.val ? '1px solid #059669' : '1px solid #E2E8F0',
                            backgroundColor: imatTickerConfig.speedSeconds === p.val ? '#ECFDF5' : '#F8FAFC',
                            color: imatTickerConfig.speedSeconds === p.val ? '#059669' : '#475569',
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Theme:</label>
                    <select
                      value={imatTickerConfig.bgStyle}
                      onChange={(e) => {
                        const updated = { ...imatTickerConfig, bgStyle: e.target.value as any };
                        setImatTickerConfig(updated);
                        updateImatTickerConfig(updated);
                        showToast('success', '✅ IMAT strip theme updated!');
                      }}
                      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 600 }}
                    >
                      <option value="emerald">🟢 Emerald (Dark Green)</option>
                      <option value="dark">🔵 Dark (Slate Navy)</option>
                      <option value="slate">⬜ Slate (Light)</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px', alignItems: 'start' }}>
                {/* Left: IMAT Ticker Items */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                    IMAT Page Moving Strip Announcements ({imatTickerConfig?.items?.length ?? 0})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(imatTickerConfig?.items || []).map((item) => (
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
                            const updated = deleteImatTickerItem(item.id);
                            setImatTickerConfig(updated);
                            showToast('success', 'IMAT strip item removed.');
                          }}
                          style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Add IMAT Ticker Form */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} color="#059669" /> Add IMAT Page Announcement
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newImatTickerText.trim()) { showToast('error', 'Please enter ticker text.'); return; }
                      const updated = addImatTickerItem(newImatTickerText.trim(), newImatTickerIcon);
                      setImatTickerConfig(updated);
                      setNewImatTickerText('');
                      showToast('success', '✅ IMAT page moving strip updated live!');
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Icon Emoji</label>
                      <select
                        value={newImatTickerIcon}
                        onChange={(e) => setNewImatTickerIcon(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none' }}
                      >
                        <option value="🚨">🚨 Urgent Alert</option>
                        <option value="📅">📅 Official Date / Milestone</option>
                        <option value="🏆">🏆 Ranking / Result</option>
                        <option value="🏛️">🏛️ University News</option>
                        <option value="💶">💶 Fees & Scholarships</option>
                        <option value="⚡">⚡ Registration Update</option>
                        <option value="📢">📢 Public Notice</option>
                        <option value="🎓">🎓 IMAT Preparation</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Announcement Text</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Registration closes in 3 days on Universitaly.it!"
                        value={newImatTickerText}
                        onChange={(e) => setNewImatTickerText(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ backgroundColor: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Plus size={18} /> Add to IMAT Page Strip
                    </button>
                  </form>
                </div>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Speed (seconds):</label>
                    <input
                      type="number"
                      min={10} max={120}
                      value={portalTickerConfig.speedSeconds}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated = { ...portalTickerConfig, speedSeconds: val };
                        setPortalTickerConfig(updated);
                        updatePortalTickerConfig(updated);
                      }}
                      onBlur={() => { updatePortalTickerConfig(portalTickerConfig!); showToast('success', '✅ Portal strip speed updated!'); }}
                      style={{ width: '70px', padding: '6px 8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700 }}
                    />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[
                        { label: '⚡ Fast (20s)', val: 20 },
                        { label: '🏃 Normal (40s)', val: 40 },
                        { label: '🚶 Relaxed (65s)', val: 65 },
                      ].map((p) => (
                        <button
                          key={p.val}
                          type="button"
                          onClick={() => {
                            const updated = { ...portalTickerConfig, speedSeconds: p.val };
                            setPortalTickerConfig(updated);
                            updatePortalTickerConfig(updated);
                            showToast('success', `✅ Portal strip speed set to ${p.val}s!`);
                          }}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: portalTickerConfig.speedSeconds === p.val ? '1px solid #059669' : '1px solid #E2E8F0',
                            backgroundColor: portalTickerConfig.speedSeconds === p.val ? '#ECFDF5' : '#F8FAFC',
                            color: portalTickerConfig.speedSeconds === p.val ? '#059669' : '#475569',
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
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

                {/* Live Course Availability Toggle */}
                <div style={{ backgroundColor: (pkg.isAvailable ?? true) ? '#F0FFF4' : '#FEF2F2', border: (pkg.isAvailable ?? true) ? '1px solid #BBF7D0' : '1px solid #FECACA', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: (pkg.isAvailable ?? true) ? '#166534' : '#991B1B' }}>
                      Status: {(pkg.isAvailable ?? true) ? '🟢 Available (Open)' : '🔴 Disabled (Unavailable)'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: (pkg.isAvailable ?? true) ? '#15803D' : '#B91C1C' }}>
                      {(pkg.isAvailable ?? true) ? 'Students can register' : 'Marked unavailable everywhere'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !(pkg.isAvailable ?? true);
                      handlePricingChange(pkg.id, 'isAvailable', nextState);
                    }}
                    style={{
                      backgroundColor: (pkg.isAvailable ?? true) ? '#DC2626' : '#059669',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {(pkg.isAvailable ?? true) ? 'Disable Course' : 'Activate Course'}
                  </button>
                </div>

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
