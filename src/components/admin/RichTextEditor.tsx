'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Link2,
  Unlink,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code,
  Eye,
  Edit3,
  RotateCcw,
  Sparkles,
  Check,
  X,
  ExternalLink,
  Image as ImageIcon,
  Table as TableIcon,
  BarChart3,
  MousePointerClick,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write article content details here...',
  minHeight = '260px',
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'html' | 'preview'>('visual');

  // Modals state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageWidth, setImageWidth] = useState<'100%' | '75%' | '50%'>('100%');
  const [imageAlign, setImageAlign] = useState<'center' | 'left' | 'right'>('center');

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [ctaModalOpen, setCtaModalOpen] = useState(false);
  const [ctaText, setCtaText] = useState('Explore Medical Courses & Guides');
  const [ctaUrl, setCtaUrl] = useState('/courses');

  const [highlightColor, setHighlightColor] = useState('#FEF08A');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCalloutMenu, setShowCalloutMenu] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  // Sync value into contentEditable when switching or initializing
  useEffect(() => {
    if (editorRef.current && activeTab === 'visual') {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, activeTab]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (typeof window === 'undefined' || !savedSelectionRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  const execCmd = (command: string, arg: string | undefined = undefined) => {
    if (activeTab !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    document.execCommand(command, false, arg);
    handleInput();
    saveSelection();
  };

  const insertHtmlAtCursor = (html: string) => {
    if (activeTab !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    document.execCommand('insertHTML', false, html);
    handleInput();
    saveSelection();
  };

  // ── Highlight Helpers ────────────────────────────────────────────────────────
  const applyHighlight = (color: string) => {
    if (activeTab !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      const sample = `<mark style="background-color: ${color}; color: #0F172A; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Highlighted text</mark>&nbsp;`;
      document.execCommand('insertHTML', false, sample);
    } else {
      const selectedHtml = sel.toString();
      const highlighted = `<mark style="background-color: ${color}; color: #0F172A; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${selectedHtml}</mark>`;
      document.execCommand('insertHTML', false, highlighted);
    }
    setShowColorPicker(false);
    handleInput();
    saveSelection();
  };

  const removeHighlight = () => {
    if (activeTab !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      const text = sel.toString();
      document.execCommand('insertHTML', false, text);
      handleInput();
      saveSelection();
    }
  };

  // ── Link Insertion ──────────────────────────────────────────────────────────
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    const text = sel ? sel.toString() : '';
    setLinkText(text);
    setLinkUrl('');
    setLinkModalOpen(true);
  };

  const applyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;

    restoreSelection();
    const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const displayText = linkText.trim() || linkUrl;
    const formattedUrl = linkUrl.startsWith('http') || linkUrl.startsWith('/') || linkUrl.startsWith('#')
      ? linkUrl
      : `https://${linkUrl}`;

    const linkHtml = `<a href="${formattedUrl}"${targetAttr} style="color: #059669; font-weight: 700; text-decoration: underline;">${displayText}</a>&nbsp;`;

    insertHtmlAtCursor(linkHtml);
    setLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  // ── Image Insertion ─────────────────────────────────────────────────────────
  const openImageModal = () => {
    saveSelection();
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setImageModalOpen(true);
  };

  const applyImage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!imageUrl) return;

    const altText = imageAlt || 'Ahsora Meds Academy Education Article Image';
    const captionHtml = imageCaption
      ? `<figcaption style="font-size: 0.85rem; color: #64748B; margin-top: 8px; font-style: italic; text-align: center;">${imageCaption}</figcaption>`
      : '';

    let marginStyle = '24px auto';
    if (imageAlign === 'left') marginStyle = '24px 24px 24px 0';
    if (imageAlign === 'right') marginStyle = '24px 0 24px 24px';

    const figureHtml = `
      <figure style="margin: 28px 0; text-align: ${imageAlign};">
        <img src="${imageUrl}" alt="${altText}" style="max-width: ${imageWidth}; width: 100%; border-radius: 14px; box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.1); display: block; margin: ${marginStyle}; object-fit: cover;" />
        ${captionHtml}
      </figure>
      <p><br></p>
    `;

    insertHtmlAtCursor(figureHtml);
    setImageModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
        setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Table Insertion ─────────────────────────────────────────────────────────
  const openTableModal = () => {
    saveSelection();
    setTableModalOpen(true);
  };

  const insertCustomTable = () => {
    const rows = Math.max(2, Math.min(12, tableRows));
    const cols = Math.max(2, Math.min(8, tableCols));

    let thead = '<tr>';
    for (let c = 1; c <= cols; c++) {
      thead += `<th style="background: #0F172A; color: #FFFFFF; padding: 12px 16px; font-weight: 700; font-size: 0.875rem; border: 1px solid #1E293B;">Header ${c}</th>`;
    }
    thead += '</tr>';

    let tbody = '';
    for (let r = 1; r <= rows; r++) {
      tbody += `<tr style="background-color: ${r % 2 === 0 ? '#F8FAFC' : '#FFFFFF'};">`;
      for (let c = 1; c <= cols; c++) {
        tbody += `<td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #334155;">Row ${r}, Col ${c}</td>`;
      }
      tbody += '</tr>';
    }

    const tableHtml = `
      <div class="table-responsive" style="overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid #E2E8F0;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.925rem;">
          <thead>${thead}</thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>
      <p><br></p>
    `;

    insertHtmlAtCursor(tableHtml);
    setTableModalOpen(false);
  };

  const insertTableTemplate = (type: 'cutoffs' | 'deadlines' | 'scholarships') => {
    let tableHtml = '';

    if (type === 'cutoffs') {
      tableHtml = `
        <div class="table-responsive" style="overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid #E2E8F0;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.925rem;">
            <thead>
              <tr style="background: #0F172A; color: #FFFFFF;">
                <th style="padding: 12px 16px; font-weight: 700;">Italian Medical University</th>
                <th style="padding: 12px 16px; font-weight: 700;">2026/27 IMAT Cutoff</th>
                <th style="padding: 12px 16px; font-weight: 700;">Non-EU Seats</th>
                <th style="padding: 12px 16px; font-weight: 700;">Competition Ratio</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #FFFFFF;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">University of Milan (La Statale)</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #059669; font-weight: 800;">64.2 / 90</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">25 Seats</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">High (1:14)</td></tr>
              <tr style="background-color: #F8FAFC;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">University of Bologna</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #059669; font-weight: 800;">62.8 / 90</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">30 Seats</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">High (1:12)</td></tr>
              <tr style="background-color: #FFFFFF;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">University of Pavia (Harvey)</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #059669; font-weight: 800;">59.6 / 90</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">40 Seats</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Moderate (1:8)</td></tr>
              <tr style="background-color: #F8FAFC;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">Rome La Sapienza</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #059669; font-weight: 800;">58.4 / 90</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">45 Seats</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Moderate (1:7)</td></tr>
              <tr style="background-color: #FFFFFF;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">Naples Luigi Vanvitelli</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #059669; font-weight: 800;">51.5 / 90</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">50 Seats</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Accessible (1:4)</td></tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `;
    } else if (type === 'deadlines') {
      tableHtml = `
        <div class="table-responsive" style="overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid #E2E8F0;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.925rem;">
            <thead>
              <tr style="background: #0F172A; color: #FFFFFF;">
                <th style="padding: 12px 16px; font-weight: 700;">Milestone</th>
                <th style="padding: 12px 16px; font-weight: 700;">Authority / Portal</th>
                <th style="padding: 12px 16px; font-weight: 700;">Estimated Deadline</th>
                <th style="padding: 12px 16px; font-weight: 700;">Action Required</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #FFFFFF;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700;">Universitaly Pre-Enrollment</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Universitaly.it</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Mid July</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #16A34A; font-weight: 700;">Mandatory Form A</td></tr>
              <tr style="background-color: #F8FAFC;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700;">CIMEA / DOV Verification</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">CIMEA Diplome</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Early August</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Apostille & Translation</td></tr>
              <tr style="background-color: #FFFFFF;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700;">Official IMAT Registration</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">MUR / CINECA</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Late August</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #2563EB; font-weight: 700;">Book Test Centre</td></tr>
              <tr style="background-color: #F8FAFC;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700;">National Student Visa (Type D)</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Italian Embassy / VFS</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">September – October</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Submit Bank Guarantee</td></tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `;
    } else {
      tableHtml = `
        <div class="table-responsive" style="overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid #E2E8F0;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.925rem;">
            <thead>
              <tr style="background: #0F172A; color: #FFFFFF;">
                <th style="padding: 12px 16px; font-weight: 700;">Regional Scholarship Agency</th>
                <th style="padding: 12px 16px; font-weight: 700;">Maximum Annual Cash Grant</th>
                <th style="padding: 12px 16px; font-weight: 700;">Canteen Meals</th>
                <th style="padding: 12px 16px; font-weight: 700;">Dorm Accommodation</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #FFFFFF;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700;">DSU Toscana (Florence / Pisa / Siena)</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #059669; font-weight: 800;">€7,250 / year</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">2 Free Daily Meals</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Free Student Dorm or Cash Subsidy</td></tr>
              <tr style="background-color: #F8FAFC;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700;">LazioDiSCo (Rome La Sapienza / Tor Vergata)</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #059669; font-weight: 800;">€7,150 / year</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Free Mensa Access</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">University Residence</td></tr>
              <tr style="background-color: #FFFFFF;"><td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: 700;">ER.GO (Bologna / Parma / Ferrara)</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #059669; font-weight: 800;">€6,800 / year</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Discounted Meal Card</td><td style="padding: 12px 16px; border: 1px solid #E2E8F0;">Campus Room Assigned by Merit</td></tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `;
    }

    insertHtmlAtCursor(tableHtml);
    setTableModalOpen(false);
  };

  // ── Visual Chart / Graphs ───────────────────────────────────────────────────
  const insertChart = (type: 'bars' | 'stats' | 'comparison') => {
    let chartHtml = '';

    if (type === 'bars') {
      chartHtml = `
        <div class="blog-chart-container" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; margin: 28px 0; box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);">
          <div style="font-weight: 800; font-size: 1.05rem; color: #0F172A; margin-bottom: 4px;">📊 IMAT Section High-Yield Weighting Breakdown</div>
          <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 20px;">Target scores required to hit 60+ points across all 4 examination sections.</p>
          
          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 700; color: #1E293B; margin-bottom: 6px;">
              <span>Biology (23 Questions — 34.5 pts max)</span>
              <span style="color: #059669;">85% High-Yield Target</span>
            </div>
            <div style="height: 12px; background: #F1F5F9; border-radius: 9999px; overflow: hidden;">
              <div style="width: 85%; height: 100%; border-radius: 9999px; background: linear-gradient(90deg, #059669 0%, #10B981 100%);"></div>
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 700; color: #1E293B; margin-bottom: 6px;">
              <span>Chemistry (15 Questions — 22.5 pts max)</span>
              <span style="color: #0284C7;">75% High-Yield Target</span>
            </div>
            <div style="height: 12px; background: #F1F5F9; border-radius: 9999px; overflow: hidden;">
              <div style="width: 75%; height: 100%; border-radius: 9999px; background: linear-gradient(90deg, #0284C7 0%, #38BDF8 100%);"></div>
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 700; color: #1E293B; margin-bottom: 6px;">
              <span>Physics & Mathematics (13 Questions — 19.5 pts max)</span>
              <span style="color: #D97706;">65% High-Yield Target</span>
            </div>
            <div style="height: 12px; background: #F1F5F9; border-radius: 9999px; overflow: hidden;">
              <div style="width: 65%; height: 100%; border-radius: 9999px; background: linear-gradient(90deg, #D97706 0%, #FBBF24 100%);"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 700; color: #1E293B; margin-bottom: 6px;">
              <span>Logical Reasoning & General Knowledge (9 Questions — 13.5 pts max)</span>
              <span style="color: #7C3AED;">70% Target Accuracy</span>
            </div>
            <div style="height: 12px; background: #F1F5F9; border-radius: 9999px; overflow: hidden;">
              <div style="width: 70%; height: 100%; border-radius: 9999px; background: linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%);"></div>
            </div>
          </div>
        </div>
        <p><br></p>
      `;
    } else if (type === 'stats') {
      chartHtml = `
        <div class="blog-stat-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 28px 0;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 22px; text-align: center;">
            <div style="font-size: 2.2rem; font-weight: 900; color: #059669; line-height: 1.1; margin-bottom: 6px;">16+</div>
            <div style="font-size: 0.8125rem; font-weight: 800; color: #1E293B; text-transform: uppercase;">Public English MD Programs</div>
            <div style="font-size: 0.78rem; color: #64748B; margin-top: 4px;">Taught 100% in English across Italy</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 22px; text-align: center;">
            <div style="font-size: 2.2rem; font-weight: 900; color: #0284C7; line-height: 1.1; margin-bottom: 6px;">€156</div>
            <div style="font-size: 0.8125rem; font-weight: 800; color: #1E293B; text-transform: uppercase;">Base Regional Annual Fee</div>
            <div style="font-size: 0.78rem; color: #64748B; margin-top: 4px;">With eligible DSU scholarship coverage</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 22px; text-align: center;">
            <div style="font-size: 2.2rem; font-weight: 900; color: #7C3AED; line-height: 1.1; margin-bottom: 6px;">60+</div>
            <div style="font-size: 0.8125rem; font-weight: 800; color: #1E293B; text-transform: uppercase;">Target Competitive IMAT Score</div>
            <div style="font-size: 0.78rem; color: #64748B; margin-top: 4px;">Secures Milan, Bologna, or Pavia</div>
          </div>
        </div>
        <p><br></p>
      `;
    } else {
      chartHtml = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin: 28px 0;">
          <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 16px; padding: 22px;">
            <div style="display: inline-block; background: #059669; color: #FFFFFF; font-size: 0.75rem; font-weight: 800; padding: 3px 10px; borderRadius: 20px; margin-bottom: 10px;">
              PUBLIC MEDICAL UNIVERSITIES
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #064E3B; margin: 0 0 10px 0;">The IMAT Route</h4>
            <ul style="padding-left: 20px; margin: 0; color: #065F46; font-size: 0.875rem; line-height: 1.7;">
              <li><strong>Ultra-Low Tuition:</strong> €156 to €2,500/year based on family ISEE income.</li>
              <li><strong>Government Financial Aid:</strong> Regional scholarships up to €7,250/year.</li>
              <li><strong>Single Exam:</strong> Universal IMAT exam held every September.</li>
              <li><strong>Institutions:</strong> Milan, Bologna, Pavia, Rome Sapienza, Vanvitelli.</li>
            </ul>
          </div>

          <div style="background: #EFF6FF; border: 1.5px solid #93C5FD; border-radius: 16px; padding: 22px;">
            <div style="display: inline-block; background: #2563EB; color: #FFFFFF; font-size: 0.75rem; font-weight: 800; padding: 3px 10px; borderRadius: 20px; margin-bottom: 10px;">
              PRIVATE MEDICAL UNIVERSITIES
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #1E3A8A; margin: 0 0 10px 0;">Private University Route</h4>
            <ul style="padding-left: 20px; margin: 0; color: #1E40AF; font-size: 0.875rem; line-height: 1.7;">
              <li><strong>Higher Tuition:</strong> €15,000 to €22,000/year.</li>
              <li><strong>Earlier Timelines:</strong> Admissions tests held in February & March.</li>
              <li><strong>Independent Tests:</strong> HUMAT (Humanitas) or Cattolica Entry Test.</li>
              <li><strong>Institutions:</strong> Humanitas, San Raffaele, Cattolica, UniCamillus.</li>
            </ul>
          </div>
        </div>
        <p><br></p>
      `;
    }

    insertHtmlAtCursor(chartHtml);
    setChartModalOpen(false);
  };

  // ── Callout Inserter ────────────────────────────────────────────────────────
  const insertCalloutType = (type: 'tip' | 'warning' | 'info' | 'alert') => {
    let calloutHtml = '';
    if (type === 'tip') {
      calloutHtml = `
        <div class="blog-callout tip" style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 18px 22px; margin: 24px 0; display: flex; gap: 14px; align-items: flex-start;">
          <span style="font-size: 1.35rem; flex-shrink: 0;">💡</span>
          <div style="font-size: 0.95rem; color: #065F46; line-height: 1.65;">
            <strong style="color: #047857; font-size: 1rem;">High-Yield Pro Tip:</strong> Never blind guess on IMAT questions. Each incorrect answer incurs a -0.4 mark penalty, while a blank answer awards 0 points.
          </div>
        </div>
        <p><br></p>
      `;
    } else if (type === 'warning') {
      calloutHtml = `
        <div class="blog-callout warning" style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 18px 22px; margin: 24px 0; display: flex; gap: 14px; align-items: flex-start;">
          <span style="font-size: 1.35rem; flex-shrink: 0;">⚠️</span>
          <div style="font-size: 0.95rem; color: #92400E; line-height: 1.65;">
            <strong style="color: #B45309; font-size: 1rem;">Crucial Warning:</strong> Non-EU international candidates are strictly permitted to pre-enroll at ONLY ONE public Italian medical university per academic year.
          </div>
        </div>
        <p><br></p>
      `;
    } else if (type === 'info') {
      calloutHtml = `
        <div class="blog-callout info" style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 18px 22px; margin: 24px 0; display: flex; gap: 14px; align-items: flex-start;">
          <span style="font-size: 1.35rem; flex-shrink: 0;">ℹ️</span>
          <div style="font-size: 0.95rem; color: #075985; line-height: 1.65;">
            <strong style="color: #0284C7; font-size: 1rem;">Official Requirement:</strong> You must request a Declaration of Value (DOV) from the Italian Embassy or an official Statement of Comparability from CIMEA.
          </div>
        </div>
        <p><br></p>
      `;
    } else {
      calloutHtml = `
        <div class="blog-callout alert" style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 18px 22px; margin: 24px 0; display: flex; gap: 14px; align-items: flex-start;">
          <span style="font-size: 1.35rem; flex-shrink: 0;">🚨</span>
          <div style="font-size: 0.95rem; color: #991B1B; line-height: 1.65;">
            <strong style="color: #DC2626; font-size: 1rem;">Urgent Deadline Notice:</strong> Missing the Universitaly pre-enrollment deadline will disqualify non-EU candidates from sitting the examination.
          </div>
        </div>
        <p><br></p>
      `;
    }

    insertHtmlAtCursor(calloutHtml);
    setShowCalloutMenu(false);
  };

  // ── Call-To-Action (CTA) Inserter ───────────────────────────────────────────
  const insertCtaButton = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctaText) return;

    const formattedUrl = ctaUrl.startsWith('http') || ctaUrl.startsWith('/') ? ctaUrl : `https://${ctaUrl}`;
    const ctaHtml = `
      <div class="blog-cta-wrapper" style="text-align: center; margin: 32px 0;">
        <a href="${formattedUrl}" class="blog-cta-btn" style="display: inline-flex; align-items: center; gap: 8px; background: #059669; color: #FFFFFF !important; text-decoration: none !important; font-size: 1.05rem; font-weight: 800; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(5, 150, 105, 0.35);">
          <span>${ctaText}</span>
          <span>→</span>
        </a>
      </div>
      <p><br></p>
    `;

    insertHtmlAtCursor(ctaHtml);
    setCtaModalOpen(false);
  };

  // Keyboard shortcut listener
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        execCmd('bold');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        execCmd('italic');
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        execCmd('underline');
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        openLinkModal();
      }
    }
  };

  const colors = [
    { hex: '#FEF08A', name: 'Yellow', border: '#FACC15' },
    { hex: '#BBF7D0', name: 'Emerald', border: '#4ADE80' },
    { hex: '#BAE6FD', name: 'Sky Blue', border: '#38BDF8' },
    { hex: '#FECDD3', name: 'Pink Rose', border: '#FB7185' },
    { hex: '#E9D5FF', name: 'Purple', border: '#C084FC' },
    { hex: '#FED7AA', name: 'Amber', border: '#FB923C' },
  ];

  return (
    <div
      style={{
        border: '1px solid #CBD5E1',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Top Toolbar Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {/* Editor Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('bold')}
            title="Bold (Ctrl+B)"
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              color: '#0F172A',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 800,
              fontSize: '0.8125rem',
            }}
          >
            <Bold size={15} />
            <span>Bold</span>
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('italic')}
            title="Italic (Ctrl+I)"
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Italic size={15} />
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('underline')}
            title="Underline (Ctrl+U)"
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Underline size={15} />
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: '#CBD5E1', margin: '0 4px' }} />

          {/* Highlight Dropdown / Button */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', borderRadius: '6px', border: '1px solid #F59E0B', overflow: 'hidden' }}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHighlight(highlightColor)}
                title="Highlight selected text"
                style={{
                  padding: '6px 10px',
                  border: 'none',
                  backgroundColor: '#FEF3C7',
                  cursor: 'pointer',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                }}
              >
                <Highlighter size={15} color="#D97706" />
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: highlightColor,
                    border: '1px solid rgba(0,0,0,0.2)',
                  }}
                />
                <span>Highlight</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Choose highlight color"
                style={{
                  padding: '6px 6px',
                  border: 'none',
                  borderLeft: '1px solid #FCD34D',
                  backgroundColor: '#FEF3C7',
                  cursor: 'pointer',
                  color: '#92400E',
                  fontSize: '0.7rem',
                }}
              >
                ▼
              </button>
            </div>

            {showColorPicker && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                  border: '1px solid #CBD5E1',
                  padding: '10px',
                  zIndex: 30,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: '180px',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                  Pick Highlight Color
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setHighlightColor(c.hex);
                        applyHighlight(c.hex);
                      }}
                      title={c.name}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: c.hex,
                        border: `2px solid ${c.border}`,
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    removeHighlight();
                    setShowColorPicker(false);
                  }}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  Clear Highlight
                </button>
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '20px', backgroundColor: '#CBD5E1', margin: '0 4px' }} />

          {/* Add Link */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={openLinkModal}
            title="Add Link (Ctrl+K)"
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #059669',
              backgroundColor: '#ECFDF5',
              cursor: 'pointer',
              color: '#065F46',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8125rem',
              fontWeight: 800,
            }}
          >
            <Link2 size={15} color="#059669" />
            <span>Link</span>
          </button>

          {/* Headings */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('formatBlock', '<h2>')}
            title="Heading 2"
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              color: '#334155',
            }}
          >
            <Heading2 size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('formatBlock', '<h3>')}
            title="Heading 3"
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              color: '#334155',
            }}
          >
            <Heading3 size={15} />
          </button>

          {/* Bullet List */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('insertUnorderedList')}
            title="Bullet List"
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              color: '#334155',
            }}
          >
            <List size={15} />
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: '#CBD5E1', margin: '0 4px' }} />

          {/* ── NEW FEATURE 1: ADD IMAGE ── */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={openImageModal}
            title="Insert Picture / Photo with caption"
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #0284C7',
              backgroundColor: '#F0F9FF',
              cursor: 'pointer',
              color: '#0369A1',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8125rem',
              fontWeight: 800,
            }}
          >
            <ImageIcon size={15} color="#0284C7" />
            <span>+ Image</span>
          </button>

          {/* ── NEW FEATURE 2: ADD TABLE ── */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={openTableModal}
            title="Insert Data Table (Cutoffs, Dates, Fees)"
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #7C3AED',
              backgroundColor: '#F5F3FF',
              cursor: 'pointer',
              color: '#6D28D9',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8125rem',
              fontWeight: 800,
            }}
          >
            <TableIcon size={15} color="#7C3AED" />
            <span>+ Table</span>
          </button>

          {/* ── NEW FEATURE 3: ADD GRAPHS & CHARTS ── */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setChartModalOpen(true)}
            title="Insert Visual Graph / Comparison Card"
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #EA580C',
              backgroundColor: '#FFF7ED',
              cursor: 'pointer',
              color: '#C2410C',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8125rem',
              fontWeight: 800,
            }}
          >
            <BarChart3 size={15} color="#EA580C" />
            <span>+ Graph / Chart</span>
          </button>

          {/* ── NEW FEATURE 4: CALLOUT DROPDOWN ── */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowCalloutMenu(!showCalloutMenu)}
              title="Insert Callout or Alert Box"
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #A7F3D0',
                backgroundColor: '#ECFDF5',
                cursor: 'pointer',
                color: '#047857',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8125rem',
                fontWeight: 700,
              }}
            >
              <Sparkles size={14} color="#059669" />
              <span>Callout</span>
              <span style={{ fontSize: '0.65rem' }}>▼</span>
            </button>

            {showCalloutMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                  border: '1px solid #CBD5E1',
                  padding: '6px',
                  zIndex: 35,
                  minWidth: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <button
                  type="button"
                  onClick={() => insertCalloutType('tip')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>💡</span> <span>Pro Tip Box (Green)</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertCalloutType('warning')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#FFFBEB',
                    color: '#92400E',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>⚠️</span> <span>Warning Box (Amber)</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertCalloutType('info')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#F0F9FF',
                    color: '#0369A1',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>ℹ️</span> <span>Official Notice (Sky)</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertCalloutType('alert')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#FEF2F2',
                    color: '#991B1B',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>🚨</span> <span>Urgent Deadline (Red)</span>
                </button>
              </div>
            )}
          </div>

          {/* ── NEW FEATURE 5: CTA BUTTON ── */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setCtaModalOpen(true)}
            title="Insert Call-To-Action Button for Readers"
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #059669',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8125rem',
              fontWeight: 800,
            }}
          >
            <MousePointerClick size={14} />
            <span>+ CTA Button</span>
          </button>
        </div>

        {/* View Modes (Visual / HTML / Preview) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#E2E8F0', padding: '2px', borderRadius: '8px' }}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setActiveTab('visual')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'visual' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'visual' ? '#0F172A' : '#64748B',
              boxShadow: activeTab === 'visual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Edit3 size={13} />
            <span>Visual</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setActiveTab('html')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'html' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'html' ? '#0F172A' : '#64748B',
              boxShadow: activeTab === 'html' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Code size={13} />
            <span>HTML</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'preview' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'preview' ? '#0F172A' : '#64748B',
              boxShadow: activeTab === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* ── Visual Editor Area ── */}
      {activeTab === 'visual' && (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          onKeyDown={handleKeyDown}
          onSelect={saveSelection}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          data-placeholder={placeholder}
          style={{
            minHeight,
            maxHeight: '520px',
            overflowY: 'auto',
            padding: '16px 20px',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: '#1E293B',
            outline: 'none',
            backgroundColor: '#FFFFFF',
          }}
          className="ahsora-rich-editable prose-article"
        />
      )}

      {/* ── Raw HTML Editor Area ── */}
      {activeTab === 'html' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Edit raw HTML markup..."
          style={{
            width: '100%',
            minHeight,
            maxHeight: '520px',
            padding: '16px 20px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '0.84rem',
            lineHeight: 1.6,
            color: '#0F172A',
            border: 'none',
            outline: 'none',
            backgroundColor: '#F8FAFC',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      )}

      {/* ── Live Preview Area ── */}
      {activeTab === 'preview' && (
        <div
          style={{
            minHeight,
            maxHeight: '520px',
            overflowY: 'auto',
            padding: '24px 28px',
            backgroundColor: '#FAFAF9',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ Live Article Reader Preview
          </div>
          <div
            className="prose-article rich-article-content"
            style={{ fontSize: '1rem', lineHeight: 1.85, color: '#334155' }}
            dangerouslySetInnerHTML={{ __html: value || '<em style="color:#94A3B8;">No content written yet. Click Visual to write your blog post.</em>' }}
          />
        </div>
      )}

      {/* ── MODAL 1: ADD IMAGE MODAL ── */}
      {imageModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setImageModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                <ImageIcon size={20} color="#0284C7" />
                <span>Insert Article Image</span>
              </div>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={applyImage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Image Web URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/banner.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Upload from Computer */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Or Upload Image from Computer
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px dashed #0284C7',
                    backgroundColor: '#F0F9FF',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Quick High-Quality Medical Presets */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Or Choose from Verified Medical Presets
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { label: '🏛️ Italian University Campus', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80', caption: 'Historic campus of University of Bologna' },
                    { label: '🩺 Medical Stethoscope & Notes', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80', caption: 'Clinical medicine prep materials and examination stethoscope' },
                    { label: '🔬 Research Laboratory & Science', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&auto=format&fit=crop&q=80', caption: 'Biomedical laboratory research and histology study' },
                    { label: '📚 Students Medical Study Group', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80', caption: 'International medical candidates working on IMAT problem sets' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(p.url);
                        setImageCaption(p.caption);
                        setImageAlt(p.label);
                      }}
                      style={{
                        padding: '8px 10px',
                        border: imageUrl === p.url ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                        backgroundColor: imageUrl === p.url ? '#F0F9FF' : '#F8FAFC',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: imageUrl === p.url ? '#0369A1' : '#334155',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Caption Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Photo caption under image..."
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8125rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Image Width
                  </label>
                  <select
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8125rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="100%">Full Width (100%)</option>
                    <option value="75%">Medium (75%)</option>
                    <option value="50%">Compact (50%)</option>
                  </select>
                </div>
              </div>

              {/* Preview image thumbnail */}
              {imageUrl && (
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <img src={imageUrl} alt="preview" style={{ maxHeight: '140px', borderRadius: '6px', maxWidth: '100%' }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!imageUrl}
                  onClick={() => applyImage()}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: imageUrl ? '#0284C7' : '#94A3B8',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: imageUrl ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={16} /> Insert Image into Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ADD TABLE MODAL ── */}
      {tableModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setTableModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                <TableIcon size={20} color="#7C3AED" />
                <span>Insert Formatted Table</span>
              </div>
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Ready-made High-Yield Templates */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', marginBottom: '8px' }}>
                ⚡ 1-Click Medical Blog Templates
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => insertTableTemplate('cutoffs')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #DDD6FE',
                    backgroundColor: '#F5F3FF',
                    color: '#5B21B6',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>📊 IMAT Cutoff Scores Comparison Table</span>
                  <span style={{ fontSize: '0.75rem', color: '#7C3AED' }}>Insert →</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertTableTemplate('deadlines')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    color: '#1E293B',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>📅 Admissions & Pre-Enrollment Deadlines</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Insert →</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertTableTemplate('scholarships')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    color: '#1E293B',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>💰 Regional Italian Scholarships (DSU/Lazio/ER.GO)</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Insert →</span>
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Or Create Custom Grid Table
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Rows Count
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={12}
                    value={tableRows}
                    onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Columns Count
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={tableCols}
                    onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setTableModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertCustomTable}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Insert Custom Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ADD GRAPHS & VISUAL CHARTS MODAL ── */}
      {chartModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setChartModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                <BarChart3 size={20} color="#EA580C" />
                <span>Insert Visual Graph &amp; Comparison Card</span>
              </div>
              <button
                type="button"
                onClick={() => setChartModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '18px' }}>
              Choose a responsive visual element to break up long text and increase reader engagement:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Option 1: Horizontal Bar Chart */}
              <div
                onClick={() => insertChart('bars')}
                style={{
                  border: '1.5px solid #FED7AA',
                  backgroundColor: '#FFF7ED',
                  padding: '16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: '#C2410C', fontSize: '0.95rem' }}>📊 High-Yield Bar Progress Chart</strong>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EA580C' }}>Insert +</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#7C2D12', margin: 0 }}>
                  Animated progress bars displaying score percentages across Biology, Chemistry, Physics &amp; Logic.
                </p>
              </div>

              {/* Option 2: 3-Column Key Metric Stat Cards */}
              <div
                onClick={() => insertChart('stats')}
                style={{
                  border: '1.5px solid #BAE6FD',
                  backgroundColor: '#F0F9FF',
                  padding: '16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: '#0369A1', fontSize: '0.95rem' }}>🔢 3-Column Key Metric Numbers Grid</strong>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284C7' }}>Insert +</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#075985', margin: 0 }}>
                  Three large bold metric cards (e.g. "16+ English MD Programs", "€156 Annual Fee", "60+ Cutoff").
                </p>
              </div>

              {/* Option 3: Side-by-side Comparison Grid */}
              <div
                onClick={() => insertChart('comparison')}
                style={{
                  border: '1.5px solid #BBF7D0',
                  backgroundColor: '#F0FDF4',
                  padding: '16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: '#15803D', fontSize: '0.95rem' }}>⚖️ Public vs. Private Medical Comparison Cards</strong>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669' }}>Insert +</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#166534', margin: 0 }}>
                  Two side-by-side feature comparison columns with checkmark bullets and badge highlights.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setChartModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: ADD CTA BUTTON MODAL ── */}
      {ctaModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setCtaModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                <MousePointerClick size={20} color="#059669" />
                <span>Insert Call-to-Action (CTA) Button</span>
              </div>
              <button
                type="button"
                onClick={() => setCtaModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={insertCtaButton} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Button Text / Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enroll in IMAT Masterclass or Check Cutoffs"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Destination URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /courses or /universities or https://..."
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCtaModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Insert CTA Button
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Link Insertion Modal ── */}
      {linkModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setLinkModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
                <Link2 size={18} color="#059669" />
                <span>Insert Web or Page Link</span>
              </div>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={applyLink} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Target Web URL
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. https://universitaly.it or /courses"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Link Display Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Official Italian Portal"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                />
                Open link in a new browser tab (recommended)
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={16} /> Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Footer status bar ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          fontSize: '0.75rem',
          color: '#64748B',
        }}
      >
        <span>
          ✨ Insert <strong>Images</strong>, <strong>Data Tables</strong>, <strong>Comparison Graphs</strong>, <strong>Callouts</strong>, and <strong>CTA Buttons</strong>
        </span>
        <span>
          {value ? `${value.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words` : '0 words'}
        </span>
      </div>

      <style jsx global>{`
        .ahsora-rich-editable:empty:before {
          content: attr(data-placeholder);
          color: #94A3B8;
          pointer-events: none;
        }
        .ahsora-rich-editable h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0F172A;
          margin: 14px 0 8px;
        }
        .ahsora-rich-editable h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0F172A;
          margin: 12px 0 6px;
        }
        .ahsora-rich-editable ul {
          padding-left: 24px;
          margin: 8px 0;
          list-style-type: disc;
        }
        .ahsora-rich-editable ol {
          padding-left: 24px;
          margin: 8px 0;
          list-style-type: decimal;
        }
        .ahsora-rich-editable a {
          color: #059669;
          font-weight: 700;
          text-decoration: underline;
        }
        .ahsora-rich-editable mark {
          border-radius: 4px;
          padding: 2px 6px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
