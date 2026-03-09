import React from 'react';
import { ParsedOutput } from '@/types';

interface PdfRendererProps {
  parsed: ParsedOutput;
  timestamp: Date;
  visible?: boolean;
}

const PdfRenderer = React.forwardRef<HTMLDivElement, PdfRendererProps>(({ parsed, timestamp, visible = false }, ref) => {
  const dateStr = timestamp.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div
      ref={ref}
      style={{
        position: visible ? 'fixed' : 'absolute',
        left: visible ? '0' : '-9999px',
        top: 0,
        width: '794px', // A4 at 96dpi
        zIndex: visible ? 9999 : -1,
        background: '#ffffff',
        color: '#1a1a2e',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: '13px',
        lineHeight: '1.6',
        padding: '0',
      }}
    >
      {/* Cover Page */}
      <div style={{
        padding: '80px 60px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        pageBreakAfter: 'always',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #6c5ce7, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px',
          color: 'white', fontSize: '28px', fontWeight: 700,
        }}>✦</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>
          Ghibli Days
        </h1>
        <p style={{ fontSize: '12px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 32px' }}>
          Content Generation Report
        </p>
        <div style={{ width: '60px', height: '3px', background: '#6c5ce7', margin: '0 auto 32px' }} />
        <p style={{ fontSize: '16px', color: '#333', maxWidth: '500px', margin: '0 0 16px' }}>
          {parsed.titles[0] || 'Generated Content'}
        </p>
        <p style={{ fontSize: '12px', color: '#999' }}>{dateStr}</p>
      </div>

      {/* Channel DNA */}
      {parsed.channelDNA && (
        <div style={{ padding: '40px 60px', pageBreakInside: 'avoid' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#6c5ce7', marginBottom: '16px', borderBottom: '2px solid #f0f0f5', paddingBottom: '8px' }}>
            Channel DNA Analysis
          </h2>
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>
            {parsed.channelDNA}
          </p>
        </div>
      )}

      {/* Titles */}
      {parsed.titles.length > 0 && (
        <div style={{ padding: '40px 60px', pageBreakInside: 'avoid' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#6c5ce7', marginBottom: '16px', borderBottom: '2px solid #f0f0f5', paddingBottom: '8px' }}>
            Titles ({parsed.titles.length})
          </h2>
          {parsed.titles.map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 16px', marginBottom: '6px',
              background: '#f8f7ff', borderRadius: '8px', border: '1px solid #eee',
            }}>
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: '#6c5ce7', color: 'white',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ fontSize: '13px', color: '#333' }}>{t}</span>
            </div>
          ))}
        </div>
      )}

      {/* Story */}
      {parsed.story && (
        <div style={{ padding: '40px 60px', pageBreakInside: 'avoid' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#6c5ce7', marginBottom: '16px', borderBottom: '2px solid #f0f0f5', paddingBottom: '8px' }}>
            Story
          </h2>
          {parsed.story.split(/\n\n+/).filter(p => p.trim()).map((p, i) => (
            <p key={i} style={{ fontSize: '13px', lineHeight: '1.9', color: '#444', marginBottom: '12px' }}>
              {p.trim()}
            </p>
          ))}
        </div>
      )}

      {/* Characters */}
      {parsed.characters.length > 0 && (
        <div style={{ padding: '40px 60px', pageBreakInside: 'avoid' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#6c5ce7', marginBottom: '16px', borderBottom: '2px solid #f0f0f5', paddingBottom: '8px' }}>
            Characters ({parsed.characters.length})
          </h2>
          {parsed.characters.map((c, i) => (
            <div key={i} style={{
              padding: '12px 16px', marginBottom: '8px',
              background: '#f8f7ff', borderRadius: '8px', border: '1px solid #eee',
            }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e', marginBottom: '4px' }}>{c.label}</div>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.7', margin: 0 }}>{c.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Image Prompts */}
      {parsed.imagePrompts.length > 0 && (
        <div style={{ padding: '40px 60px', pageBreakInside: 'avoid' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#6c5ce7', marginBottom: '16px', borderBottom: '2px solid #f0f0f5', paddingBottom: '8px' }}>
            Image Prompts ({parsed.imagePrompts.length})
          </h2>
          {parsed.imagePrompts.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '10px 16px', marginBottom: '6px',
              background: '#f8f7ff', borderRadius: '8px', border: '1px solid #eee',
            }}>
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: '#6c5ce7', color: 'white',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '2px',
              }}>{i + 1}</span>
              <p style={{ fontSize: '12px', lineHeight: '1.8', color: '#444', margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>
      )}

      {/* Video Prompts */}
      {parsed.videoPrompts.length > 0 && (
        <div style={{ padding: '40px 60px', pageBreakInside: 'avoid' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#6c5ce7', marginBottom: '16px', borderBottom: '2px solid #f0f0f5', paddingBottom: '8px' }}>
            Video Prompts ({parsed.videoPrompts.length})
          </h2>
          {parsed.videoPrompts.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '10px 16px', marginBottom: '6px',
              background: '#f8f7ff', borderRadius: '8px', border: '1px solid #eee',
            }}>
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: '#6c5ce7', color: 'white',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '2px',
              }}>{i + 1}</span>
              <p style={{ fontSize: '12px', lineHeight: '1.8', color: '#444', margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '24px 60px',
        borderTop: '1px solid #eee',
        display: 'flex', justifyContent: 'space-between',
        fontSize: '11px', color: '#999',
      }}>
        <span>Generated by Ghibli Days</span>
        <span>{dateStr}</span>
      </div>
    </div>
  );
});

PdfRenderer.displayName = 'PdfRenderer';

export default PdfRenderer;
