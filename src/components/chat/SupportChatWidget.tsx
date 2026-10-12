'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Bot,
  User,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'When is the next IMAT exam?',
  'When does IMAT registration open?',
  'What packages do you offer?',
  'What is included in each package?',
  'How much do your packages cost?',
  'How can I enrol?',
  'How can I contact your team?',
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-init',
  role: 'model',
  content:
    '👋 Hello! I am **Ahsora Support AI**.\n\nI can help you with details about our **IMAT prep packages**, **pricing**, **how to enrol**, and **official Italian admission deadlines & exam dates**.\n\nHow can I help you today? You can choose a common question below or type your own.',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      textareaRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setErrorMessage(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyPayload = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok && data.error) {
        setErrorMessage(data.error);
        return;
      }

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Thank you for reaching out. Please check our packages or contact admissions directly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.error('Chat error:', err);
      setErrorMessage('Network error. Please try again or message us on WhatsApp at +39 333 3444 479.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setErrorMessage(null);
  };

  // Helper to render markdown-like links, bold, lists
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} style={{ height: '4px' }} />;

          // Process markdown links [text](url) and bold **bold**
          const parts: React.ReactNode[] = [];
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          let lastIndex = 0;
          let match;

          while ((match = linkRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(renderBoldText(line.slice(lastIndex, match.index)));
            }

            const linkText = match[1];
            const linkUrl = match[2];
            const isInternal = linkUrl.startsWith('/');

            if (isInternal) {
              parts.push(
                <Link
                  key={`link-${idx}-${match.index}`}
                  href={linkUrl}
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: '#059669',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                  }}
                >
                  {linkText}
                </Link>
              );
            } else {
              parts.push(
                <a
                  key={`link-${idx}-${match.index}`}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#059669',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  {linkText}
                  <ExternalLink size={11} style={{ verticalAlign: 'middle' }} />
                </a>
              );
            }

            lastIndex = linkRegex.lastIndex;
          }

          if (lastIndex < line.length) {
            parts.push(renderBoldText(line.slice(lastIndex)));
          }

          const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');

          return (
            <p
              key={idx}
              style={{
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.55,
                paddingLeft: isBullet ? '12px' : '0',
                position: isBullet ? 'relative' : 'static',
              }}
            >
              {isBullet && (
                <span style={{ position: 'absolute', left: '0', color: '#059669', fontWeight: 800 }}>•</span>
              )}
              {parts.length > 0 ? parts : line}
            </p>
          );
        })}
      </div>
    );
  };

  const renderBoldText = (text: string): React.ReactNode => {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const pieces: React.ReactNode[] = [];
    let last = 0;
    let bMatch;

    while ((bMatch = boldRegex.exec(text)) !== null) {
      if (bMatch.index > last) {
        pieces.push(text.slice(last, bMatch.index));
      }
      pieces.push(
        <strong key={`b-${bMatch.index}`} style={{ fontWeight: 700, color: '#0F172A' }}>
          {bMatch[1]}
        </strong>
      );
      last = boldRegex.lastIndex;
    }

    if (last < text.length) {
      pieces.push(text.slice(last));
    }

    return pieces;
  };

  return (
    <>
      {/* ── 1. Floating Launcher Button ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9990,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
        }}
      >
        {/* Launcher Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 8px 24px rgba(5,150,105,0.4), 0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            transform: isOpen ? 'rotate(90deg)' : 'scale(1)',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = isOpen ? 'rotate(90deg) scale(1.05)' : 'scale(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.transform = isOpen ? 'rotate(90deg)' : 'scale(1)')}
        >
          {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
        </button>
      </div>

      {/* ── 2. Floating Chat Modal Window ── */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            height: '590px',
            maxHeight: 'calc(100vh - 120px)',
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(15,23,42,0.22), 0 4px 12px rgba(0,0,0,0.06)',
            border: '1.5px solid #E2E8F0',
            zIndex: 9991,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'inherit',
            animation: 'fadeInUp 0.25s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'rgba(92,237,115,0.15)',
                  border: '1px solid rgba(92,237,115,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5CED73',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    Ahsora Support AI
                  </h3>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#5CED73',
                      boxShadow: '0 0 6px #5CED73',
                    }}
                  />
                </div>
                <p style={{ margin: 0, fontSize: '0.725rem', color: '#94A3B8' }}>
                  Customer Support · Instant Answers
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleResetChat}
                title="Restart chat"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#CBD5E1',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#CBD5E1',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                <ChevronDown size={17} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: '#FAFCFA',
            }}
          >
            {messages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isUser ? '#059669' : '#0F172A',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {isUser ? <User size={14} /> : <Bot size={14} color="#5CED73" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    style={{
                      maxWidth: '82%',
                      padding: '12px 14px',
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      background: isUser ? '#059669' : '#FFFFFF',
                      color: isUser ? '#FFFFFF' : '#1E293B',
                      border: isUser ? 'none' : '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    {isUser ? (
                      <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5, color: '#FFFFFF' }}>
                        {msg.content}
                      </p>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}
                    <div
                      style={{
                        textAlign: isUser ? 'right' : 'left',
                        fontSize: '0.675rem',
                        marginTop: '4px',
                        color: isUser ? 'rgba(255,255,255,0.7)' : '#94A3B8',
                      }}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#0F172A',
                    color: '#5CED73',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bot size={14} color="#5CED73" />
                </div>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '4px 16px 16px 16px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#059669',
                      animation: 'pulse 1s infinite',
                    }}
                  />
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#059669',
                      animation: 'pulse 1s infinite 0.2s',
                    }}
                  />
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#059669',
                      animation: 'pulse 1s infinite 0.4s',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '6px' }}>Thinking...</span>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#991B1B',
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Suggested Question Chips (Show only initially or when idle) */}
            {messages.length <= 2 && !isLoading && (
              <div style={{ marginTop: '8px' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={12} color="#059669" /> Frequently Asked
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      style={{
                        textAlign: 'left',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '12px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#059669';
                        e.currentTarget.style.background = '#F0FFF4';
                        e.currentTarget.style.color = '#059669';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.color = '#0F172A';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div
            style={{
              padding: '12px 16px',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px',
                background: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: '16px',
                padding: '6px 8px 6px 12px',
                transition: 'border-color 0.2s',
              }}
              onFocus={() => (textareaRef.current!.parentElement!.style.borderColor = '#059669')}
              onBlur={() => (textareaRef.current!.parentElement!.style.borderColor = '#CBD5E1')}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about packages, prices, IMAT dates..."
                rows={1}
                maxLength={600}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  color: '#0F172A',
                  padding: '6px 0',
                  maxHeight: '80px',
                }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: input.trim() && !isLoading ? '#059669' : '#CBD5E1',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <Send size={16} />
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '6px',
                fontSize: '0.6875rem',
                color: '#94A3B8',
              }}
            >
              <span>Press Enter to send (Shift+Enter for line)</span>
              <span>Official Academy Support</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
