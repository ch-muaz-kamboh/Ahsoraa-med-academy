'use client';

import React, { useState, useEffect } from 'react';
import { ListOrdered, ChevronDown, ChevronUp, Hash, BookOpen } from 'lucide-react';
import { ArticleIndexItem } from '@/lib/cms-store';

interface ArticleTableOfContentsProps {
  indexes?: ArticleIndexItem[];
  htmlContent: string;
}

export function parseHeadingsFromHtml(html: string): ArticleIndexItem[] {
  if (!html) return [];
  const results: ArticleIndexItem[] = [];
  const headingRegex = /<h([23])(?:\s+id=["']([^"']*)["'])?[^>]*>(.*?)<\/h\1>/gi;
  let match;
  let counter = 1;

  while ((match = headingRegex.exec(html)) !== null) {
    const rawId = match[2];
    const rawText = match[3].replace(/<[^>]*>/g, '').trim();
    if (!rawText) continue;

    const slug = rawId || rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `section-${counter}`;
    results.push({
      id: slug,
      title: rawText,
    });
    counter++;
  }

  return results;
}

export default function ArticleTableOfContents({
  indexes,
  htmlContent,
}: ArticleTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>('');

  const items = (indexes && indexes.length > 0)
    ? indexes
    : parseHeadingsFromHtml(htmlContent);

  // Active section tracking on scroll
  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120; // 120px offset for top header
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(items[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (items.length === 0) return null;

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // Offset for navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label="Table of Contents"
      style={{
        backgroundColor: '#F8FAFC',
        border: '1.5px solid #E2E8F0',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '32px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ListOrdered size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Table of Contents
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Jump directly to any section in this article
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              backgroundColor: '#E2E8F0',
              color: '#475569',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '12px',
            }}
          >
            {items.length} sections
          </span>
          {isOpen ? <ChevronUp size={18} color="#64748B" /> : <ChevronDown size={18} color="#64748B" />}
        </div>
      </div>

      {isOpen && (
        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '18px 0 0 0',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {items.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id || index}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToHeading(item.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#059669' : '#334155',
                    backgroundColor: isActive ? '#ECFDF5' : 'transparent',
                    borderLeft: isActive ? '3px solid #059669' : '3px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#F1F5F9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#059669' : '#E2E8F0',
                      color: isActive ? '#FFFFFF' : '#64748B',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span style={{ lineHeight: 1.4 }}>{item.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
