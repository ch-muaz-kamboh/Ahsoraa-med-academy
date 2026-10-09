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
  minHeight = '240px',
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'html' | 'preview'>('visual');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);
  const [highlightColor, setHighlightColor] = useState('#FEF08A'); // Warm yellow default
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  // Custom formatting helpers
  const applyHighlight = (color: string) => {
    if (activeTab !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      // If nothing selected, insert a sample highlighted span
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

    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('insertHTML', false, linkHtml);
    handleInput();
    setLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  const removeLink = () => {
    execCmd('unlink');
  };

  const insertQuote = () => {
    saveSelection();
    const sel = window.getSelection();
    const text = sel && !sel.isCollapsed ? sel.toString() : 'Important note or quote here...';
    const quoteHtml = `<blockquote style="border-left: 4px solid #059669; background: #F8FAFC; padding: 12px 16px; margin: 12px 0; border-radius: 0 8px 8px 0; font-style: italic; color: #334155;">${text}</blockquote><p><br></p>`;
    document.execCommand('insertHTML', false, quoteHtml);
    handleInput();
  };

  const insertCallout = () => {
    saveSelection();
    const calloutHtml = `
      <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 14px 18px; margin: 16px 0; display: flex; gap: 12px; align-items: flex-start;">
        <span style="font-size: 1.25rem;">💡</span>
        <div style="font-size: 0.9375rem; color: #065F46; line-height: 1.6;">
          <strong style="color: #047857;">Pro Tip:</strong> Enter actionable advice or announcement notice here.
        </div>
      </div>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, calloutHtml);
    handleInput();
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
      {/* ── Mode Switcher & Top Toolbar Header ── */}
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
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
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
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
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
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
                  display: 'flex',
                  alignItems: 'center',
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
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
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
                    textAlign: 'center',
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D1FAE5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ECFDF5')}
          >
            <Link2 size={15} color="#059669" />
            <span>Add Link</span>
          </button>

          {/* Remove Link */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={removeLink}
            title="Remove Link"
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <Unlink size={15} />
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: '#CBD5E1', margin: '0 4px' }} />

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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <Heading3 size={15} />
          </button>

          {/* Lists */}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <List size={15} />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCmd('insertOrderedList')}
            title="Numbered List"
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <ListOrdered size={15} />
          </button>

          {/* Quote */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertQuote}
            title="Insert Blockquote"
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <Quote size={15} />
          </button>

          {/* Callout */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertCallout}
            title="Insert Pro Tip / Alert Callout"
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid #A7F3D0',
              backgroundColor: '#ECFDF5',
              cursor: 'pointer',
              color: '#047857',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <Sparkles size={13} />
            <span>Callout Box</span>
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
            maxHeight: '480px',
            overflowY: 'auto',
            padding: '14px 16px',
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: '#1E293B',
            outline: 'none',
            backgroundColor: '#FFFFFF',
          }}
          className="ahsora-rich-editable"
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
            maxHeight: '480px',
            padding: '14px 16px',
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
            maxHeight: '480px',
            overflowY: 'auto',
            padding: '16px 20px',
            backgroundColor: '#FAFAF9',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginBottom: '8px', textTransform: 'uppercase' }}>
            Live Article Preview
          </div>
          <div
            className="rich-article-content"
            style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#334155' }}
            dangerouslySetInnerHTML={{ __html: value || '<em style="color:#94A3B8;">No content written yet.</em>' }}
          />
        </div>
      )}

      {/* ── Link Insertion Modal ── */}
      {linkModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
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
              position: 'relative',
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
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
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
          💡 Select text to <strong>Bold</strong>, <mark style={{ backgroundColor: '#FEF08A', padding: '1px 4px', borderRadius: '3px' }}>Highlight</mark>, or add <u>Links</u>
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
