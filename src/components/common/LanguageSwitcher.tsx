'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageCode } from '@/lib/i18n/languages';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'portal' | 'mobile';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'navbar',
  className = '',
}: LanguageSwitcherProps) {
  const { language, setLanguage, currentLangInfo, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Mobile drawer variant - Collapsed by default so it never forces an open dropdown when menu is accessed
  if (variant === 'mobile') {
    return (
      <div
        ref={containerRef}
        className={`mobile-lang-switcher notranslate ${className}`}
        translate="no"
        style={{
          padding: '12px 0 6px',
          borderTop: '1px solid #E2E8F0',
          marginTop: '6px',
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="notranslate"
          translate="no"
          aria-expanded={isOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '9px',
            border: '1px solid #E2E8F0',
            backgroundColor: isOpen ? '#F0FFF4' : '#F8FAFC',
            color: '#1E293B',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.84rem',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} color="#059669" />
            <span style={{ fontSize: '0.84rem', color: '#475569' }}>Language:</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>
              {currentLangInfo.flag} {currentLangInfo.name} ({currentLangInfo.code.toUpperCase()})
            </span>
          </div>
          <ChevronDown
            size={16}
            color="#64748B"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {isOpen && (
          <div
            className="notranslate"
            translate="no"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              maxHeight: '320px',
              overflowY: 'auto',
              paddingRight: '4px',
              marginTop: '10px',
              animation: 'fadeInMenu 0.18s ease-out',
            }}
          >
            {languages.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  className="notranslate"
                  translate="no"
                  onClick={() => handleSelectLanguage(item.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: isSelected ? '1.5px solid #059669' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#F0FFF4' : '#FFFFFF',
                    color: isSelected ? '#065F46' : '#1E293B',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div className="notranslate" translate="no" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="notranslate" translate="no" style={{ fontSize: '1.05rem', lineHeight: 1 }}>{item.flag}</span>
                    <div className="notranslate" translate="no" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                      <span className="notranslate" translate="no">{item.nativeName}</span>
                      <span className="notranslate" translate="no" style={{ fontSize: '0.68rem', color: '#64748B' }}>{item.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check size={14} color="#059669" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Portal topbar variant styling
  const isPortal = variant === 'portal';

  return (
    <div
      ref={containerRef}
      className={`lang-switcher-container notranslate ${className}`}
      translate="no"
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* Trigger Button - Protected from Google Translate */}
      <button
        type="button"
        className="notranslate"
        translate="no"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title={`Change Language (Current: ${currentLangInfo.name})`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isPortal ? '7px' : '6px',
          padding: isPortal ? '6px 11px' : '5px 10px',
          height: isPortal ? '36px' : '32px',
          borderRadius: isPortal ? '8px' : '7px',
          border: isPortal ? '1px solid #E2E8F0' : '1px solid #CBD5E1',
          backgroundColor: isOpen ? '#F0FFF4' : '#FFFFFF',
          color: isOpen ? '#059669' : '#334155',
          fontSize: '0.8125rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.18s ease',
          boxShadow: isOpen ? '0 0 0 2px rgba(5, 150, 105, 0.2)' : 'none',
        }}
      >
        <Globe size={isPortal ? 16 : 14} color={isOpen ? '#059669' : '#64748B'} />
        <span className="notranslate" translate="no" style={{ fontSize: '0.95rem', lineHeight: 1 }}>{currentLangInfo.flag}</span>
        <span
          className="notranslate"
          translate="no"
          style={{
            fontWeight: 600,
            fontSize: '0.8125rem',
            whiteSpace: 'nowrap',
          }}
        >
          {currentLangInfo.code.toUpperCase()}
        </span>
        <ChevronDown
          size={13}
          color="#64748B"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {/* Dropdown Menu - Protected from Google Translate */}
      {isOpen && (
        <div
          role="listbox"
          className="notranslate"
          translate="no"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '230px',
            maxHeight: '380px',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.14), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
            padding: '6px',
            zIndex: 100,
            animation: 'fadeInMenu 0.18s ease-out',
          }}
        >
          {/* Header indicator */}
          <div
            className="notranslate"
            translate="no"
            style={{
              padding: '6px 10px 8px',
              borderBottom: '1px solid #F1F5F9',
              marginBottom: '4px',
            }}
          >
            <span
              className="notranslate"
              translate="no"
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
              }}
            >
              Choose Language / ভাষা
            </span>
          </div>

          <div className="notranslate" translate="no" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {languages.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  className="notranslate"
                  translate="no"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(item.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isSelected ? '#F0FFF4' : 'transparent',
                    color: isSelected ? '#065F46' : '#1E293B',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="notranslate" translate="no" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="notranslate" translate="no" style={{ fontSize: '1.2rem', lineHeight: 1 }}>{item.flag}</span>
                    <div className="notranslate" translate="no" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                      <span
                        className="notranslate"
                        translate="no"
                        style={{
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.85rem',
                        }}
                      >
                        {item.nativeName}
                      </span>
                      <span className="notranslate" translate="no" style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {item.name} {item.dir === 'rtl' ? '(RTL)' : ''}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className="notranslate"
                      translate="no"
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#DCFCE7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={13} color="#059669" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
